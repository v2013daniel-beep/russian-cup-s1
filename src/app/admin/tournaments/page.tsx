"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAdminAuth } from "@/server/actions/admin";
import { useSiteData } from "@/hooks/useSiteData";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, Trash2, Save, X, Edit2 } from "lucide-react";
import { type PastTournament } from "@/lib/data";

export default function AdminTournamentsPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const { data, setPastTournaments } = useSiteData();
  const [tournaments, setTournaments] = useState<Omit<PastTournament, "id">[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    date: "",
    winner: "",
    secondPlace: "",
    thirdPlace: "",
    teamsCount: 0,
    prizePool: "",
  });

  useEffect(() => {
    checkAdminAuth().then((isAdmin) => {
      if (!isAdmin) router.push("/admin/login");
      else setAuthChecked(true);
    });
  }, [router]);

  useEffect(() => {
    if (authChecked) {
      setTournaments(
        data.pastTournaments.map((t) => ({
          name: t.name,
          date: t.date,
          winner: t.winner,
          secondPlace: t.secondPlace,
          thirdPlace: t.thirdPlace,
          teamsCount: t.teamsCount,
          prizePool: t.prizePool,
          order: t.order,
        }))
      );
    }
  }, [authChecked, data.pastTournaments]);

  const handleAdd = () => {
    if (!addForm.name || !addForm.date || !addForm.winner || !addForm.prizePool) return;
    setTournaments((prev) => [...prev, { ...addForm, order: prev.length }]);
    setAddForm({
      name: "",
      date: "",
      winner: "",
      secondPlace: "",
      thirdPlace: "",
      teamsCount: 0,
      prizePool: "",
    });
    setShowAdd(false);
  };

  const handleUpdate = (index: number, field: keyof Omit<PastTournament, "id">, value: string | number) => {
    setTournaments((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleDelete = (index: number) => {
    if (confirm("Удалить турнир из истории?")) {
      setTournaments((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    await setPastTournaments(tournaments);
    setEditingIndex(null);
  };

  const handleReset = () => {
    if (confirm("Сбросить изменения?")) {
      setTournaments(
        data.pastTournaments.map((t) => ({
          name: t.name,
          date: t.date,
          winner: t.winner,
          secondPlace: t.secondPlace,
          thirdPlace: t.thirdPlace,
          teamsCount: t.teamsCount,
          prizePool: t.prizePool,
          order: t.order,
        }))
      );
      setEditingIndex(null);
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
        <h1 className="text-3xl font-display font-bold text-white">Прошедшие турниры</h1>
        <div className="flex gap-2">
          <Button variant="gold" onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4 mr-2" /> Добавить
          </Button>
          <Button variant="outline" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" /> Сохранить
          </Button>
          <Button variant="secondary" onClick={handleReset}>
            <X className="w-4 h-4 mr-2" /> Сбросить
          </Button>
        </div>
      </div>

      {showAdd && (
        <Card className="p-4 mb-6">
          <h3 className="text-lg font-display font-bold text-white mb-4">Новый турнир</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              placeholder="Название"
              value={addForm.name}
              onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
            />
            <Input
              placeholder="Дата (например, 15 августа 2024)"
              value={addForm.date}
              onChange={(e) => setAddForm({ ...addForm, date: e.target.value })}
            />
            <Input
              placeholder="Призовой фонд"
              value={addForm.prizePool}
              onChange={(e) => setAddForm({ ...addForm, prizePool: e.target.value })}
            />
            <Input
              placeholder="Победитель"
              value={addForm.winner}
              onChange={(e) => setAddForm({ ...addForm, winner: e.target.value })}
            />
            <Input
              placeholder="2 место (optional)"
              value={addForm.secondPlace}
              onChange={(e) => setAddForm({ ...addForm, secondPlace: e.target.value })}
            />
            <Input
              placeholder="3 место (optional)"
              value={addForm.thirdPlace}
              onChange={(e) => setAddForm({ ...addForm, thirdPlace: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Количество команд"
              value={addForm.teamsCount}
              onChange={(e) => setAddForm({ ...addForm, teamsCount: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd}>
              <Save className="w-4 h-4 mr-1" /> Добавить
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setShowAdd(false)}>
              <X className="w-4 h-4 mr-1" /> Отмена
            </Button>
          </div>
        </Card>
      )}

      {tournaments.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-dota-muted text-lg mb-2">История турниров пуста</p>
          <p className="text-dota-gold">Добавьте прошедшие турниры.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {tournaments.map((tournament, index) => (
            <Card key={index} className="p-5">
              {editingIndex === index ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    value={tournament.name}
                    onChange={(e) => handleUpdate(index, "name", e.target.value)}
                  />
                  <Input
                    value={tournament.date}
                    onChange={(e) => handleUpdate(index, "date", e.target.value)}
                  />
                  <Input
                    value={tournament.prizePool}
                    onChange={(e) => handleUpdate(index, "prizePool", e.target.value)}
                  />
                  <Input
                    value={tournament.winner}
                    onChange={(e) => handleUpdate(index, "winner", e.target.value)}
                  />
                  <Input
                    value={tournament.secondPlace || ""}
                    onChange={(e) => handleUpdate(index, "secondPlace", e.target.value)}
                  />
                  <Input
                    value={tournament.thirdPlace || ""}
                    onChange={(e) => handleUpdate(index, "thirdPlace", e.target.value)}
                  />
                  <Input
                    type="number"
                    value={tournament.teamsCount}
                    onChange={(e) => handleUpdate(index, "teamsCount", parseInt(e.target.value) || 0)}
                  />
                  <div className="flex gap-2 md:col-span-3">
                    <Button size="sm" onClick={() => setEditingIndex(null)}>
                      <Save className="w-4 h-4 mr-1" /> Готово
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleDelete(index)}>
                      <Trash2 className="w-4 h-4 mr-1" /> Удалить
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-display font-bold text-white mb-1">
                      {tournament.name}
                    </h3>
                    <p className="text-dota-muted text-sm">
                      {tournament.date} · {tournament.teamsCount} команд · {tournament.prizePool}
                    </p>
                    <p className="text-dota-gold text-sm mt-2">
                      Победитель: {tournament.winner}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingIndex(index)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleDelete(index)}>
                      <Trash2 className="w-4 h-4 text-dota-red" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
