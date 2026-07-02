"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminSettings, updateSettings, checkAdminAuth } from "@/server/actions/admin";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface Settings {
  name: string;
  date: string;
  prizePool: string;
  entryFee: number;
  format: string;
  server: string;
  registrationOpen: boolean;
  discord: string;
  telegram: string;
  email: string;
  responseTime: string;
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkAdminAuth().then((isAdmin) => {
      if (!isAdmin) router.push("/admin/login");
    });
  }, [router]);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const data = await getAdminSettings();
    setSettings(data as Settings);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setMessage("");

    try {
      await updateSettings(settings);
      setMessage("Настройки сохранены");
    } catch {
      setMessage("Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof Settings, value: string | boolean | number) => {
    setSettings((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-dota-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-white mb-8">
        Настройки турнира
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-display font-bold text-dota-gold mb-4">
              Основная информация
            </h2>
            <div className="space-y-4">
              <Input
                label="Название турнира"
                value={settings.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
              <Input
                label="Дата и время старта"
                type="datetime-local"
                value={settings.date}
                onChange={(e) => updateField("date", e.target.value)}
              />
              <Input
                label="Призовой фонд"
                value={settings.prizePool}
                onChange={(e) => updateField("prizePool", e.target.value)}
              />
              <Input
                label="Стоимость участия (₽)"
                type="number"
                value={settings.entryFee}
                onChange={(e) =>
                  updateField("entryFee", parseInt(e.target.value) || 0)
                }
              />
              <Input
                label="Формат"
                value={settings.format}
                onChange={(e) => updateField("format", e.target.value)}
              />
              <Input
                label="Сервер"
                value={settings.server}
                onChange={(e) => updateField("server", e.target.value)}
              />
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.registrationOpen}
                  onChange={(e) =>
                    updateField("registrationOpen", e.target.checked)
                  }
                  className="w-5 h-5 accent-dota-red"
                />
                <span className="text-dota-text">Регистрация открыта</span>
              </label>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-display font-bold text-dota-gold mb-4">
              Контакты
            </h2>
            <div className="space-y-4">
              <Input
                label="Discord"
                value={settings.discord}
                onChange={(e) => updateField("discord", e.target.value)}
              />
              <Input
                label="Telegram"
                value={settings.telegram}
                onChange={(e) => updateField("telegram", e.target.value)}
              />
              <Input
                label="Email"
                value={settings.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
              <Input
                label="Время ответа"
                value={settings.responseTime}
                onChange={(e) => updateField("responseTime", e.target.value)}
              />
            </div>
          </Card>
        </div>

        {message && (
          <div
            className={`mt-6 p-4 rounded-lg ${
              message.includes("Ошибка")
                ? "bg-dota-red/10 text-dota-red border border-dota-red/30"
                : "bg-green-500/10 text-green-400 border border-green-500/30"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-8">
          <Button type="submit" size="lg" disabled={saving}>
            {saving ? "Сохранение..." : "Сохранить настройки"}
          </Button>
        </div>
      </form>
    </div>
  );
}
