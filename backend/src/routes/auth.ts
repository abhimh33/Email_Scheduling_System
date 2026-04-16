import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../db/prisma.js";
import { upsertUserFromGoogle, verifyGoogleIdToken } from "../services/authService.js";
import { env } from "../config/env.js";

const router = Router();

const generateJwt = (userId: string, email: string) => {
  return jwt.sign(
    { userId, email },
    env.jwtSecret,
    { expiresIn: "7d" }
  );
};

const googleBodySchema = z.object({
  idToken: z.string().min(10)
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

router.post("/google", async (req, res) => {
  try {
    const { idToken } = googleBodySchema.parse(req.body);
    const payload = await verifyGoogleIdToken(idToken);
    const user = await upsertUserFromGoogle({
      sub: payload.sub ?? "",
      email: payload.email ?? "",
      name: payload.name ?? null,
      picture: payload.picture ?? null
    });
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: "Invalid Google token" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = registerSchema.parse(req.body);
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name || email.split("@")[0]
      }
    });
    
    const token = generateJwt(user.id, user.email);
    res.json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name 
      },
      token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    const token = generateJwt(user.id, user.email);
    res.json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        image: user.avatarUrl
      },
      token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
