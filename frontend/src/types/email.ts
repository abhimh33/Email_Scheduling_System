export type EmailStatus = "scheduled" | "sent" | "failed";

export type Email = {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  scheduledAt: string;
  status: EmailStatus;
  sentAt?: string | null;
  providerMessageId?: string | null;
};
