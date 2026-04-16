import dotenv from "dotenv";
import path from "path";

// Load .env from backend directory
dotenv.config({ path: path.join(process.cwd(), ".env") });

const required = (key: string, fallback?: string) => {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing env: ${key}`);
  }
  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: required("DATABASE_URL"),
  redisUrl: required("REDIS_URL", "redis://localhost:6379"),
  jwtSecret: required("JWT_SECRET", "default-jwt-secret-change-in-production"),
  queueName: process.env.EMAIL_QUEUE_NAME ?? "email-queue",
  emailMode: process.env.EMAIL_MODE ?? "production", // "test" or "production"
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  worker: {
    concurrency: Number(process.env.WORKER_CONCURRENCY ?? 5),
    attempts: Number(process.env.WORKER_ATTEMPTS ?? 3),
    backoffMs: Number(process.env.WORKER_BACKOFF_MS ?? 5000)
  },
  emailRateLimitPerHour: Number(process.env.EMAILS_PER_HOUR ?? 100),
  minDelayMs: Number(process.env.MIN_DELAY_MS ?? 500),
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    tokenAudience: process.env.GOOGLE_TOKEN_AUDIENCE
  },
  smtp: {
    host: process.env.SMTP_HOST ?? "smtp.ethereal.email",
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    user: required("SMTP_USER"),
    pass: required("SMTP_PASS")
  },
  ethereal: {
    user: process.env.ETHEREAL_USER ?? "",
    pass: process.env.ETHEREAL_PASS ?? ""
  },
  enableWorker: (process.env.ENABLE_WORKER ?? "true") === "true"
};
