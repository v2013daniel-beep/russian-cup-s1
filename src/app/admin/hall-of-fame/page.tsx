"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAdminAuth } from "@/server/actions/admin";
import { useSiteData } from "@/hooks/useSiteData";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, Trash2, Save, X, Edit2 } from "lucide-react";
import { type HallOfFameEntry } from "@/lib/data";

export default function AdminHallOfFamePage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const { data, setHallOfFame } = useSiteData();
  const [entries, setEntries] = useState<Omit<HallOfFameEntry, "id">[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ place: 1, team: "", title: "", prize: "" });

  useEffect(() => {
    checkAdminAuth().then((isAdmin) => {
      if (!isAdmin) router.push("/admin/login");
      else setAuthChecked(true);
    });
  }, [router]);

  useEffect(() => {
    if (authChecked) {
      setEntries(
        data.hallOfFame.map((entry) => ({
          place: entry.place,
          team: entry.team,
          title: entry.title,
          prize: entry.prize,
          order: entry.order,
        }))
      );
    }
  }, [authChecked, data.hallOfFame]);

  const handleAdd = () => {
    if (!addForm.team || !addForm.title || !addForm.prize) return;
    setEntries((prev) => [...prev, { ...addForm, order: prev.length }]);
    setAddForm({ place: 1, team: "", title: "", prize: "" });
    setShowAdd(false);
  };

  const handleUpdate = (index: number, field: keyof Omit<HallOfFameEntry, "id">, value: string | number) => {
    setEntries((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleDelete = (index: number) => {
    if (confirm("Удалить запись из Зала славы?")) {
      setEntries((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    await setHallOfFame(entries);
    setEditingIndex(null);
  };

  const handleReset = () => {
    if (confirm("Сбросить изменения?")) {
      setEntries(
        data.hallOfFame.map((entry) => ({
          place: entry.place,
          team: entry.team,
          title: entry.title,
          prize: entry.prize,
          order: entry.order,
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
        <h1 className="text-3xl font-display font-bold text-white">Зал славы</h1>
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
          <h3 className="text-lg font-display font-bold text-white mb-4">Новая запись</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Input
              type="number"
              placeholder="Место"
              value={addForm.place}
              onChange={(e) => setAddForm({ ...addForm, place: parseInt(e.target.value) || 1 })}
            />
            <Input
              placeholder="Команда"
              value={addForm.team}
              onChange={(e) => setAddForm({ ...addForm, team: e.target.value })}
            />
            <Input
              placeholder="Титул"
              value={addForm.title}
              onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
            />
            <Input
              placeholder="Приз"
              value={addForm.prize}
              onChange={(e) => setAddForm({ ...addForm, prize: e.target.value })}
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

      {entries.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-dota-muted text-lg mb-2">Зал славы пуст</p>
          <p className="text-dota-gold">Добавьте команды-победители прошлых сезонов.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {entries.map((entry, index) => (
            <Card key={index} className="p-5">
              {editingIndex === index ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    type="number"
                    value={entry.place}
                    onChange={(e) => handleUpdate(index, "place", parseInt(e.target.value) || 1)}
                  />
                  <Input
                    value={entry.team}
                    onChange={(e) => handleUpdate(index, "team", e.target.value)}
                  />
                  <Input
                    value={entry.title}
                    onChange={(e) => handleUpdate(index, "title", e.target.value)}
                  />
                  <Input
                    value={entry.prize}
                    onChange={(e) => handleUpdate(index, "prize", e.target.value)}
                  />
                  <div className="flex gap-2 md:col-span-4">
                    <Button size="sm" onClick={() => setEditingIndex(null)}>
                      <Save className="w-4 h-4 mr-1" /> Готово
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleDelete(index)}>
                      <Trash2 className="w-4 h-4 mr-1" /> Удалить
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-display font-bold text-dota-gold w-12">
                      #{entry.place}
                    </span>
                    <div>
                      <h3 className="text-xl font-display font-bold text-white">{entry.team}</h3>
                      <p className="text-dota-muted text-sm">{entry.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-white font-bold">{entry.prize}</span>
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
