// Telegram-бот приёма оплаты RUSSIAN CUP S1.
// Лонг-поллинг вручную (короткий timeout, чтобы проходить через релей).
// Prisma Client подтягивается из родительского node_modules (общая схема с сайтом).
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const { Bot, InputFile } = require("grammy");
const QRCode = require("qrcode");
const { PrismaClient } = require("@prisma/client");

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
const API_ROOT = process.env.TG_API_ROOT || "https://api.telegram.org";
const DISCORD_URL = "https://discord.gg/9hGtjHAy";

if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
  console.error("Заполните BOT_TOKEN и ADMIN_CHAT_ID в bot/.env");
  process.exit(1);
}

const prisma = new PrismaClient();
const bot = new Bot(BOT_TOKEN, { client: { apiRoot: API_ROOT } });

const PAYEE = {
  name: "ИП БАХТИЕВА РИММА ШАЙМАРДАНОВНА",
  inn: "024202629803",
  account: "40802810329310008672",
  bank: 'ФИЛИАЛ "НИЖЕГОРОДСКИЙ" АО "АЛЬФА-БАНК"',
  bic: "042202824",
  corr: "30101810200000000824",
};

const sumOf = (p) => (p.amount + p.kopecks / 100).toFixed(2).replace(".", ",");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function qrPayload(payment) {
  const sumKopecks = payment.amount * 100 + payment.kopecks;
  return [
    "ST0001",
    `Name=${PAYEE.name}`,
    `PersonalAcc=${PAYEE.account}`,
    `BankName=${PAYEE.bank}`,
    `BIC=${PAYEE.bic}`,
    `CorrespAcc=${PAYEE.corr}`,
    `PayeeINN=${PAYEE.inn}`,
    `Sum=${sumKopecks}`,
    `Purpose=Регистрационный взнос RUSSIAN CUP S1 заявка ${payment.externalId}`,
  ].join("|");
}

async function sendInvoice(ctx, payment) {
  const caption =
    `Оплата участия — команда «${payment.team.teamName}»\n\n` +
    `Сумма к оплате: ${sumOf(payment)} ₽ (ровно эта сумма, с копейками)\n\n` +
    "Отсканируйте QR-код в приложении вашего банка: реквизиты и сумма подставятся автоматически.\n\n" +
    "Если QR не сканируется, реквизиты вручную:\n" +
    `Получатель: ${PAYEE.name}\n` +
    `ИНН: ${PAYEE.inn}\n` +
    `Счёт: ${PAYEE.account}\n` +
    `Банк: ${PAYEE.bank}\n` +
    `БИК: ${PAYEE.bic}\n` +
    `Кор. счёт: ${PAYEE.corr}\n` +
    `Назначение: Регистрационный взнос RUSSIAN CUP S1, заявка ${payment.externalId}\n\n` +
    "После оплаты пришлите скриншот чека в этот чат.";

  const qr = await QRCode.toBuffer(qrPayload(payment), { width: 512, margin: 2 });
  await ctx.replyWithPhoto(new InputFile(qr, "qr.png"), { caption });
}

bot.command("start", async (ctx) => {
  const payload = (ctx.match || "").trim();

  if (!payload.startsWith("pay_")) {
    await ctx.reply(
      "Привет! Это бот турнира RUSSIAN CUP SEASON 1.\n\n" +
        "Оплата регистрации проходит здесь после заполнения формы на сайте russiancupturnament.com: " +
        "заполните заявку и нажмите «Оплатить».\n\n" +
        "Проверить статус своей заявки: /status"
    );
    return;
  }

  const externalId = payload.slice(4);
  const payment = await prisma.payment.findFirst({
    where: { externalId },
    include: { team: true },
  });

  if (!payment) {
    await ctx.reply(
      "Заявка не найдена. Вернитесь на сайт russiancupturnament.com, заполните форму и нажмите «Оплатить»."
    );
    return;
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      telegramId: String(ctx.from.id),
      telegramUsername: ctx.from.username || null,
    },
  });

  if (payment.status === "success") {
    await ctx.reply(
      `Заявка команды «${payment.team.teamName}» уже оплачена. Ждите сетку и расписание на сайте и в Discord: ${DISCORD_URL}`
    );
    return;
  }

  await sendInvoice(ctx, payment);
});

bot.command("status", async (ctx) => {
  const payments = await prisma.payment.findMany({
    where: { telegramId: String(ctx.from.id) },
    include: { team: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  if (payments.length === 0) {
    await ctx.reply("У вас пока нет заявок. Регистрация на сайте: russiancupturnament.com");
    return;
  }

  const lines = payments.map((p) => {
    const status =
      p.status === "success"
        ? "✅ оплачено"
        : p.receiptFileId
          ? "⏳ чек у администратора на проверке"
          : "⌛ ожидает оплаты";
    return `• ${p.team.teamName}: ${status} (${sumOf(p)} ₽)`;
  });

  await ctx.reply("Ваши заявки:\n\n" + lines.join("\n"));
});

bot.on(["message:photo", "message:document"], async (ctx) => {
  const payment = await prisma.payment.findFirst({
    where: { telegramId: String(ctx.from.id), status: "pending" },
    include: { team: true },
    orderBy: { createdAt: "desc" },
  });

  if (!payment) {
    await ctx.reply(
      "Не нахожу заявку, ожидающую оплаты. Сначала зарегистрируйте команду на сайте russiancupturnament.com и перейдите в бота по кнопке «Оплатить»."
    );
    return;
  }

  const fileId = ctx.message.photo
    ? ctx.message.photo[ctx.message.photo.length - 1].file_id
    : ctx.message.document.file_id;

  await prisma.payment.update({
    where: { id: payment.id },
    data: { receiptFileId: fileId },
  });

  const caption =
    `💰 Проверка оплаты · заявка ${payment.externalId}\n\n` +
    `Команда: ${payment.team.teamName} (${payment.team.teamTag})\n` +
    `Капитан: ${payment.team.captainName} (${payment.team.captainNickname})\n` +
    `TG из формы: ${payment.team.captainTelegram}\n` +
    `Оплатил с аккаунта: @${ctx.from.username || "без username"} (id ${ctx.from.id})\n` +
    `Ожидаемая сумма: ${sumOf(payment)} ₽\n` +
    `Заявка создана: ${payment.createdAt.toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}`;

  await bot.api.sendPhoto(ADMIN_CHAT_ID, fileId, {
    caption,
    reply_markup: {
      inline_keyboard: [
        [
          { text: "✅ Подтвердить", callback_data: `ok:${payment.id}` },
          { text: "❌ Отклонить", callback_data: `no:${payment.id}` },
        ],
      ],
    },
  });

  await ctx.reply(
    "Чек получен и передан администратору. Обычно проверка занимает до часа с 10:00 до 22:00 МСК. " +
      "Как только оплату подтвердят, пришлю сообщение. Статус: /status"
  );
});

bot.on("callback_query:data", async (ctx) => {
  if (String(ctx.callbackQuery.message?.chat.id) !== String(ADMIN_CHAT_ID)) {
    await ctx.answerCallbackQuery({ text: "Недоступно", show_alert: true });
    return;
  }

  const [action, paymentId] = ctx.callbackQuery.data.split(":");
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { team: true },
  });

  if (!payment) {
    await ctx.answerCallbackQuery({ text: "Заявка не найдена", show_alert: true });
    return;
  }

  if (payment.status === "success") {
    await ctx.answerCallbackQuery({ text: "Уже подтверждено ранее" });
    await ctx.editMessageReplyMarkup({ reply_markup: { inline_keyboard: [] } });
    return;
  }

  if (action === "ok") {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "success", paidAt: new Date() },
    });
    await prisma.team.update({
      where: { id: payment.teamId },
      data: { status: "paid" },
    });

    await ctx.editMessageCaption({
      caption: (ctx.callbackQuery.message.caption || "") + "\n\n✅ ПОДТВЕРЖДЕНО",
      reply_markup: { inline_keyboard: [] },
    });
    await ctx.answerCallbackQuery({ text: "Оплата подтверждена" });

    if (payment.telegramId) {
      await bot.api.sendMessage(
        payment.telegramId,
        `✅ Оплата подтверждена! Команда «${payment.team.teamName}» зарегистрирована на RUSSIAN CUP SEASON 1.\n\n` +
          `Сетка и расписание появятся на сайте russiancupturnament.com и в Discord: ${DISCORD_URL}`
      );
    }
  } else {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { receiptFileId: null },
    });

    await ctx.editMessageCaption({
      caption: (ctx.callbackQuery.message.caption || "") + "\n\n❌ ОТКЛОНЕНО",
      reply_markup: { inline_keyboard: [] },
    });
    await ctx.answerCallbackQuery({ text: "Оплата отклонена" });

    if (payment.telegramId) {
      await bot.api.sendMessage(
        payment.telegramId,
        `Администратор не нашёл поступление по вашей заявке (${sumOf(payment)} ₽).\n\n` +
          "Проверьте сумму (важно: точная сумма с копейками) и пришлите корректный скриншот чека, " +
          "или напишите администратору: https://t.me/FODY_ex"
      );
    }
  }
});

// Напоминание админу о неподтверждённых заявках старше 24 часов, раз в сутки
async function remindStalePayments() {
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const stale = await prisma.payment.findMany({
    where: { status: "pending", createdAt: { lt: dayAgo } },
    include: { team: true },
  });

  if (stale.length === 0) return;

  const lines = stale.map(
    (p) =>
      `• ${p.team.teamName}: ${sumOf(p)} ₽, заявка ${p.externalId}` +
      (p.receiptFileId ? " (чек прислан)" : "")
  );
  await bot.api.sendMessage(
    ADMIN_CHAT_ID,
    "⏰ Заявки ждут подтверждения дольше суток:\n\n" + lines.join("\n")
  );
}

async function main() {
  await bot.api.deleteWebhook({ drop_pending_updates: true });
  const me = await bot.api.getMe();
  console.log(`Бот запущен: @${me.username}, API: ${API_ROOT}`);

  setInterval(() => remindStalePayments().catch(console.error), 24 * 60 * 60 * 1000);

  let offset = 0;
  for (;;) {
    try {
      const updates = await bot.api.getUpdates({
        offset,
        timeout: 5,
        allowed_updates: ["message", "callback_query"],
      });
      for (const update of updates) {
        offset = update.update_id + 1;
        bot.handleUpdate(update).catch((e) =>
          console.error("Ошибка обработки update:", e)
        );
      }
    } catch (e) {
      console.error("Ошибка поллинга, повтор через 5с:", e.message || e);
      await sleep(5000);
    }
  }
}

main().catch((e) => {
  console.error("Фатальная ошибка:", e);
  process.exit(1);
});
