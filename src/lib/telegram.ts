"use server";

export async function notifyAdmin(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = (process.env.TELEGRAM_ADMIN_CHAT_ID || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!token || chatIds.length === 0) {
    console.log("Telegram not configured:", message);
    return { success: false, error: "Telegram not configured" };
  }

  try {
    const apiRoot = process.env.TG_API_ROOT || "https://api.telegram.org";
    const results = await Promise.allSettled(
      chatIds.map((chatId) =>
        fetch(`${apiRoot}/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "HTML",
          }),
        }).then((r) => {
          if (!r.ok) throw new Error(`Telegram API error: ${r.status}`);
        })
      )
    );

    const ok = results.some((r) => r.status === "fulfilled");
    return ok
      ? { success: true }
      : { success: false, error: "Все отправки не удались" };
  } catch (error) {
    console.error("Failed to send Telegram notification:", error);
    return { success: false, error: String(error) };
  }
}
