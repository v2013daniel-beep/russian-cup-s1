"use server";

import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { isMockMode } from "@/lib/mock";

export async function trackVisit() {
  if (isMockMode()) {
    return;
  }

  try {
    const headersList = headers();
    const userAgent = headersList.get("user-agent") || "";
    const ip = headersList.get("x-forwarded-for") || "unknown";

    await prisma.visit.create({
      data: {
        ip,
        userAgent,
      },
    });
  } catch (error) {
    console.error("Failed to track visit:", error);
  }
}
