"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";

export interface HallOfFameEntryInput {
  place: number;
  team: string;
  title: string;
  prize: string;
  order?: number;
}

export async function getHallOfFame() {
  const entries = await prisma.hallOfFameEntry.findMany({
    orderBy: [{ order: "asc" }, { place: "asc" }],
  });

  return entries.map((entry) => ({
    id: entry.id,
    place: entry.place,
    team: entry.team,
    title: entry.title,
    prize: entry.prize,
    order: entry.order,
  }));
}

export async function setHallOfFame(entries: HallOfFameEntryInput[]) {
  await requireAdmin();

  await prisma.$transaction([
    prisma.hallOfFameEntry.deleteMany(),
    prisma.hallOfFameEntry.createMany({
      data: entries.map((entry, index) => ({
        place: entry.place,
        team: entry.team,
        title: entry.title,
        prize: entry.prize,
        order: entry.order ?? index,
      })),
    }),
  ]);

  revalidatePath("/");
  revalidatePath("/admin/hall-of-fame");

  return { success: true };
}

export async function addHallOfFameEntry(data: HallOfFameEntryInput) {
  await requireAdmin();

  const maxOrder = await prisma.hallOfFameEntry.aggregate({
    _max: { order: true },
  });

  const entry = await prisma.hallOfFameEntry.create({
    data: {
      place: data.place,
      team: data.team,
      title: data.title,
      prize: data.prize,
      order: data.order ?? (maxOrder._max.order ?? -1) + 1,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/hall-of-fame");

  return { success: true, id: entry.id };
}

export async function updateHallOfFameEntry(
  id: string,
  data: Partial<HallOfFameEntryInput>
) {
  await requireAdmin();

  await prisma.hallOfFameEntry.update({
    where: { id },
    data: {
      place: data.place,
      team: data.team,
      title: data.title,
      prize: data.prize,
      order: data.order,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/hall-of-fame");

  return { success: true };
}

export async function deleteHallOfFameEntry(id: string) {
  await requireAdmin();

  await prisma.hallOfFameEntry.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/admin/hall-of-fame");

  return { success: true };
}
