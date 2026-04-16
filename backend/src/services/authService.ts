import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env.js";
import { prisma } from "../db/prisma.js";

const googleClient = new OAuth2Client(env.google.clientId);

export const verifyGoogleIdToken = async (idToken: string) => {
  if (!env.google.clientId) {
    throw new Error("GOOGLE_CLIENT_ID is not configured");
  }
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: env.google.tokenAudience ?? env.google.clientId
  });
  const payload = ticket.getPayload();
  if (!payload?.email) {
    throw new Error("Invalid Google token payload");
  }
  return payload;
};

export const upsertUserFromGoogle = async (payload: {
  sub: string;
  email: string;
  name?: string | null;
  picture?: string | null;
}) => {
  return prisma.user.upsert({
    where: { email: payload.email },
    update: {
      googleId: payload.sub,
      name: payload.name ?? undefined,
      avatarUrl: payload.picture ?? undefined
    },
    create: {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name ?? undefined,
      avatarUrl: payload.picture ?? undefined
    }
  });
};
