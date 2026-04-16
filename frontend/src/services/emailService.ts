import { api } from "./api";
import { Email } from "../types/email";

export type SchedulePayload = {
  recipients: string[];
  subject: string;
  body: string;
  scheduledAt: string;
  delayBetweenMs: number;
};

export const scheduleEmails = async (payload: SchedulePayload, idToken: string) => {
  const res = await api.post(
    "/api/emails/schedule",
    payload,
    {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    }
  );
  return res.data as { count: number; emails: Email[] };
};

type PaginatedResponse = {
  emails: Email[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export const getScheduledEmails = async (idToken: string, page = 1, limit = 50) => {
  const res = await api.get(`/api/emails/scheduled?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${idToken}`
    }
  });
  return res.data as PaginatedResponse;
};

export const getSentEmails = async (idToken: string, page = 1, limit = 50) => {
  const res = await api.get(`/api/emails/sent?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${idToken}`
    }
  });
  return res.data as PaginatedResponse;
};

export const cancelEmail = async (emailId: string, idToken: string) => {
  const res = await api.delete(`/api/emails/${emailId}`, {
    headers: {
      Authorization: `Bearer ${idToken}`
    }
  });
  return res.data as { id: string; cancelled: boolean };
};

export const duplicateEmail = async (
  emailId: string, 
  scheduledAt: string, 
  idToken: string
) => {
  const res = await api.post(
    `/api/emails/${emailId}/duplicate`,
    { scheduledAt },
    {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    }
  );
  return res.data as { emails: Email[] };
};

export const searchEmails = async (
  query: string,
  status: string | undefined,
  idToken: string,
  page = 1,
  limit = 50
) => {
  const params = new URLSearchParams();
  if (query) params.append("q", query);
  if (status) params.append("status", status);
  params.append("page", String(page));
  params.append("limit", String(limit));
  
  const res = await api.get(`/api/emails/search?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${idToken}`
    }
  });
  return res.data as PaginatedResponse;
};
