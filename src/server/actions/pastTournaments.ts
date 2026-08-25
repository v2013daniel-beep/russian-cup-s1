"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";

export interface PastTournamentInput {
  name: string;
  date: string;
  winner: string;
  secondPlace?: string;
  thirdPlace?: string;
  teamsCount: number;
  prizePool: string;
  order?: number;
}

export async function getPastTournaments() {
  const tournaments = await prisma.pastTournament.findMany({
    orderBy: [{ order: "asc" }, { date: "desc" }],
  });

  return tournaments.map((t) => ({
    id: t.id,
    name: t.name,
    date: t.date,
    winner: t.winner,
    secondPlace: t.secondPlace || undefined,
    thirdPlace: t.thirdPlace || undefined,
    teamsCount: t.teamsCount,
    prizePool: t.prizePool,
    order: t.order,
  }));
}

export async function setPastTournaments(tournaments: PastTournamentInput[]) {
  await requireAdmin();

  await prisma.$transaction([
    prisma.pastTournament.deleteMany(),
    prisma.pastTournament.createMany({
      data: tournaments.map((t, index) => ({
        name: t.name,
        date: t.date,
        winner: t.winner,
        secondPlace: t.secondPlace || null,
        thirdPlace: t.thirdPlace || null,
        teamsCount: t.teamsCount,
        prizePool: t.prizePool,
        order: t.order ?? index,
      })),
    }),
  ]);

  revalidatePath("/tournaments");
  revalidatePath("/admin/tournaments");

  return { success: true };
}
