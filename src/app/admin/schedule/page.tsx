"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAdminAuth } from "@/server/actions/admin";
import { useSiteData } from "@/hooks/useSiteData";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, Trash2, Save, X, Shuffle } from "lucide-react";
import { type Match } from "@/lib/data";

const roundNames: Record<number, string> = {
  1: "Раунд 1",
  2: "Полуфинал",
  3: "Финал",
  4: "Гранд-финал",
};

const emptyBracketRounds = [
  { round: 1, matches: 2 },
  { round: 2, matches: 1 },
  { round: 3, matches: 1 },
];

export default function AdminSchedulePage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const { data, setMatches, updateMatch } = useSiteData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Match>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState<Partial<Match>>({
    round: 1,
    matchNumber: 1,
    status: "scheduled",
  });

  useEffect(() => {
    checkAdminAuth().then((isAdmin) => {
      if (!isAdmin) router.push("/admin/login");
      else setAuthChecked(true);
    });
  }, [router]);

  const teamOptions = ["", ...data.teams.map((t) => t.teamName)];

  const generateEmptyBracket = () => {
    const newMatches: Match[] = [];
    emptyBracketRounds.forEach(({ round, matches }) => {
      for (let i = 1; i <= matches; i++) {
        newMatches.push({
          id: `m-${round}-${i}-${Date.now()}`,
          round,
          matchNumber: i,
          status: "scheduled",
        });
      }
    });
    setMatches(newMatches);
  };

  const autoFillTeams = () => {
    const teams = data.teams.filter((t) => t.status === "paid").map((t) => t.teamName);
    if (teams.length < 4) {
      alert("Для автозаполнения нужно минимум 4 команды со статусом 'Оплачено'");
      return;
    }
    const shuffled = [...teams].sort(() => Math.random() - 0.5);
    const newMatches: Match[] = [];
    emptyBracketRounds.forEach(({ round, matches }) => {
      for (let i = 1; i <= matches; i++) {
        const match: Match = {
          id: `m-${round}-${i}-${Date.now()}-${i}`,
          round,
          matchNumber: i,
          status: "scheduled",
        };
        if (round === 1) {
          const idx = (i - 1) * 2;
          match.teamA = shuffled[idx];
          match.teamB = shuffled[idx + 1];
        }
        newMatches.push(match);
      }
    });
    setMatches(newMatches);
  };

  const handleDelete = (id: string) => {
    if (confirm("Удалить матч?")) {
      setMatches(data.matches.filter((m) => m.id !== id));
    }
  };

  const startEdit = (match: Match) => {
    setEditingId(match.id);
    setEditForm({
      ...match,
      scheduledAt: match.scheduledAt
        ? new Date(match.scheduledAt).toISOString().slice(0, 16)
        : "",
    });
  };

  const saveEdit = () => {
    if (editingId && editForm) {
      updateMatch(editingId, {
        ...editForm,
        scheduledAt: editForm.scheduledAt ? new Date(editForm.scheduledAt).toISOString() : undefined,
      });
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleAdd = () => {
    const newMatch: Match = {
      id: `m-${Date.now()}`,
      round: addForm.round || 1,
      matchNumber: addForm.matchNumber || 1,
      teamA: addForm.teamA || undefined,
      teamB: addForm.teamB || undefined,
      scheduledAt: addForm.scheduledAt ? new Date(addForm.scheduledAt).toISOString() : undefined,
      status: addForm.status || "scheduled",
    };
    setMatches([...data.matches, newMatch]);
    setShowAdd(false);
    setAddForm({ round: 1, matchNumber: 1, status: "scheduled" });
  };

  const resetSchedule = () => {
    if (confirm("Обнулить расписание? Все матчи будут удалены.")) {
      setMatches([]);
    }
  };

  const rounds = Array.from(new Set(data.matches.map((m) => m.round))).sort((a, b) => a - b);
  const maxRound = rounds.length > 0 ? Math.max(...rounds) : 3;
  const displayRounds = Array.from({ length: maxRound }, (_, i) => i + 1);

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
        <h1 className="text-3xl font-display font-bold text-white">Конструктор сетки</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="gold" onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4 mr-2" /> Добавить матч
          </Button>
          <Button variant="outline" onClick={generateEmptyBracket}>
            Создать пустую сетку
          </Button>
          <Button variant="outline" onClick={autoFillTeams}>
            <Shuffle className="w-4 h-4 mr-2" /> Автозаполнение
          </Button>
          <Button variant="secondary" onClick={resetSchedule}>
            Обнулить
          </Button>
        </div>
      </div>

      {showAdd && (
        <Card className="p-4 mb-6">
          <h3 className="text-lg font-display font-bold text-white mb-4">Новый матч</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Input type="number" placeholder="Раунд" value={addForm.round} onChange={(e) => setAddForm({ ...addForm, round: parseInt(e.target.value) || 1 })} />
            <Input type="number" placeholder="Номер матча" value={addForm.matchNumber} onChange={(e) => setAddForm({ ...addForm, matchNumber: parseInt(e.target.value) || 1 })} />
            <Input type="datetime-local" value={addForm.scheduledAt || ""} onChange={(e) => setAddForm({ ...addForm, scheduledAt: e.target.value })} />
            <select
              className="bg-dota-surface border border-dota-gold/20 rounded-lg px-4 py-2 text-white"
              value={addForm.status}
              onChange={(e) => setAddForm({ ...addForm, status: e.target.value as Match["status"] })}
            >
              <option value="scheduled">Запланирован</option>
              <option value="live">Live</option>
              <option value="finished">Завершён</option>
            </select>
            <TeamSelect value={addForm.teamA || ""} options={teamOptions} onChange={(v) => setAddForm({ ...addForm, teamA: v || undefined })} />
            <TeamSelect value={addForm.teamB || ""} options={teamOptions} onChange={(v) => setAddForm({ ...addForm, teamB: v || undefined })} />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd}><Save className="w-4 h-4 mr-1" /> Сохранить</Button>
            <Button variant="secondary" size="sm" onClick={() => setShowAdd(false)}><X className="w-4 h-4 mr-1" /> Отмена</Button>
          </div>
        </Card>
      )}

      {data.matches.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-dota-muted text-lg mb-2">Сетка пуста</p>
          <p className="text-dota-gold mb-6">Создайте пустую сетку, заполните команды вручную или используйте автозаполнение.</p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={generateEmptyBracket}>Создать пустую сетку</Button>
            <Button variant="gold" onClick={autoFillTeams}><Shuffle className="w-4 h-4 mr-2" /> Автозаполнение</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayRounds.map((round) => {
            const roundMatches = data.matches.filter((m) => m.round === round).sort((a, b) => a.matchNumber - b.matchNumber);
            return (
              <div key={round} className="space-y-4">
                <h3 className="text-center font-display font-bold text-dota-gold text-lg">
                  {roundNames[round] || `Раунд ${round}`}
                </h3>
                <div className="space-y-4">
                  {roundMatches.map((match) => (
                    <Card key={match.id} className="p-4">
                      {editingId === match.id ? (
                        <div className="space-y-3">
                          <Input type="datetime-local" value={editForm.scheduledAt || ""} onChange={(e) => setEditForm({ ...editForm, scheduledAt: e.target.value })} />
                          <TeamSelect value={editForm.teamA || ""} options={teamOptions} onChange={(v) => setEditForm({ ...editForm, teamA: v || undefined })} />
                          <TeamSelect value={editForm.teamB || ""} options={teamOptions} onChange={(v) => setEditForm({ ...editForm, teamB: v || undefined })} />
                          <Input placeholder="Победитель (если завершён)" value={editForm.winner || ""} onChange={(e) => setEditForm({ ...editForm, winner: e.target.value || undefined })} />
                          <select
                            className="w-full bg-dota-surface border border-dota-gold/20 rounded-lg px-4 py-2 text-white"
                            value={editForm.status}
                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Match["status"] })}
                          >
                            <option value="scheduled">Запланирован</option>
                            <option value="live">Live</option>
                            <option value="finished">Завершён</option>
                          </select>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={saveEdit}><Save className="w-4 h-4 mr-1" /> Сохранить</Button>
                            <Button variant="secondary" size="sm" onClick={() => setEditingId(null)}><X className="w-4 h-4 mr-1" /> Отмена</Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-dota-muted">Матч {match.matchNumber}</span>
                            <StatusBadge status={match.status} />
                          </div>
                          <div className="space-y-2 mb-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-white font-medium truncate max-w-[100px]">{match.teamA || "TBD"}</span>
                              <span className="text-dota-muted text-xs">{match.status === "finished" && match.winner === match.teamA ? "W" : ""}</span>
                            </div>
                            <div className="h-px bg-dota-gold/20" />
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-white font-medium truncate max-w-[100px]">{match.teamB || "TBD"}</span>
                              <span className="text-dota-muted text-xs">{match.status === "finished" && match.winner === match.teamB ? "W" : ""}</span>
                            </div>
                          </div>
                          {match.scheduledAt && (
                            <p className="text-xs text-dota-muted mb-3">
                              {new Date(match.scheduledAt).toLocaleString("ru-RU")}
                            </p>
                          )}
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" fullWidth onClick={() => startEdit(match)}>Изменить</Button>
                            <Button variant="secondary" size="sm" onClick={() => handleDelete(match.id)}>
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
          })}
        </div>
      )}
    </div>
  );
}

function TeamSelect({ value, options, onChange }: { value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <select
      className="w-full bg-dota-surface border border-dota-gold/20 rounded-lg px-4 py-2 text-white"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Команда...</option>
      {options.filter(Boolean).map((team) => (
        <option key={team} value={team}>{team}</option>
      ))}
    </select>
  );
}

function StatusBadge({ status }: { status: Match["status"] }) {
  const styles = {
    scheduled: "bg-dota-muted/10 text-dota-muted",
    live: "bg-dota-red/20 text-dota-red animate-pulse",
    finished: "bg-green-500/10 text-green-400",
  };
  const labels = { scheduled: "Запланирован", live: "Live", finished: "Завершён" };
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
}
