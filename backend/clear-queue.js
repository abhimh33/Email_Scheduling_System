// Script to clear all jobs from Redis queue
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redis = new IORedis(redisUrl, { maxRetriesPerRequest: null });

const queue = new Queue('email-queue', { connection: redis });

async function clearQueue() {
  console.log('Clearing all jobs from email-queue...');
  
  // Clear all jobs
  await queue.obliterate({ force: true });
  
  console.log('✅ Queue cleared successfully!');
  
  await queue.close();
  await redis.quit();
  process.exit(0);
}

clearQueue().catch((err) => {
  console.error('Error clearing queue:', err);
  process.exit(1);
});
