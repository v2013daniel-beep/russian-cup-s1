"use server";

import { prisma } from "@/lib/db";
import { buildRobokassaUrl } from "@/lib/robokassa";

export async function createRobokassaPayment(teamId: string) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { payment: true },
  });

  if (!team) {
    throw new Error("Команда не найдена");
  }

  if (!team.payment) {
    throw new Error("Платёж не найден");
  }

  const merchantLogin = process.env.ROBOKASSA_MERCHANT_LOGIN;
  const password1 = process.env.ROBOKASSA_PASSWORD_1;

  if (!merchantLogin || !password1) {
    throw new Error("Robokassa не настроена");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const testMode = process.env.ROBOKASSA_TEST_MODE === "1";

  const url = buildRobokassaUrl(
    merchantLogin,
    team.payment.amount,
    team.payment.id,
    `Участие команды ${team.teamName} в RUSSIAN CUP SEASON 1`,
    password1,
    testMode,
    `${appUrl}/api/payment/success`,
    `${appUrl}/api/payment/result`
  );

  return { url };
}
