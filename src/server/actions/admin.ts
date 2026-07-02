"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createAdminSession, destroyAdminSession, verifyAdminSession } from "@/lib/auth";
import { exportTeamsToExcel } from "@/lib/export";
import { startOfDay, endOfDay } from "date-fns";

export async function adminLogin(password: string) {
  try {
    await createAdminSession(password);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Неверный пароль" };
  }
}

export async function adminLogout() {
  await destroyAdminSession();
  return { success: true };
}

export async function checkAdminAuth() {
  return verifyAdminSession();
}

export async function getDashboardStats() {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) throw new Error("Unauthorized");

  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);

  const [
    visitsToday,
    visitsTotal,
    totalTeams,
    paidTeams,
    pendingTeams,
    totalRevenue,
  ] = await Promise.all([
    prisma.visit.count({
      where: { date: { gte: todayStart, lte: todayEnd } },
    }),
    prisma.visit.count(),
    prisma.team.count(),
    prisma.team.count({ where: { status: "paid" } }),
    prisma.team.count({ where: { status: "pending" } }),
    prisma.payment.aggregate({
      where: { status: "success" },
      _sum: { amount: true },
    }),
  ]);

  return {
    visitsToday,
    visitsTotal,
    totalTeams,
    paidTeams,
    pendingTeams,
    totalRevenue: totalRevenue._sum.amount || 0,
  };
}

export async function getAdminTeams() {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) throw new Error("Unauthorized");

  const teams = await prisma.team.findMany({
    include: { players: { orderBy: { order: "asc" } }, payment: true },
    orderBy: { createdAt: "desc" },
  });

  return teams.map((team) => ({
    ...team,
    createdAt: team.createdAt.toISOString(),
    updatedAt: team.updatedAt.toISOString(),
    payment: team.payment
      ? {
          ...team.payment,
          paidAt: team.payment.paidAt?.toISOString() || null,
          createdAt: team.payment.createdAt.toISOString(),
          updatedAt: team.payment.updatedAt.toISOString(),
        }
      : null,
  }));
}

export async function updateTeamStatus(teamId: string, status: string) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) throw new Error("Unauthorized");

  await prisma.team.update({
    where: { id: teamId },
    data: { status },
  });

  revalidatePath("/");
  revalidatePath("/admin/teams");
  return { success: true };
}

export async function deleteTeam(teamId: string) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) throw new Error("Unauthorized");

  await prisma.team.delete({ where: { id: teamId } });

  revalidatePath("/");
  revalidatePath("/admin/teams");
  return { success: true };
}

export async function getAdminSettings() {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) throw new Error("Unauthorized");

  const tournament = await prisma.tournament.findUnique({
    where: { id: "default" },
    include: { contacts: true },
  });

  if (!tournament) throw new Error("Tournament not found");

  return {
    ...tournament,
    date: tournament.date.toISOString().slice(0, 16),
    createdAt: tournament.createdAt.toISOString(),
    updatedAt: tournament.updatedAt.toISOString(),
    discord: tournament.contacts?.discord || "",
    telegram: tournament.contacts?.telegram || "",
    email: tournament.contacts?.email || "",
    responseTime: tournament.contacts?.responseTime || "",
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
}) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) throw new Error("Unauthorized");

  await prisma.tournament.update({
    where: { id: "default" },
    data: {
      name: data.name,
      date: new Date(data.date),
      prizePool: data.prizePool,
      entryFee: data.entryFee,
      format: data.format,
      server: data.server,
      registrationOpen: data.registrationOpen,
      contacts: {
        upsert: {
          create: {
            discord: data.discord,
            telegram: data.telegram,
            email: data.email,
            responseTime: data.responseTime,
          },
          update: {
            discord: data.discord,
            telegram: data.telegram,
            email: data.email,
            responseTime: data.responseTime,
          },
        },
      },
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/settings");
  return { success: true };
}

export async function exportTeams() {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) throw new Error("Unauthorized");

  return exportTeamsToExcel();
}

export async function toggleRegistration() {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) throw new Error("Unauthorized");

  const tournament = await prisma.tournament.findUnique({
    where: { id: "default" },
  });

  if (!tournament) throw new Error("Tournament not found");

  await prisma.tournament.update({
    where: { id: "default" },
    data: { registrationOpen: !tournament.registrationOpen },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true, registrationOpen: !tournament.registrationOpen };
}
