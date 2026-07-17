"use server";

import { prisma } from "@/lib/db";
import { type SiteData } from "@/lib/data";

export async function getSiteData(): Promise<SiteData> {
  const tournament = await prisma.tournament.findFirst({
    include: { contacts: true },
    orderBy: { createdAt: "desc" },
  });

  if (!tournament) {
    throw new Error("Tournament not found");
  }

  const [teams, matches] = await Promise.all([
    prisma.team.findMany({
      include: { players: { orderBy: { order: "asc" } }, payment: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.match.findMany({ orderBy: [{ round: "asc" }, { matchNumber: "asc" }] }),
  ]);

  const registrations = teams.map((team) => ({
    id: team.id,
    teamName: team.teamName,
    teamTag: team.teamTag,
    playerCount: team.playerCount,
    substitute: team.substitute || undefined,
    captainName: team.captainName,
    captainNickname: team.captainNickname,
    captainTelegram: team.captainTelegram,
    captainDiscord: team.captainDiscord,
    captainEmail: team.captainEmail,
    players: team.players.map((p) => ({
      nickname: p.nickname,
      mmr: p.mmr,
      dotabuff: p.dotabuff,
      steam: p.steam,
    })),
    createdAt: team.createdAt.toISOString(),
  }));

  return {
    tournament: {
      name: tournament.name,
      date: tournament.date.toISOString(),
      prizePool: tournament.prizePool,
      entryFee: tournament.entryFee,
      format: tournament.format,
      server: tournament.server,
      registrationOpen: tournament.registrationOpen,
    },
    contacts: {
      discord: tournament.contacts?.discord || "",
      telegram: tournament.contacts?.telegram || "",
      email: tournament.contacts?.email || "",
      responseTime: tournament.contacts?.responseTime || "",
    },
    liveStream: {
      url: tournament.streamUrl || "",
      title: tournament.streamTitle,
      isActive: tournament.streamActive,
    },
    teams: teams.map((team) => ({
      id: team.id,
      teamName: team.teamName,
      teamTag: team.teamTag,
      playerCount: team.playerCount,
      substitute: team.substitute || undefined,
      captainName: team.captainName,
      captainNickname: team.captainNickname,
      captainTelegram: team.captainTelegram,
      captainDiscord: team.captainDiscord,
      captainEmail: team.captainEmail,
      players: team.players.map((p) => ({
        nickname: p.nickname,
        mmr: p.mmr,
        dotabuff: p.dotabuff,
        steam: p.steam,
      })),
      status: team.status as "pending" | "paid",
      createdAt: team.createdAt.toISOString(),
    })),
    registrations,
    visits: [],
    matches: matches.map((match) => ({
      id: match.id,
      round: match.round,
      matchNumber: match.matchNumber,
      teamA: match.teamA || undefined,
      teamB: match.teamB || undefined,
      scheduledAt: match.scheduledAt?.toISOString(),
      status: match.status as "scheduled" | "live" | "finished",
      winner: match.winner || undefined,
    })),
  };
}
