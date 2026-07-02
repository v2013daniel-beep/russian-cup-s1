"use server";

import { prisma } from "@/lib/db";

export async function getTournament() {
  const tournament = await prisma.tournament.findUnique({
    where: { id: "default" },
    include: { contacts: true },
  });

  if (!tournament) {
    throw new Error("Tournament not found");
  }

  return {
    ...tournament,
    date: tournament.date.toISOString(),
    createdAt: tournament.createdAt.toISOString(),
    updatedAt: tournament.updatedAt.toISOString(),
  };
}

export async function getPublicStats() {
  const [totalTeams, paidTeams] = await Promise.all([
    prisma.team.count(),
    prisma.team.count({ where: { status: "paid" } }),
  ]);

  return { totalTeams, paidTeams };
}
