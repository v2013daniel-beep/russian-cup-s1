"use server";

export async function notifyAdmin(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (!token || !chatId) {
    console.log("Telegram not configured:", message);
    return { success: false, error: "Telegram not configured" };
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to send Telegram notification:", error);
    return { success: false, error: String(error) };
  }
}
