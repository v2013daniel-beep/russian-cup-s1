"use server";

import { prisma } from "@/lib/db";
import { isMockMode } from "@/lib/mock";
import { buildRobokassaUrl } from "@/lib/robokassa";

function generateInvoiceId(): string {
  // Robokassa requires a numeric InvId
  return String(Math.floor(100000000 + Math.random() * 900000000));
}

export async function createRobokassaPayment(teamId: string) {
  return createPaymentUrl(teamId);
}

export async function createPaymentUrl(teamId: string) {
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
        method: "robokassa",
        status: "pending",
      },
    });
  }

  if (!payment.externalId) {
    payment = await prisma.payment.update({
      where: { id: payment.id },
      data: { externalId: generateInvoiceId() },
    });
  }

  const merchantLogin = process.env.ROBOKASSA_MERCHANT_LOGIN;
  const password1 = process.env.ROBOKASSA_PASSWORD_1;

  if (!merchantLogin || !password1) {
    throw new Error("Robokassa не настроена");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const isTestMode = process.env.ROBOKASSA_TEST_MODE === "1" || process.env.ROBOKASSA_TEST_MODE === "true";

  const invoiceId = payment.externalId;
  if (!invoiceId) {
    throw new Error("Не удалось создать идентификатор платежа");
  }

  const url = buildRobokassaUrl(
    merchantLogin,
    tournament.entryFee,
    invoiceId,
    `Регистрация ${team.teamName}`,
    password1,
    isTestMode,
    `${appUrl}/api/payment/success`,
    `${appUrl}/api/payment/result`
  );

  return { url, invoiceId };
}
