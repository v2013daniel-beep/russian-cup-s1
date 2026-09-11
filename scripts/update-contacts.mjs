// Одноразовый скрипт: обновляет контакты в БД.
// Запуск: node scripts/update-contacts.mjs
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(
    `UPDATE "Contact" SET "telegram" = 'https://t.me/FODY_ex', "email" = 'russiancup@mail.ru', "phone" = '+7 929 748-46-31'`
  );
  console.log("contacts updated");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
