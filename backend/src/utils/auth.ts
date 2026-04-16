import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { upsertUserFromGoogle, verifyGoogleIdToken } from "../services/authService.js";
import { env } from "../config/env.js";
import { prisma } from "../db/prisma.js";

export type AuthedRequest = Request & { userId?: string; userEmail?: string };

// Verify JWT token for credentials-based auth
const verifyJwt = (token: string): { userId: string; email: string } | null => {
  try {
    const payload = jwt.verify(token, env.jwtSecret) as { userId: string; email: string };
    return payload;
  } catch {
    return null;
  }
};

export const requireAuth = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing Bearer token" });
    }
    const token = authHeader.replace("Bearer ", "").trim();
    
    // First, try to verify as JWT (for credentials auth)
    const jwtPayload = verifyJwt(token);
    if (jwtPayload) {
      const user = await prisma.user.findUnique({ where: { id: jwtPayload.userId } });
      if (user) {
        req.userId = user.id;
        req.userEmail = user.email;
        return next();
      }
    }
    
    // If JWT fails, try Google ID token
    try {
      const googlePayload = await verifyGoogleIdToken(token);
      const user = await upsertUserFromGoogle({
        sub: googlePayload.sub ?? "",
        email: googlePayload.email ?? "",
        name: googlePayload.name ?? null,
        picture: googlePayload.picture ?? null
      });
      req.userId = user.id;
      req.userEmail = user.email;
      return next();
    } catch {
      // Google token verification also failed
    }
    
    res.status(401).json({ error: "Unauthorized" });
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

// Keep for backward compatibility
export const requireGoogleAuth = requireAuth;
