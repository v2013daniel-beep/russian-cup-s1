import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const tournament = await prisma.tournament.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      name: "RUSSIAN CUP SEASON 1",
      date: new Date("2024-08-15T18:00:00.000Z"),
      prizePool: "250 000 ₽",
      entryFee: 5000,
      format: "5x5",
      server: "EU / RU",
      registrationOpen: true,
      contacts: {
        create: {
          discord: "https://discord.gg/russiancup",
          telegram: "https://t.me/russiancup_admin",
          email: "admin@russiancup.ru",
          responseTime: "Ежедневно с 10:00 до 22:00 (MSK)",
        },
      },
    },
  });

  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.admin.upsert({
    where: { username: "admin" },
    update: { password: hashedPassword },
    create: {
      username: "admin",
      password: hashedPassword,
    },
  });

  console.log("Seed completed. Tournament:", tournament.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
