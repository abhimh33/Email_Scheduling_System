import { Worker } from "bullmq";
import { Resend } from "resend";
import { env } from "../config/env.js";
import { redisConnection } from "../config/redis.js";
import { prisma } from "../db/prisma.js";

// Initialize Resend client
const resend = new Resend(env.resendApiKey);

export const startEmailWorker = () => {
  const worker = new Worker(
    env.queueName,
    async (job) => {
      const emailId = job.data.emailId as string;
      
      console.log(`Processing email job: ${emailId}`);
      
      const email = await prisma.email.findUnique({ where: { id: emailId } });
      if (!email) {
        console.log(`Email ${emailId} not found in database`);
        return;
      }

      if (email.status === "sent" && email.providerMessageId) {
        console.log(`Email ${emailId} already sent`);
        return;
      }

      console.log(`Sending email to ${email.recipient}...`);

      // Send email using Resend
      const result = await resend.emails.send({
        from: email.sender,
        to: email.recipient,
        subject: email.subject,
        text: email.body
      });

      if (result.error) {
        console.error(`Resend error for ${emailId}:`, result.error);
        throw new Error(`Resend error: ${result.error.message}`);
      }

      const messageId = result.data?.id || "";
      console.log("📧 [RESEND] Email sent! Message ID:", messageId, "To:", email.recipient);

      await prisma.email.update({
        where: { id: emailId },
        data: {
          status: "sent",
          sentAt: new Date(),
          providerMessageId: messageId
        }
      });

      await prisma.emailJob.update({
        where: { emailId },
        data: { status: "completed" }
      });
    },
    {
      connection: redisConnection,
      concurrency: 1, // Process one at a time to avoid rate limits
      lockDuration: 60000, // 60 seconds
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 500 }
    }
  );

  worker.on("failed", async (job, error) => {
    if (!job) return;
    const emailId = job.data.emailId as string;
    console.error(`Job ${emailId} failed:`, error.message);
    
    await prisma.email.update({
      where: { id: emailId },
      data: { status: "failed" }
    }).catch(err => console.error("Failed to update email status:", err));
    
    await prisma.emailJob.update({
      where: { emailId },
      data: { status: "failed", attempts: { increment: 1 } }
    }).catch(err => console.error("Failed to update job status:", err));
  });

  worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed successfully`);
  });

  console.log("Email worker started");
  return worker;
};
