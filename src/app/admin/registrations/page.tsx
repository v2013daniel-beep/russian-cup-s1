"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAdminAuth } from "@/server/actions/admin";
import { useSiteData } from "@/hooks/useSiteData";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, Trash2, Users, Calendar, Clock, Download } from "lucide-react";
import { isToday, isYesterday, startOfDay, subDays, format } from "date-fns";
import { ru } from "date-fns/locale";

export default function AdminRegistrationsPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const { data, deleteRegistration, reset } = useSiteData();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "today" | "yesterday" | "week">("all");

  useEffect(() => {
    checkAdminAuth().then((isAdmin) => {
      if (!isAdmin) router.push("/admin/login");
      else setAuthChecked(true);
    });
  }, [router]);

  const filteredRegistrations = useMemo(() => {
    return data.registrations.filter((reg) => {
      const date = new Date(reg.createdAt);
      let matchesDate = true;
      if (filter === "today") matchesDate = isToday(date);
      else if (filter === "yesterday") matchesDate = isYesterday(date);
      else if (filter === "week") matchesDate = date >= subDays(startOfDay(new Date()), 7);

      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        reg.teamName.toLowerCase().includes(q) ||
        reg.teamTag.toLowerCase().includes(q) ||
        reg.captainNickname.toLowerCase().includes(q) ||
        reg.captainTelegram.toLowerCase().includes(q) ||
        reg.captainEmail.toLowerCase().includes(q);

      return matchesDate && matchesSearch;
    });
  }, [data.registrations, filter, search]);

  const stats = useMemo(() => {
    return {
      today: data.registrations.filter((r) => isToday(new Date(r.createdAt))).length,
      yesterday: data.registrations.filter((r) => isYesterday(new Date(r.createdAt))).length,
      week: data.registrations.filter((r) => new Date(r.createdAt) >= subDays(startOfDay(new Date()), 7)).length,
      total: data.registrations.length,
    };
  }, [data.registrations]);

  const exportRegistrations = () => {
    const csv = [
      ["Дата", "Команда", "Тег", "Игроков", "Капитан", "Telegram", "Email", "Discord", "Игроки"].join(";"),
      ...data.registrations.map((reg) =>
        [
          new Date(reg.createdAt).toLocaleString("ru-RU"),
          reg.teamName,
          reg.teamTag,
          reg.playerCount,
          `${reg.captainName} (${reg.captainNickname})`,
          reg.captainTelegram,
          reg.captainEmail,
          reg.captainDiscord,
          reg.players.map((p) => `${p.nickname} (${p.mmr})`).join(", "),
        ].join(";")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "registrations.csv";
    link.click();
  };

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-dota-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-display font-bold text-white">Заявки и статистика</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportRegistrations}>
            <Download className="w-4 h-4 mr-2" /> Экспорт CSV
          </Button>

        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Calendar} label="Сегодня" value={stats.today} />
        <StatCard icon={Clock} label="Вчера" value={stats.yesterday} />
        <StatCard icon={Users} label="За 7 дней" value={stats.week} />
        <StatCard icon={Users} label="Всего" value={stats.total} />
      </div>

      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dota-muted" />
            <Input
              placeholder="Поиск по команде, тегу, капитану..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["all", "today", "yesterday", "week"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? "bg-dota-red text-white"
                    : "bg-dota-surface text-dota-muted hover:text-white"
                }`}
              >
                {f === "all" ? "Все" : f === "today" ? "Сегодня" : f === "yesterday" ? "Вчера" : "7 дней"}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {filteredRegistrations.length === 0 && (
          <Card className="p-8 text-center text-dota-muted">
            Заявок не найдено.
          </Card>
        )}
        {filteredRegistrations.map((reg) => (
          <Card key={reg.id} className="p-5">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-display font-bold text-white">{reg.teamName}</h3>
                  <span className="text-dota-gold">[{reg.teamTag}]</span>
                  <span className="text-xs text-dota-muted bg-dota-surface px-2 py-1 rounded">
                    {format(new Date(reg.createdAt), "d MMM yyyy HH:mm", { locale: ru })}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-dota-muted mb-3">
                  <p>Капитан: {reg.captainName} ({reg.captainNickname})</p>
                  <p>Telegram: {reg.captainTelegram}</p>
                  <p>Email: {reg.captainEmail}</p>
                  <p>Discord: {reg.captainDiscord}</p>
                  <p>Игроков: {reg.playerCount}</p>
                  {reg.substitute && <p>Запасной: {reg.substitute}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {reg.players.map((player, idx) => (
                    <span key={idx} className="px-2 py-1 bg-dota-surface rounded text-xs text-dota-muted">
                      {player.nickname} ({player.mmr} MMR)
                      {player.dotabuff && <span className="ml-1 text-dota-gold">DB</span>}
                      {player.steam && <span className="ml-1 text-blue-400">Steam</span>}
                    </span>
                  ))}
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={async () => { if (confirm("Удалить заявку?")) await deleteRegistration(reg.id); }}
              >
                <Trash2 className="w-4 h-4 text-dota-red" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: number }) {
  return (
    <Card className="p-4 text-center">
      <Icon className="w-5 h-5 text-dota-gold mx-auto mb-2" />
      <p className="text-2xl font-display font-bold text-white">{value}</p>
      <p className="text-xs text-dota-muted">{label}</p>
    </Card>
  );
}
