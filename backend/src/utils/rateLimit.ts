import { redis } from "../config/redis.js";
import { env } from "../config/env.js";
import { formatHourKey } from "./time.js";

export const getRateLimitKey = (sender: string, date: Date) => {
  const hourKey = formatHourKey(date);
  return `email_rate:${sender}:${hourKey}`;
};

export const incrementRateLimit = async (sender: string, date: Date) => {
  const key = getRateLimitKey(sender, date);
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, 60 * 60);
  }
  return { key, count, limit: env.emailRateLimitPerHour };
};
