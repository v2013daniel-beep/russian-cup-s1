"use server";

import { prisma } from "@/lib/db";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { isMockMode, mockStats, mockTeams, mockTournament } from "@/lib/mock";

function getSecret() {
  return new TextEncoder().encode(process.env.JWT_SECRET || "demo-secret");
}

async function createToken(payload: object) {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSecret());
}

async function verifyToken(token: string) {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

// Client-facing names used by UI
export async function adminLogin(password: string) {
  return loginAdmin(password);
}

export async function adminLogout() {
  cookies().delete("admin-token");
}

export async function checkAdminAuth(): Promise<boolean> {
  const token = cookies().get("admin-token")?.value;
  if (!token) return false;
  return verifyToken(token);
}

export async function loginAdmin(password: string) {
  if (isMockMode()) {
    if (password === "demo123" || password === process.env.ADMIN_PASSWORD) {
      const token = await createToken({ admin: true });
      cookies().set("admin-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 8,
        path: "/",
      });
      return { success: true };
    }
    return { success: false, error: "Неверный пароль" };
  }

  const admin = await prisma.admin.findFirst();

  if (!admin) {
    throw new Error("Админ не настроен");
  }

  const { compare } = await import("bcryptjs");
  const isValid = await compare(password, admin.password);

  if (!isValid) {
    return { success: false, error: "Неверный пароль" };
  }

  const token = await createToken({ adminId: admin.id });

  cookies().set("admin-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
  });

  return { success: true };
}

export async function getDashboardStats() {
  if (isMockMode()) {
    return mockStats;
  }

  const tournament = await prisma.tournament.findFirst({
    orderBy: { createdAt: "desc" },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalTeams, paidTeams, pendingTeams, visitsToday, visitsTotal] =
    await Promise.all([
      prisma.team.count(),
      prisma.team.count({ where: { status: "paid" } }),
      prisma.team.count({ where: { status: "pending" } }),
      prisma.visit.count({ where: { date: { gte: today } } }),
      prisma.visit.count(),
    ]);

  return {
    totalTeams,
    paidTeams,
    pendingTeams,
    visitsToday,
    visitsTotal,
    totalRevenue: paidTeams * (tournament?.entryFee || 0),
  };
}

export async function getAdminTeams() {
  if (isMockMode()) {
    return mockTeams.map((team) => ({
      ...team,
      substitute: null,
      captainName: "Demo",
      captainNickname: "demo_captain",
      captainTelegram: "@demo",
      captainDiscord: "demo#0000",
      captainEmail: "demo@example.com",
      payment: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }

  return prisma.team.findMany({
    include: {
      players: { orderBy: { order: "asc" } },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateTeamStatus(teamId: string, status: string) {
  if (isMockMode()) {
    revalidatePath("/admin");
    revalidatePath("/admin/teams");
    return { success: true };
  }

  await prisma.team.update({
    where: { id: teamId },
    data: { status: status as any },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/teams");

  return { success: true };
}

export async function deleteTeam(teamId: string) {
  if (isMockMode()) {
    revalidatePath("/admin");
    revalidatePath("/admin/teams");
    return { success: true };
  }

  await prisma.team.delete({
    where: { id: teamId },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/teams");

  return { success: true };
}

export async function getAdminSettings() {
  if (isMockMode()) {
    return {
      ...mockTournament,
      discord: mockTournament.contacts.discord,
      telegram: mockTournament.contacts.telegram,
      email: mockTournament.contacts.email,
      responseTime: mockTournament.contacts.responseTime,
      streamUrl: "",
      streamTitle: "Трансляция скоро начнётся",
      streamActive: false,
    };
  }

  const tournament = await prisma.tournament.findFirst({
    orderBy: { createdAt: "desc" },
    include: { contacts: true },
  });

  if (!tournament) {
    throw new Error("Tournament not found");
  }

  return {
    name: tournament.name,
    date: tournament.date.toISOString().slice(0, 16),
    prizePool: tournament.prizePool,
    entryFee: tournament.entryFee,
    format: tournament.format,
    server: tournament.server,
    registrationOpen: tournament.registrationOpen,
    discord: tournament.contacts?.discord || "",
    telegram: tournament.contacts?.telegram || "",
    email: tournament.contacts?.email || "",
    responseTime: tournament.contacts?.responseTime || "",
    streamUrl: tournament.streamUrl || "",
    streamTitle: tournament.streamTitle,
    streamActive: tournament.streamActive,
  };
}

export async function updateSettings(data: {
  name: string;
  date: string;
  prizePool: string;
  entryFee: number;
  format: string;
  server: string;
  registrationOpen: boolean;
  discord: string;
  telegram: string;
  email: string;
  responseTime: string;
  streamUrl?: string;
  streamTitle?: string;
  streamActive?: boolean;
}) {
  return updateTournament({
    name: data.name,
    date: data.date,
    prizePool: data.prizePool,
    entryFee: data.entryFee,
    format: data.format,
    server: data.server,
    registrationOpen: data.registrationOpen,
    contacts: {
      discord: data.discord,
      telegram: data.telegram,
      email: data.email,
      responseTime: data.responseTime,
    },
    streamUrl: data.streamUrl || "",
    streamTitle: data.streamTitle || "Трансляция скоро начнётся",
    streamActive: data.streamActive ?? false,
  });
}

export async function toggleRegistration() {
  if (isMockMode()) {
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, registrationOpen: !mockTournament.registrationOpen };
  }

  const tournament = await prisma.tournament.findFirst({
    orderBy: { createdAt: "desc" },
  });

  if (!tournament) {
    throw new Error("Tournament not found");
  }

  await prisma.tournament.update({
    where: { id: tournament.id },
    data: { registrationOpen: !tournament.registrationOpen },
  });

  revalidatePath("/admin");
  revalidatePath("/");

  return { success: true };
}

export async function exportTeams() {
  if (isMockMode()) {
    const XLSX = await import("xlsx");
    const data = mockTeams.map((team) => ({
      "Название": team.teamName,
      "Тег": team.teamTag,
      "Статус": team.status,
      "Игроки": team.players.map((p) => `${p.nickname} (${p.mmr})`).join(", "),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Teams");

    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    return Buffer.from(buf).toString("base64");
  }

  const teams = await prisma.team.findMany({
    include: { players: { orderBy: { order: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  const XLSX = await import("xlsx");
  const data = teams.map((team) => ({
    "Название": team.teamName,
    "Тег": team.teamTag,
    "Статус": team.status,
    "Капитан": team.captainName,
    "Telegram": team.captainTelegram,
    "Email": team.captainEmail,
    "Игроки": team.players.map((p) => `${p.nickname} (${p.mmr})`).join(", "),
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Teams");

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  return Buffer.from(buf).toString("base64");
}

export async function updateTournament(data: {
  name: string;
  date: string;
  prizePool: string;
  entryFee: number;
  format: string;
  server: string;
  registrationOpen: boolean;
  contacts: {
    discord: string;
    telegram: string;
    email: string;
    responseTime: string;
  };
  streamUrl?: string;
  streamTitle?: string;
  streamActive?: boolean;
}) {
  if (isMockMode()) {
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  }

  const tournament = await prisma.tournament.findFirst({
    orderBy: { createdAt: "desc" },
  });

  if (!tournament) {
    throw new Error("Tournament not found");
  }

  await prisma.tournament.update({
    where: { id: tournament.id },
    data: {
      name: data.name,
      date: new Date(data.date),
      prizePool: data.prizePool,
      entryFee: data.entryFee,
      format: data.format,
      server: data.server,
      registrationOpen: data.registrationOpen,
      streamUrl: data.streamUrl,
      streamTitle: data.streamTitle,
      streamActive: data.streamActive,
      contacts: {
        upsert: {
          create: data.contacts,
          update: data.contacts,
        },
      },
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");

  return { success: true };
}
