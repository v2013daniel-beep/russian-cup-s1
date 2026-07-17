"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { notifyAdmin } from "@/lib/telegram";
import { isMockMode, mockTeams } from "@/lib/mock";

export interface PlayerInput {
  nickname: string;
  mmr: string;
  dotabuff: string;
  steam: string;
}

export interface TeamInput {
  teamName: string;
  teamTag: string;
  playerCount: number;
  substitute?: string;
  captainName: string;
  captainNickname: string;
  captainTelegram: string;
  captainDiscord: string;
  captainEmail: string;
  players: PlayerInput[];
}

export async function createTeam(data: TeamInput) {
  if (isMockMode()) {
    console.log("Demo registration:", data.teamName);
    return { success: true, teamId: "demo-team-id" };
  }

  const tournament = await prisma.tournament.findFirst({
    orderBy: { createdAt: "desc" },
  });

  if (!tournament) {
    throw new Error("Tournament not found");
  }

  if (!tournament.registrationOpen) {
    throw new Error("Регистрация закрыта");
  }

  const existingTeam = await prisma.team.findFirst({
    where: { teamName: data.teamName },
  });

  if (existingTeam) {
    throw new Error("Команда с таким названием уже зарегистрирована");
  }

  const team = await prisma.team.create({
    data: {
      teamName: data.teamName,
      teamTag: data.teamTag,
      playerCount: data.playerCount,
      substitute: data.substitute || null,
      captainName: data.captainName,
      captainNickname: data.captainNickname,
      captainTelegram: data.captainTelegram,
      captainDiscord: data.captainDiscord,
      captainEmail: data.captainEmail,
      players: {
        create: data.players.map((p, index) => ({
          nickname: p.nickname,
          mmr: p.mmr,
          dotabuff: p.dotabuff,
          steam: p.steam,
          order: index,
        })),
      },
    },
  });

  await prisma.payment.create({
    data: {
      teamId: team.id,
      amount: tournament.entryFee,
      method: "robokassa",
      status: "pending",
    },
  });

  await notifyAdmin(
    `🆕 Новая заявка на турнир!\n` +
      `Команда: ${data.teamName} [${data.teamTag}]\n` +
      `Капитан: ${data.captainNickname}\n` +
      `Telegram: ${data.captainTelegram}\n` +
      `Email: ${data.captainEmail}`
  );

  revalidatePath("/");
  revalidatePath("/admin/teams");
  revalidatePath("/admin/registrations");

  return { success: true, teamId: team.id };
}

export async function getTeams() {
  if (isMockMode()) {
    return mockTeams.map((team) => ({
      ...team,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }

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

export async function addTeam(data: TeamInput & { status?: "pending" | "paid" }) {
  if (isMockMode()) {
    revalidatePath("/admin/teams");
    return { success: true, teamId: "demo-team-id" };
  }

  const tournament = await prisma.tournament.findFirst({
    orderBy: { createdAt: "desc" },
  });

  const team = await prisma.team.create({
    data: {
      teamName: data.teamName,
      teamTag: data.teamTag,
      playerCount: data.playerCount,
      substitute: data.substitute || null,
      captainName: data.captainName,
      captainNickname: data.captainNickname,
      captainTelegram: data.captainTelegram,
      captainDiscord: data.captainDiscord,
      captainEmail: data.captainEmail,
      status: data.status || "pending",
      players: {
        create: data.players.map((p, index) => ({
          nickname: p.nickname,
          mmr: p.mmr,
          dotabuff: p.dotabuff,
          steam: p.steam,
          order: index,
        })),
      },
    },
  });

  if (tournament) {
    await prisma.payment.create({
      data: {
        teamId: team.id,
        amount: tournament.entryFee,
        method: "robokassa",
        status: data.status === "paid" ? "success" : "pending",
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/teams");
  revalidatePath("/admin/registrations");

  return { success: true, teamId: team.id };
}

export async function updateTeam(teamId: string, data: Partial<TeamInput> & { status?: "pending" | "paid" }) {
  if (isMockMode()) {
    revalidatePath("/admin/teams");
    return { success: true };
  }

  await prisma.team.update({
    where: { id: teamId },
    data: {
      teamName: data.teamName,
      teamTag: data.teamTag,
      playerCount: data.playerCount,
      substitute: data.substitute,
      captainName: data.captainName,
      captainNickname: data.captainNickname,
      captainTelegram: data.captainTelegram,
      captainDiscord: data.captainDiscord,
      captainEmail: data.captainEmail,
      status: data.status,
    },
  });

  if (data.players) {
    await prisma.player.deleteMany({ where: { teamId } });
    await prisma.player.createMany({
      data: data.players.map((p, index) => ({
        teamId,
        nickname: p.nickname,
        mmr: p.mmr,
        dotabuff: p.dotabuff,
        steam: p.steam,
        order: index,
      })),
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/teams");
  revalidatePath("/admin/registrations");

  return { success: true };
}

export async function deleteTeam(teamId: string) {
  if (isMockMode()) {
    revalidatePath("/admin/teams");
    return { success: true };
  }

  await prisma.team.delete({
    where: { id: teamId },
  });

  revalidatePath("/");
  revalidatePath("/admin/teams");
  revalidatePath("/admin/registrations");

  return { success: true };
}
