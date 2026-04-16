import { useEffect, useState, useCallback } from "react";
import { Email } from "../types/email";
import { getScheduledEmails, getSentEmails } from "../services/emailService";

export const useEmails = (idToken?: string) => {
  const [scheduled, setScheduled] = useState<Email[]>([]);
  const [sent, setSent] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    scheduled: { total: 0, page: 1, totalPages: 1 },
    sent: { total: 0, page: 1, totalPages: 1 }
  });

  const refresh = useCallback(async (scheduledPage = 1, sentPage = 1) => {
    if (!idToken) return;
    setLoading(true);
    try {
      const [scheduledRes, sentRes] = await Promise.all([
        getScheduledEmails(idToken, scheduledPage),
        getSentEmails(idToken, sentPage)
      ]);
      setScheduled(scheduledRes.emails);
      setSent(sentRes.emails);
      setPagination({
        scheduled: { total: scheduledRes.total, page: scheduledRes.page, totalPages: scheduledRes.totalPages },
        sent: { total: sentRes.total, page: sentRes.page, totalPages: sentRes.totalPages }
      });
    } finally {
      setLoading(false);
    }
  }, [idToken]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { scheduled, sent, loading, pagination, refresh };
};
