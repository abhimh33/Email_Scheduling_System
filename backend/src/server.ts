import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.js";
import emailRoutes from "./routes/emails.js";
import { startEmailWorker } from "./workers/emailWorker.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/", (_, res) => {
  res.json({ message: "ReachInbox API", version: "1.0.0" });
});

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/emails", emailRoutes);

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
  if (env.enableWorker) {
    startEmailWorker();
    console.log("Email worker started");
  }
});
