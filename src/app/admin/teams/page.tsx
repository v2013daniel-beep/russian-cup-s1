"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAdminTeams, exportTeams, updateTeamStatus, deleteTeam, checkAdminAuth } from "@/server/actions/admin";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, Download, Trash2, Check, X } from "lucide-react";

interface Team {
  id: string;
  teamName: string;
  teamTag: string;
  status: string;
  captainName: string;
  captainNickname: string;
  captainTelegram: string;
  captainEmail: string;
  createdAt: string;
  players: { nickname: string; mmr: string }[];
  payment: { amount: number; method: string; status: string } | null;
}

export default function AdminTeamsPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [filtered, setFiltered] = useState<Team[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "paid" | "pending">("all");
  const [loading, setLoading] = useState(true);

  const loadTeams = async () => {
    const data = await getAdminTeams();
    setTeams(data as Team[]);
    setFiltered(data as Team[]);
    setLoading(false);
  };

  useEffect(() => {
    checkAdminAuth().then((isAdmin) => {
      if (!isAdmin) router.push("/admin/login");
    });
  }, [router]);

  useEffect(() => {
    loadTeams();
  }, []);

  useEffect(() => {
    let result = teams;
    if (filter !== "all") {
      result = result.filter((team) => team.status === filter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (team) =>
          team.teamName.toLowerCase().includes(q) ||
          team.teamTag.toLowerCase().includes(q) ||
          team.captainNickname.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, filter, teams]);

  const handleExport = async () => {
    const base64 = await exportTeams();
    const link = document.createElement("a");
    link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    link.download = "teams.xlsx";
    link.click();
  };

  const handleStatusChange = async (teamId: string, status: string) => {
    await updateTeamStatus(teamId, status);
    loadTeams();
  };

  const handleDelete = async (teamId: string) => {
    if (confirm("Удалить команду?")) {
      await deleteTeam(teamId);
      loadTeams();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-dota-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-display font-bold text-white">Команды</h1>
        <Button variant="gold" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Экспорт в Excel
        </Button>
      </div>

      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dota-muted" />
            <Input
              placeholder="Поиск по команде, тегу или капитану..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "paid", "pending"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? "bg-dota-red text-white"
                    : "bg-dota-surface text-dota-muted hover:text-white"
                }`}
              >
                {f === "all" ? "Все" : f === "paid" ? "Оплачено" : "Не оплачено"}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {filtered.map((team) => (
          <Card key={team.id} className="p-5">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-display font-bold text-white">
                    {team.teamName}
                  </h3>
                  <span className="text-dota-gold">[{team.teamTag}]</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      team.status === "paid"
                        ? "bg-dota-gold/10 text-dota-gold"
                        : "bg-dota-muted/10 text-dota-muted"
                    }`}
                  >
                    {team.status === "paid" ? "Оплачено" : "Не оплачено"}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-dota-muted mb-3">
                  <p>
                    Капитан: {team.captainName} ({team.captainNickname})
                  </p>
                  <p>Telegram: {team.captainTelegram}</p>
                  <p>Email: {team.captainEmail}</p>
                  <p>Дата: {new Date(team.createdAt).toLocaleString("ru-RU")}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {team.players.map((player, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-dota-surface rounded text-xs text-dota-muted"
                    >
                      {player.nickname} ({player.mmr} MMR)
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {team.status !== "paid" ? (
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange(team.id, "paid")}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Подтвердить
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleStatusChange(team.id, "pending")}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Отменить
                  </Button>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDelete(team.id)}
                >
                  <Trash2 className="w-4 h-4 text-dota-red" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
