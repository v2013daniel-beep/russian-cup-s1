"use server";

import { prisma } from "@/lib/db";
import crypto from "crypto";
import { isMockMode } from "@/lib/mock";

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

  const payment = team.payment || (await prisma.payment.create({
    data: {
      teamId: team.id,
      amount: tournament.entryFee,
      method: "robokassa",
      status: "pending",
    },
  }));

  const merchantLogin = process.env.ROBOKASSA_MERCHANT_LOGIN;
  const password1 = process.env.ROBOKASSA_PASSWORD_1;

  if (!merchantLogin || !password1) {
    throw new Error("Robokassa не настроена");
  }

  const outSum = tournament.entryFee.toString();
  const invId = payment.id;
  const description = encodeURIComponent(`Регистрация ${team.teamName}`);
  const signatureValue = crypto
    .createHash("md5")
    .update(`${merchantLogin}:${outSum}:${invId}:${password1}`)
    .digest("hex");

  const isTestMode = process.env.ROBOKASSA_TEST_MODE === "true";
  const testParam = isTestMode ? "&IsTest=1" : "";

  const url =
    `https://auth.robokassa.ru/Merchant/Index.aspx?` +
    `MerchantLogin=${merchantLogin}&` +
    `OutSum=${outSum}&` +
    `InvId=${invId}&` +
    `Description=${description}&` +
    `SignatureValue=${signatureValue}` +
    testParam;

  return { url, invoiceId: invId };
}
