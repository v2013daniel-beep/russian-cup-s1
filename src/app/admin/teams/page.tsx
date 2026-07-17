"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkAdminAuth } from "@/server/actions/admin";
import { useSiteData } from "@/hooks/useSiteData";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, Download, Trash2, Check, X, Plus, Edit2, Save } from "lucide-react";
import { type Team } from "@/lib/data";

export default function AdminTeamsPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const { data, updateTeam, deleteTeam, addTeam } = useSiteData();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "paid" | "pending">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Team>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState<Partial<Team>>({ status: "pending", playerCount: 5, players: [] });

  useEffect(() => {
    checkAdminAuth().then((isAdmin) => {
      if (!isAdmin) router.push("/admin/login");
      else setAuthChecked(true);
    });
  }, [router]);

  const filteredTeams = data.teams
    .filter((team) => (filter === "all" ? true : team.status === filter))
    .filter(
      (team) =>
        team.teamName.toLowerCase().includes(search.toLowerCase()) ||
        team.teamTag.toLowerCase().includes(search.toLowerCase()) ||
        team.captainNickname.toLowerCase().includes(search.toLowerCase())
    );

  const handleStatusChange = async (team: Team, status: "pending" | "paid") => {
    await updateTeam(team.id, { status });
  };

  const handleDelete = async (teamId: string) => {
    if (confirm("Удалить команду?")) {
      await deleteTeam(teamId);
    }
  };

  const startEdit = (team: Team) => {
    setEditingId(team.id);
    setEditForm({ ...team });
  };

  const saveEdit = async () => {
    if (editingId && editForm) {
      await updateTeam(editingId, editForm);
      setEditingId(null);
      setEditForm({});
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleAdd = async () => {
    if (!addForm.teamName || !addForm.teamTag) return;
    await addTeam({
      teamName: addForm.teamName,
      teamTag: addForm.teamTag,
      playerCount: addForm.playerCount || 5,
      substitute: addForm.substitute || "",
      captainName: addForm.captainName || "",
      captainNickname: addForm.captainNickname || "",
      captainTelegram: addForm.captainTelegram || "",
      captainDiscord: addForm.captainDiscord || "",
      captainEmail: addForm.captainEmail || "",
      players: addForm.players || [],
      status: addForm.status || "pending",
    });
    setShowAdd(false);
    setAddForm({ status: "pending", playerCount: 5, players: [] });
  };

  const exportTeams = () => {
    const csv = [
      ["Название", "Тег", "Статус", "Капитан", "Telegram", "Email", "Игроки"].join(";"),
      ...data.teams.map((team) =>
        [
          team.teamName,
          team.teamTag,
          team.status,
          team.captainName,
          team.captainTelegram,
          team.captainEmail,
          team.players.map((p) => `${p.nickname} (${p.mmr})`).join(", "),
        ].join(";")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "teams.csv";
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
        <h1 className="text-3xl font-display font-bold text-white">Команды</h1>
        <div className="flex gap-2">
          <Button variant="gold" onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Добавить
          </Button>
          <Button variant="outline" onClick={exportTeams}>
            <Download className="w-4 h-4 mr-2" />
            Экспорт CSV
          </Button>
        </div>
      </div>

      {showAdd && (
        <Card className="p-4 mb-6">
          <h3 className="text-lg font-display font-bold text-white mb-4">Новая команда</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input placeholder="Название" value={addForm.teamName || ""} onChange={(e) => setAddForm({ ...addForm, teamName: e.target.value })} />
            <Input placeholder="Тег" value={addForm.teamTag || ""} onChange={(e) => setAddForm({ ...addForm, teamTag: e.target.value })} />
            <Input placeholder="Капитан" value={addForm.captainNickname || ""} onChange={(e) => setAddForm({ ...addForm, captainNickname: e.target.value })} />
            <Input placeholder="Telegram" value={addForm.captainTelegram || ""} onChange={(e) => setAddForm({ ...addForm, captainTelegram: e.target.value })} />
            <Input placeholder="Email" value={addForm.captainEmail || ""} onChange={(e) => setAddForm({ ...addForm, captainEmail: e.target.value })} />
            <select
              className="bg-dota-surface border border-dota-gold/20 rounded-lg px-4 py-2 text-white"
              value={addForm.status}
              onChange={(e) => setAddForm({ ...addForm, status: e.target.value as "pending" | "paid" })}
            >
              <option value="pending">Не оплачено</option>
              <option value="paid">Оплачено</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd}>
              <Save className="w-4 h-4 mr-1" /> Сохранить
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setShowAdd(false)}>
              <X className="w-4 h-4 mr-1" /> Отмена
            </Button>
          </div>
        </Card>
      )}

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
        {filteredTeams.map((team) => (
          <Card key={team.id} className="p-5">
            {editingId === team.id ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input value={editForm.teamName || ""} onChange={(e) => setEditForm({ ...editForm, teamName: e.target.value })} />
                <Input value={editForm.teamTag || ""} onChange={(e) => setEditForm({ ...editForm, teamTag: e.target.value })} />
                <Input value={editForm.captainName || ""} onChange={(e) => setEditForm({ ...editForm, captainName: e.target.value })} />
                <Input value={editForm.captainNickname || ""} onChange={(e) => setEditForm({ ...editForm, captainNickname: e.target.value })} />
                <Input value={editForm.captainTelegram || ""} onChange={(e) => setEditForm({ ...editForm, captainTelegram: e.target.value })} />
                <Input value={editForm.captainEmail || ""} onChange={(e) => setEditForm({ ...editForm, captainEmail: e.target.value })} />
                <Input value={editForm.captainDiscord || ""} onChange={(e) => setEditForm({ ...editForm, captainDiscord: e.target.value })} />
                <select
                  className="bg-dota-surface border border-dota-gold/20 rounded-lg px-4 py-2 text-white"
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as "pending" | "paid" })}
                >
                  <option value="pending">Не оплачено</option>
                  <option value="paid">Оплачено</option>
                </select>
                <div className="flex gap-2 items-center">
                  <Button size="sm" onClick={saveEdit}><Save className="w-4 h-4 mr-1" /> Сохранить</Button>
                  <Button variant="secondary" size="sm" onClick={cancelEdit}><X className="w-4 h-4 mr-1" /> Отмена</Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-display font-bold text-white">{team.teamName}</h3>
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
                    <p>Капитан: {team.captainName} ({team.captainNickname})</p>
                    <p>Telegram: {team.captainTelegram}</p>
                    <p>Email: {team.captainEmail}</p>
                    <p>Discord: {team.captainDiscord}</p>
                    <p>Дата: {new Date(team.createdAt).toLocaleString("ru-RU")}</p>
                    <p>Игроков: {team.players.length}</p>
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
                    <Button size="sm" onClick={() => handleStatusChange(team, "paid")}>
                      <Check className="w-4 h-4 mr-1" /> Подтвердить
                    </Button>
                  ) : (
                    <Button variant="secondary" size="sm" onClick={() => handleStatusChange(team, "pending")}>
                      <X className="w-4 h-4 mr-1" /> Отменить
                    </Button>
                  )}
                  <Button variant="secondary" size="sm" onClick={() => startEdit(team)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => handleDelete(team.id)}>
                    <Trash2 className="w-4 h-4 text-dota-red" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
