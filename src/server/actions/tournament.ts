"use server";

import { prisma } from "@/lib/db";
import { isMockMode, mockTournament } from "@/lib/mock";

export async function getTournament() {
  if (isMockMode()) {
    return {
      ...mockTournament,
      date: mockTournament.date,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const tournament = await prisma.tournament.findFirst({
    include: { contacts: true },
    orderBy: { createdAt: "desc" },
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
  if (isMockMode()) {
    return {
      totalTeams: mockTournament.registrationOpen ? 4 : 0,
      paidTeams: 2,
    };
  }

  const [totalTeams, paidTeams] = await Promise.all([
    prisma.team.count(),
    prisma.team.count({ where: { status: "paid" } }),
  ]);

  return { totalTeams, paidTeams };
}
