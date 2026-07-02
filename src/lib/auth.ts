import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET environment variable is required in production");
    }
    console.warn("JWT_SECRET not set, using default secret. Change this in production!");
    return new TextEncoder().encode("default-secret-change-in-production-min-32-chars");
  }

  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createAdminSession(password: string) {
  const admin = await prisma.admin.findUnique({
    where: { username: "admin" },
  });

  if (!admin) {
    throw new Error("Admin not found");
  }

  const isValid = await verifyPassword(password, admin.password);

  if (!isValid) {
    throw new Error("Invalid password");
  }

  const secret = getJwtSecret();

  const token = await new SignJWT({ username: admin.username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);

  cookies().set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return { success: true };
}

export async function verifyAdminSession(): Promise<boolean> {
  const token = cookies().get("admin_session")?.value;

  if (!token) {
    return false;
  }

  try {
    const secret = getJwtSecret();
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function destroyAdminSession() {
  cookies().delete("admin_session");
}
