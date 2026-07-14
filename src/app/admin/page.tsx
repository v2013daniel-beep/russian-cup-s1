"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSiteData } from "@/hooks/useSiteData";
import { checkAdminAuth } from "@/server/actions/admin";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ToggleRegistrationButton } from "@/components/admin/ToggleRegistrationButton";
import {
  Eye,
  Users,
  CreditCard,
  Wallet,
  TrendingUp,
  UserCheck,
  Calendar,
  Clock,
} from "lucide-react";
import { isToday, isYesterday, startOfDay, subDays } from "date-fns";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const { data } = useSiteData();

  useEffect(() => {
    checkAdminAuth().then((isAdmin) => {
      if (!isAdmin) router.push("/admin/login");
      else setAuthChecked(true);
    });
  }, [router]);

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-dota-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const registrationsToday = data.registrations.filter((r) =>
    isToday(new Date(r.createdAt))
  ).length;
  const registrationsYesterday = data.registrations.filter((r) =>
    isYesterday(new Date(r.createdAt))
  ).length;
  const registrationsWeek = data.registrations.filter((r) =>
    new Date(r.createdAt) >= subDays(startOfDay(new Date()), 7)
  ).length;

  const visitsToday = data.visits.filter((v) => isToday(new Date(v.date))).length;
  const visitsTotal = data.visits.length;
  const paidTeams = data.teams.filter((t) => t.status === "paid").length;
  const pendingTeams = data.teams.filter((t) => t.status === "pending").length;
  const totalRevenue = paidTeams * data.tournament.entryFee;

  const stats = [
    { title: "Посещения сегодня", value: visitsToday, icon: Eye, color: "text-blue-400", bgColor: "bg-blue-400/10" },
    { title: "Всего посещений", value: visitsTotal, icon: TrendingUp, color: "text-dota-muted", bgColor: "bg-dota-muted/10" },
    { title: "Всего команд", value: data.teams.length, icon: Users, color: "text-dota-red", bgColor: "bg-dota-red/10" },
    { title: "Оплаченных заявок", value: paidTeams, icon: CreditCard, color: "text-dota-gold", bgColor: "bg-dota-gold/10" },
    { title: "Не оплаченных", value: pendingTeams, icon: UserCheck, color: "text-orange-400", bgColor: "bg-orange-400/10" },
    { title: "Общая выручка", value: `${totalRevenue.toLocaleString("ru-RU")} ₽`, icon: Wallet, color: "text-green-400", bgColor: "bg-green-400/10" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold text-white">Дашборд</h1>
        <ToggleRegistrationButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            bgColor={stat.bgColor}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-display font-bold text-white mb-4">
            Регистрации
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <RegistrationStat label="Сегодня" value={registrationsToday} icon={Calendar} />
            <RegistrationStat label="Вчера" value={registrationsYesterday} icon={Clock} />
            <RegistrationStat label="За 7 дней" value={registrationsWeek} icon={TrendingUp} />
            <RegistrationStat label="Всего" value={data.registrations.length} icon={Users} />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-display font-bold text-white mb-4">
            Быстрые действия
          </h2>
          <div className="flex flex-col gap-3">
            <a href="/admin/teams">
              <Button variant="outline" fullWidth>Управление командами</Button>
            </a>
            <a href="/admin/settings">
              <Button variant="outline" fullWidth>Настройки турнира</Button>
            </a>
            <a href="/admin/schedule">
              <Button variant="outline" fullWidth>Расписание матчей</Button>
            </a>
            <a href="/admin/registrations">
              <Button variant="outline" fullWidth>Заявки и статистика</Button>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-dota-muted text-sm mb-1">{title}</p>
          <p className="text-3xl font-display font-bold text-white">{value}</p>
        </div>
        <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </Card>
  );
}

function RegistrationStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <div className="text-center p-4 bg-dota-surface rounded-lg">
      <Icon className="w-5 h-5 text-dota-gold mx-auto mb-2" />
      <p className="text-2xl font-display font-bold text-white">{value}</p>
      <p className="text-xs text-dota-muted">{label}</p>
    </div>
  );
}
