"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { type Match } from "@/lib/data";

export async function getMatches(): Promise<Match[]> {
  const matches = await prisma.match.findMany({
    orderBy: [{ round: "asc" }, { matchNumber: "asc" }],
  });

  return matches.map((match) => ({
    id: match.id,
    round: match.round,
    matchNumber: match.matchNumber,
    teamA: match.teamA || undefined,
    teamB: match.teamB || undefined,
    scheduledAt: match.scheduledAt?.toISOString(),
    status: match.status as "scheduled" | "live" | "finished",
    winner: match.winner || undefined,
  }));
}

export async function createMatch(data: Omit<Match, "id">) {
  const match = await prisma.match.create({
    data: {
      round: data.round,
      matchNumber: data.matchNumber,
      teamA: data.teamA || null,
      teamB: data.teamB || null,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      status: data.status,
      winner: data.winner || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/schedule");

  return {
    success: true,
    match: {
      id: match.id,
      round: match.round,
      matchNumber: match.matchNumber,
      teamA: match.teamA || undefined,
      teamB: match.teamB || undefined,
      scheduledAt: match.scheduledAt?.toISOString(),
      status: match.status as "scheduled" | "live" | "finished",
      winner: match.winner || undefined,
    },
  };
}

export async function updateMatch(matchId: string, data: Partial<Match>) {
  await prisma.match.update({
    where: { id: matchId },
    data: {
      round: data.round,
      matchNumber: data.matchNumber,
      teamA: data.teamA,
      teamB: data.teamB,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
      status: data.status,
      winner: data.winner,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/schedule");

  return { success: true };
}

export async function deleteMatch(matchId: string) {
  await prisma.match.delete({
    where: { id: matchId },
  });

  revalidatePath("/");
  revalidatePath("/admin/schedule");

  return { success: true };
}

export async function setMatches(matches: Match[]) {
  await prisma.$transaction([
    prisma.match.deleteMany(),
    prisma.match.createMany({
      data: matches.map((m) => ({
        round: m.round,
        matchNumber: m.matchNumber,
        teamA: m.teamA || null,
        teamB: m.teamB || null,
        scheduledAt: m.scheduledAt ? new Date(m.scheduledAt) : null,
        status: m.status,
        winner: m.winner || null,
      })),
    }),
  ]);

  revalidatePath("/");
  revalidatePath("/admin/schedule");

  return { success: true };
}
