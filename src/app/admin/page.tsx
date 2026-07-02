import { redirect } from "next/navigation";
import { getDashboardStats, toggleRegistration } from "@/server/actions/admin";
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
} from "lucide-react";

export default async function AdminDashboardPage() {
  const isAdmin = await checkAdminAuth();
  if (!isAdmin) redirect("/admin/login");

  const stats = await getDashboardStats();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold text-white">Дашборд</h1>
        <ToggleRegistrationButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Посещения сегодня"
          value={stats.visitsToday}
          icon={Eye}
          color="text-blue-400"
          bgColor="bg-blue-400/10"
        />
        <StatCard
          title="Всего посещений"
          value={stats.visitsTotal}
          icon={TrendingUp}
          color="text-dota-muted"
          bgColor="bg-dota-muted/10"
        />
        <StatCard
          title="Всего заявок"
          value={stats.totalTeams}
          icon={Users}
          color="text-dota-red"
          bgColor="bg-dota-red/10"
        />
        <StatCard
          title="Оплаченных заявок"
          value={stats.paidTeams}
          icon={CreditCard}
          color="text-dota-gold"
          bgColor="bg-dota-gold/10"
        />
        <StatCard
          title="Не оплаченных"
          value={stats.pendingTeams}
          icon={UserCheck}
          color="text-orange-400"
          bgColor="bg-orange-400/10"
        />
        <StatCard
          title="Общая выручка"
          value={`${stats.totalRevenue.toLocaleString("ru-RU")} ₽`}
          icon={Wallet}
          color="text-green-400"
          bgColor="bg-green-400/10"
        />
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-display font-bold text-white mb-4">
          Быстрые действия
        </h2>
        <div className="flex flex-wrap gap-4">
          <a href="/admin/teams">
            <Button variant="outline">Управление командами</Button>
          </a>
          <a href="/admin/settings">
            <Button variant="outline">Настройки турнира</Button>
          </a>
        </div>
      </Card>
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
