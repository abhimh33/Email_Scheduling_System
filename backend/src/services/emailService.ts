import { EmailStatus } from "@prisma/client";
import { prisma } from "../db/prisma.js";
import { emailQueue } from "../queues/emailQueue.js";
import { env } from "../config/env.js";

export type ScheduleEmailInput = {
  sender: string;
  recipients: string[];
  subject: string;
  body: string;
  scheduledAt: Date;
  delayBetweenMs: number;
};

export const scheduleEmails = async (input: ScheduleEmailInput, userId: string) => {
  const now = Date.now();
  const emails = await prisma.$transaction(async (tx) => {
    const created = [] as { id: string; scheduledAt: Date }[];
    for (let i = 0; i < input.recipients.length; i += 1) {
      const scheduledAt = new Date(input.scheduledAt.getTime() + i * input.delayBetweenMs);
      const email = await tx.email.create({
        data: {
          sender: input.sender,
          recipient: input.recipients[i],
          subject: input.subject,
          body: input.body,
          scheduledAt,
          status: EmailStatus.scheduled,
          userId
        }
      });
      await tx.emailJob.create({
        data: {
          emailId: email.id,
          jobId: email.id
        }
      });
      created.push({ id: email.id, scheduledAt });
    }
    return created;
  });

  for (const email of emails) {
    const delay = Math.max(0, email.scheduledAt.getTime() - now);
    await emailQueue.add(
      "send-email",
      { emailId: email.id },
      {
        jobId: email.id,
        delay,
        attempts: env.worker.attempts,
        backoff: {
          type: "exponential",
          delay: env.worker.backoffMs
        }
      }
    );
  }

  return emails;
};

export const listScheduledEmails = async (
  userId: string,
  page = 1,
  limit = 50
) => {
  const skip = (page - 1) * limit;
  const [emails, total] = await Promise.all([
    prisma.email.findMany({
      where: { userId, status: EmailStatus.scheduled },
      orderBy: { scheduledAt: "asc" },
      skip,
      take: limit
    }),
    prisma.email.count({
      where: { userId, status: EmailStatus.scheduled }
    })
  ]);
  return { emails, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const listSentEmails = async (
  userId: string,
  page = 1,
  limit = 50
) => {
  const skip = (page - 1) * limit;
  const [emails, total] = await Promise.all([
    prisma.email.findMany({
      where: { userId, status: EmailStatus.sent },
      orderBy: { sentAt: "desc" },
      skip,
      take: limit
    }),
    prisma.email.count({
      where: { userId, status: EmailStatus.sent }
    })
  ]);
  return { emails, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const cancelScheduledEmail = async (emailId: string, userId: string) => {
  const email = await prisma.email.findFirst({
    where: { id: emailId, userId, status: EmailStatus.scheduled }
  });
  
  if (!email) {
    return null;
  }

  // Remove from BullMQ queue
  const job = await emailQueue.getJob(emailId);
  if (job) {
    await job.remove();
  }

  // Update status in database
  await prisma.$transaction([
    prisma.email.update({
      where: { id: emailId },
      data: { status: EmailStatus.failed }
    }),
    prisma.emailJob.update({
      where: { emailId },
      data: { status: "failed" }
    })
  ]);

  return { id: emailId, cancelled: true };
};

export const duplicateEmail = async (emailId: string, userId: string, scheduledAt: Date) => {
  const original = await prisma.email.findFirst({
    where: { id: emailId, userId }
  });

  if (!original) {
    return null;
  }

  return scheduleEmails({
    sender: original.sender,
    recipients: [original.recipient],
    subject: original.subject,
    body: original.body,
    scheduledAt,
    delayBetweenMs: 0
  }, userId);
};

export const searchEmails = async (
  userId: string,
  query: string,
  status?: "scheduled" | "sent" | "failed",
  page = 1,
  limit = 50
) => {
  const skip = (page - 1) * limit;
  const where = {
    userId,
    ...(status && { status: status as EmailStatus }),
    ...(query && {
      OR: [
        { subject: { contains: query, mode: "insensitive" as const } },
        { recipient: { contains: query, mode: "insensitive" as const } }
      ]
    })
  };

  const [emails, total] = await Promise.all([
    prisma.email.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),
    prisma.email.count({ where })
  ]);
  return { emails, total, page, limit, totalPages: Math.ceil(total / limit) };
};
