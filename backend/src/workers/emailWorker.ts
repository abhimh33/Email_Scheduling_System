import { Worker, Job } from "bullmq";
import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { redis, redisConnection } from "../config/redis.js";
import { prisma } from "../db/prisma.js";
import { incrementRateLimit } from "../utils/rateLimit.js";
import { msUntilNextHour } from "../utils/time.js";

// Create transport based on EMAIL_MODE
const createTransport = () => {
  if (env.emailMode === "test") {
    // Use Ethereal for testing with fake emails
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: env.ethereal.user,
        pass: env.ethereal.pass
      }
    });
  } else {
    // Use configured SMTP (Gmail) for production
    return nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.secure,
      auth: {
        user: env.smtp.user,
        pass: env.smtp.pass
      }
    });
  }
};

const transport = createTransport();

const acquireGapSlot = async (sender: string) => {
  const key = `email_gap:${sender}`;
  const ok = await redis.set(key, Date.now().toString(), "PX", env.minDelayMs, "NX");
  if (ok) {
    return { ok: true, delayMs: 0 };
  }
  const ttl = await redis.pttl(key);
  return { ok: false, delayMs: Math.max(ttl, env.minDelayMs) };
};

const moveJobToDelayed = async (job: Job, delayMs: number) => {
  const delayUntil = Date.now() + delayMs;
  await job.moveToDelayed(delayUntil, job.token);
};

export const startEmailWorker = () => {
  const worker = new Worker(
    env.queueName,
    async (job) => {
      const emailId = job.data.emailId as string;
      const email = await prisma.email.findUnique({ where: { id: emailId } });
      if (!email) {
        return;
      }

      if (email.status === "sent" && email.providerMessageId) {
        return;
      }

      await prisma.emailJob.update({
        where: { emailId },
        data: { status: "processing" }
      });

      const now = new Date();
      const rate = await incrementRateLimit(email.sender, now);
      if (rate.count > rate.limit) {
        const delayMs = msUntilNextHour(now);
        await prisma.emailJob.update({
          where: { emailId },
          data: { status: "delayed" }
        });
        await moveJobToDelayed(job, delayMs);
        return;
      }

      const gap = await acquireGapSlot(email.sender);
      if (!gap.ok) {
        await prisma.emailJob.update({
          where: { emailId },
          data: { status: "delayed" }
        });
        await moveJobToDelayed(job, gap.delayMs);
        return;
      }

      const info = await transport.sendMail({
        from: email.sender,
        to: email.recipient,
        subject: email.subject,
        text: email.body
      });

      // Log based on email mode
      if (env.emailMode === "test") {
        console.log("📧 [TEST MODE] Email sent! Preview at:", nodemailer.getTestMessageUrl(info));
      } else {
        console.log("📧 [PRODUCTION] Email sent! Message ID:", info.messageId, "To:", email.recipient);
      }

      await prisma.email.update({
        where: { id: emailId },
        data: {
          status: "sent",
          sentAt: new Date(),
          providerMessageId: info.messageId
        }
      });

      await prisma.emailJob.update({
        where: { emailId },
        data: { status: "completed" }
      });
    },
    {
      connection: redisConnection,
      concurrency: env.worker.concurrency,
      settings: {
        backoffStrategy: () => env.worker.backoffMs
      },
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 500 }
    }
  );

  worker.on("failed", async (job) => {
    if (!job) return;
    const emailId = job.data.emailId as string;
    await prisma.email.update({
      where: { id: emailId },
      data: { status: "failed" }
    });
    await prisma.emailJob.update({
      where: { emailId },
      data: { status: "failed", attempts: { increment: 1 } }
    });
  });

  return worker;
};
