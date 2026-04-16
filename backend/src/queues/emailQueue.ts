import { Queue } from "bullmq";
import { env } from "../config/env.js";
import { redisConnection } from "../config/redis.js";

export const emailQueue = new Queue(env.queueName, {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 500 }
  }
});
