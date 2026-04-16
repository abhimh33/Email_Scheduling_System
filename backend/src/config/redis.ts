import IORedis from "ioredis";
import { env } from "./env.js";

// Parse Redis URL for BullMQ connection config
const redisUrl = new URL(env.redisUrl);
export const redisConnection = {
  host: redisUrl.hostname,
  port: Number(redisUrl.port) || 6379,
  password: redisUrl.password || undefined,
  db: Number(redisUrl.pathname.slice(1)) || 0
};

export const redis = new IORedis(env.redisUrl, {
  maxRetriesPerRequest: null
});
