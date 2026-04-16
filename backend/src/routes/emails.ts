import { Router } from "express";
import { z } from "zod";
import { requireGoogleAuth, AuthedRequest } from "../utils/auth.js";
import { 
  scheduleEmails, 
  listScheduledEmails, 
  listSentEmails, 
  cancelScheduledEmail,
  duplicateEmail,
  searchEmails
} from "../services/emailService.js";

const router = Router();

const scheduleSchema = z.object({
  recipients: z.array(z.string().email()).min(1),
  subject: z.string().min(1),
  body: z.string().min(1),
  scheduledAt: z.string().datetime(),
  delayBetweenMs: z.number().int().min(0).default(0)
});

router.post("/schedule", requireGoogleAuth, async (req: AuthedRequest, res) => {
  try {
    const payload = scheduleSchema.parse(req.body);
    const sender = req.userEmail ?? "";
    const scheduledAt = new Date(payload.scheduledAt);
    const emails = await scheduleEmails(
      {
        sender,
        recipients: payload.recipients,
        subject: payload.subject,
        body: payload.body,
        scheduledAt,
        delayBetweenMs: payload.delayBetweenMs
      },
      req.userId ?? ""
    );
    res.json({ count: emails.length, emails });
  } catch (error) {
    res.status(400).json({ error: "Invalid schedule request" });
  }
});

router.get("/scheduled", requireGoogleAuth, async (req: AuthedRequest, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
  const result = await listScheduledEmails(req.userId ?? "", page, limit);
  res.json(result);
});

router.get("/sent", requireGoogleAuth, async (req: AuthedRequest, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
  const result = await listSentEmails(req.userId ?? "", page, limit);
  res.json(result);
});

router.delete("/:id", requireGoogleAuth, async (req: AuthedRequest, res) => {
  try {
    const result = await cancelScheduledEmail(req.params.id, req.userId ?? "");
    if (!result) {
      return res.status(404).json({ error: "Email not found or already sent" });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to cancel email" });
  }
});

router.post("/:id/duplicate", requireGoogleAuth, async (req: AuthedRequest, res) => {
  try {
    const { scheduledAt } = req.body;
    if (!scheduledAt) {
      return res.status(400).json({ error: "scheduledAt is required" });
    }
    const result = await duplicateEmail(
      req.params.id, 
      req.userId ?? "", 
      new Date(scheduledAt)
    );
    if (!result) {
      return res.status(404).json({ error: "Email not found" });
    }
    res.json({ emails: result });
  } catch (error) {
    res.status(500).json({ error: "Failed to duplicate email" });
  }
});

router.get("/search", requireGoogleAuth, async (req: AuthedRequest, res) => {
  try {
    const query = (req.query.q as string) || "";
    const status = req.query.status as "scheduled" | "sent" | "failed" | undefined;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
    const result = await searchEmails(req.userId ?? "", query, status, page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
});

export default router;
