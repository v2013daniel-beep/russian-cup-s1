"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trophy, LayoutDashboard, Users, Settings, LogOut } from "lucide-react";
import { adminLogout } from "@/server/actions/admin";

const navItems = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard },
  { href: "/admin/teams", label: "Команды", icon: Users },
  { href: "/admin/settings", label: "Настройки", icon: Settings },
];

export function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    await adminLogout();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dota-void/95 backdrop-blur-lg border-b border-dota-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-dota-red rounded-lg flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-white">АДМИНКА</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 text-sm text-dota-muted hover:text-dota-gold transition-colors"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-dota-muted hover:text-dota-red transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Выйти</span>
          </button>
        </div>
      </div>
    </header>
  );
}
