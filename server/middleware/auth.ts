import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const headerName = "authorization";

// Cache the admin token to avoid database queries on every request
let cachedAdminToken: string | null | undefined = undefined;
let tokenCacheTime = 0;
const TOKEN_CACHE_TTL = 60000; // 1 minute cache

async function getAdminToken(): Promise<string | null> {
  // Check cache first
  const now = Date.now();
  if (cachedAdminToken !== undefined && (now - tokenCacheTime) < TOKEN_CACHE_TTL) {
    return cachedAdminToken;
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { id: "profile" },
      select: { adminToken: true },
    });

    cachedAdminToken = profile?.adminToken ?? null;
    tokenCacheTime = now;
    return cachedAdminToken;
  } catch (error) {
    console.error("Error fetching admin token from database:", error);
    // Fallback to env variable for initial setup
    return process.env.CMS_ADMIN_TOKEN ?? null;
  }
}

export async function requireAdminToken(req: Request, res: Response, next: NextFunction) {
  const adminToken = await getAdminToken();

  if (!adminToken) {
    res.status(500).json({
      error: "CMS_ADMIN_TOKEN is not configured. Please set it in the database.",
    });
    return;
  }

  const authorization = req.header(headerName);
  if (!authorization) {
    res.status(401).json({
      error: "Missing Authorization header",
    });
    return;
  }

  const [scheme, token] = authorization.split(" ");
  if (!scheme || scheme.toLowerCase() !== "bearer" || !token) {
    res.status(401).json({
      error: "Authorization header must use Bearer token",
    });
    return;
  }

  if (token !== adminToken) {
    res.status(403).json({
      error: "Invalid token",
    });
    return;
  }

  next();
}

// Function to invalidate token cache (call after updating token)
export function invalidateTokenCache() {
  cachedAdminToken = undefined;
  tokenCacheTime = 0;
}

