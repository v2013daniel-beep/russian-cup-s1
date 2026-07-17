"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAdminAuth } from "@/server/actions/admin";
import { useSiteData } from "@/hooks/useSiteData";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface SettingsForm {
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
  streamUrl: string;
  streamTitle: string;
  streamActive: boolean;
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const { data, updateTournament, updateContacts, updateLiveStream } = useSiteData();
  const [settings, setSettings] = useState<SettingsForm | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkAdminAuth().then((isAdmin) => {
      if (!isAdmin) router.push("/admin/login");
      else setAuthChecked(true);
    });
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;
    setSettings({
      name: data.tournament.name,
      date: new Date(data.tournament.date).toISOString().slice(0, 16),
      prizePool: data.tournament.prizePool,
      entryFee: data.tournament.entryFee,
      format: data.tournament.format,
      server: data.tournament.server,
      registrationOpen: data.tournament.registrationOpen,
      discord: data.contacts.discord,
      telegram: data.contacts.telegram,
      email: data.contacts.email,
      responseTime: data.contacts.responseTime,
      streamUrl: data.liveStream.url,
      streamTitle: data.liveStream.title,
      streamActive: data.liveStream.isActive,
    });
  }, [authChecked, data]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!settings) return;

    await updateTournament({
      name: settings.name,
      date: new Date(settings.date).toISOString(),
      prizePool: settings.prizePool,
      entryFee: settings.entryFee,
      format: settings.format,
      server: settings.server,
      registrationOpen: settings.registrationOpen,
    });

    await updateContacts({
      discord: settings.discord,
      telegram: settings.telegram,
      email: settings.email,
      responseTime: settings.responseTime,
    });

    await updateLiveStream({
      url: settings.streamUrl,
      title: settings.streamTitle,
      isActive: settings.streamActive,
    });

    setMessage("Настройки сохранены");
    setTimeout(() => setMessage(""), 3000);
  };

  const updateField = (field: keyof SettingsForm, value: string | boolean | number) => {
    setSettings((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  if (!authChecked || !settings) {
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
                onChange={(e) => updateField("entryFee", parseInt(e.target.value) || 0)}
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
                  onChange={(e) => updateField("registrationOpen", e.target.checked)}
                  className="w-5 h-5 accent-dota-red"
                />
                <span className="text-dota-text">Регистрация открыта</span>
              </label>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-display font-bold text-dota-gold mb-4">
              Контакты и трансляция
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
              <Input
                label="Ссылка на трансляцию (YouTube/Twitch)"
                value={settings.streamUrl}
                onChange={(e) => updateField("streamUrl", e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
              />
              <Input
                label="Заголовок трансляции"
                value={settings.streamTitle}
                onChange={(e) => updateField("streamTitle", e.target.value)}
              />
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.streamActive}
                  onChange={(e) => updateField("streamActive", e.target.checked)}
                  className="w-5 h-5 accent-dota-red"
                />
                <span className="text-dota-text">Трансляция активна</span>
              </label>
            </div>
          </Card>
        </div>

        {message && (
          <div className="mt-6 p-4 rounded-lg bg-green-500/10 text-green-400 border border-green-500/30">
            {message}
          </div>
        )}

        <div className="mt-8">
          <Button type="submit" size="lg">
            Сохранить настройки
          </Button>
        </div>
      </form>
    </div>
  );
}
