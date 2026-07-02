"use server";

import { prisma } from "@/lib/db";
import * as XLSX from "xlsx";

export async function exportTeamsToExcel() {
  const teams = await prisma.team.findMany({
    include: { players: { orderBy: { order: "asc" } }, payment: true },
    orderBy: { createdAt: "desc" },
  });

  const data = teams.map((team) => ({
    "Название команды": team.teamName,
    "Тег": team.teamTag,
    "Количество игроков": team.playerCount,
    "Запасной": team.substitute || "-",
    "Статус": team.status === "paid" ? "Оплачено" : "Не оплачено",
    "Сумма оплаты": team.payment?.amount || 0,
    "Способ оплаты": team.payment?.method || "-",
    "Имя капитана": team.captainName,
    "Ник капитана": team.captainNickname,
    "Telegram": team.captainTelegram,
    "Discord": team.captainDiscord,
    "Email": team.captainEmail,
    "Дата регистрации": team.createdAt.toLocaleString("ru-RU"),
    "Игрок 1": team.players[0]?.nickname || "-",
    "MMR 1": team.players[0]?.mmr || "-",
    "Игрок 2": team.players[1]?.nickname || "-",
    "MMR 2": team.players[1]?.mmr || "-",
    "Игрок 3": team.players[2]?.nickname || "-",
    "MMR 3": team.players[2]?.mmr || "-",
    "Игрок 4": team.players[3]?.nickname || "-",
    "MMR 4": team.players[3]?.mmr || "-",
    "Игрок 5": team.players[4]?.nickname || "-",
    "MMR 5": team.players[4]?.mmr || "-",
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Команды");

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  return Buffer.from(buffer).toString("base64");
}
