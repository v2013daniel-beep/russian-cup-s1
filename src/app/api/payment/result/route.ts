import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyRobokassaResultSignature } from "@/lib/robokassa";
import { notifyAdmin } from "@/lib/telegram";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const outSum = formData.get("OutSum") as string;
    const invId = formData.get("InvId") as string;
    const signatureValue = formData.get("SignatureValue") as string;

    const password2 = process.env.ROBOKASSA_PASSWORD_2;

    if (!password2) {
      return NextResponse.json(
        { error: "Robokassa password2 not configured" },
        { status: 500 }
      );
    }

    const expectedSignature = verifyRobokassaResultSignature(
      outSum,
      invId,
      password2
    );

    if (expectedSignature.toLowerCase() !== signatureValue.toLowerCase()) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payment = await prisma.payment.update({
      where: { id: invId },
      data: {
        status: "success",
        paidAt: new Date(),
      },
      include: { team: true },
    });

    await prisma.team.update({
      where: { id: payment.teamId },
      data: { status: "paid" },
    });

    await notifyAdmin(
      `💰 Оплата получена!\n` +
        `Команда: ${payment.team.teamName}\n` +
        `Сумма: ${payment.amount} ₽\n` +
        `Способ: Robokassa`
    );

    return NextResponse.json("OK", { status: 200 });
  } catch (error) {
    console.error("Robokassa result error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
