"use server";

import { prisma } from "@/lib/db";
import { isMockMode } from "@/lib/mock";

const BOT_USERNAME = process.env.TELEGRAM_BOT_USERNAME || "russiancupseasonbot";

function generateInvoiceId(): string {
  return String(Math.floor(100000000 + Math.random() * 900000000));
}

async function assignKopecks(): Promise<number> {
  const pending = await prisma.payment.findMany({
    where: { status: "pending" },
    select: { kopecks: true },
  });
  const used = new Set(pending.map((p) => p.kopecks));
  const free: number[] = [];
  for (let i = 1; i <= 99; i++) {
    if (!used.has(i)) free.push(i);
  }
  if (free.length === 0) return 0;
  return free[Math.floor(Math.random() * free.length)];
}

export async function createTelegramPayment(teamId: string) {
  if (isMockMode()) {
    return { url: "#demo-payment", invoiceId: "demo-invoice" };
  }

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { payment: true },
  });

  if (!team) {
    throw new Error("Команда не найдена");
  }

  const tournament = await prisma.tournament.findFirst({
    orderBy: { createdAt: "desc" },
  });

  if (!tournament) {
    throw new Error("Турнир не найден");
  }

  let payment = team.payment;

  if (!payment) {
    payment = await prisma.payment.create({
      data: {
        teamId: team.id,
        amount: tournament.entryFee,
        method: "telegram_qr",
        status: "pending",
      },
    });
  }

  const updates: { externalId?: string; kopecks?: number } = {};
  if (!payment.externalId) updates.externalId = generateInvoiceId();
  if (!payment.kopecks) updates.kopecks = await assignKopecks();

  if (Object.keys(updates).length > 0) {
    payment = await prisma.payment.update({
      where: { id: payment.id },
      data: updates,
    });
  }

  return {
    url: `https://t.me/${BOT_USERNAME}?start=pay_${payment.externalId}`,
    invoiceId: payment.externalId,
  };
}

export async function getPaymentStatus(teamId: string) {
  const payment = await prisma.payment.findUnique({
    where: { teamId },
    select: { status: true, paidAt: true },
  });

  if (!payment) {
    return { status: "none" as const };
  }

  return { status: payment.status, paidAt: payment.paidAt };
}
