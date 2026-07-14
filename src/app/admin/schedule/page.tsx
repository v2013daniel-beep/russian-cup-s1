"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAdminAuth } from "@/server/actions/admin";
import { useSiteData } from "@/hooks/useSiteData";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, Trash2, Save, X } from "lucide-react";
import { type Match } from "@/lib/data";

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
        <h1 className="text-3xl font-display font-bold text-white">Расписание матчей</h1>
        <div className="flex gap-2">
          <Button variant="gold" onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4 mr-2" /> Добавить матч
          </Button>
          <Button variant="secondary" onClick={resetSchedule}>
            Обнулить сетку
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

      <div className="space-y-4">
        {data.matches.length === 0 && (
          <Card className="p-8 text-center text-dota-muted">
            Сетка пуста. Добавьте матчи или обнулите счётчик.
          </Card>
        )}
        {data.matches
          .sort((a, b) => a.round - b.round || a.matchNumber - b.matchNumber)
          .map((match) => (
            <Card key={match.id} className="p-4">
              {editingId === match.id ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input type="number" value={editForm.round} onChange={(e) => setEditForm({ ...editForm, round: parseInt(e.target.value) || 1 })} />
                  <Input type="number" value={editForm.matchNumber} onChange={(e) => setEditForm({ ...editForm, matchNumber: parseInt(e.target.value) || 1 })} />
                  <Input type="datetime-local" value={editForm.scheduledAt || ""} onChange={(e) => setEditForm({ ...editForm, scheduledAt: e.target.value })} />
                  <select
                    className="bg-dota-surface border border-dota-gold/20 rounded-lg px-4 py-2 text-white"
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Match["status"] })}
                  >
                    <option value="scheduled">Запланирован</option>
                    <option value="live">Live</option>
                    <option value="finished">Завершён</option>
                  </select>
                  <TeamSelect value={editForm.teamA || ""} options={teamOptions} onChange={(v) => setEditForm({ ...editForm, teamA: v || undefined })} />
                  <TeamSelect value={editForm.teamB || ""} options={teamOptions} onChange={(v) => setEditForm({ ...editForm, teamB: v || undefined })} />
                  <Input placeholder="Победитель" value={editForm.winner || ""} onChange={(e) => setEditForm({ ...editForm, winner: e.target.value || undefined })} />
                  <div className="flex gap-2 items-center">
                    <Button size="sm" onClick={saveEdit}><Save className="w-4 h-4 mr-1" /> Сохранить</Button>
                    <Button variant="secondary" size="sm" onClick={() => setEditingId(null)}><X className="w-4 h-4 mr-1" /> Отмена</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-dota-gold font-bold">Раунд {match.round}</span>
                      <span className="text-dota-muted">Матч {match.matchNumber}</span>
                      <StatusBadge status={match.status} />
                    </div>
                    <p className="text-white font-display text-lg">
                      {match.teamA || "TBD"} <span className="text-dota-gold">vs</span> {match.teamB || "TBD"}
                    </p>
                    {match.scheduledAt && (
                      <p className="text-sm text-dota-muted">
                        {new Date(match.scheduledAt).toLocaleString("ru-RU")}
                      </p>
                    )}
                    {match.winner && <p className="text-sm text-green-400">Победитель: {match.winner}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => startEdit(match)}>Изменить</Button>
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
}

function TeamSelect({ value, options, onChange }: { value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <select
      className="bg-dota-surface border border-dota-gold/20 rounded-lg px-4 py-2 text-white"
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
