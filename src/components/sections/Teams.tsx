"use client";

import { motion } from "framer-motion";
import { Trophy, Users, Search } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useState } from "react";

interface Team {
  id: string;
  teamName: string;
  teamTag: string;
  status: string;
  players: { nickname: string }[];
}

interface TeamsProps {
  teams: Team[];
}

export function Teams({ teams }: TeamsProps) {
  const [search, setSearch] = useState("");

  const filteredTeams = teams.filter(
    (team) =>
      team.teamName.toLowerCase().includes(search.toLowerCase()) ||
      team.teamTag.toLowerCase().includes(search.toLowerCase())
  );

  const paidTeams = teams.filter((team) => team.status === "paid");

  return (
    <section id="teams" className="py-28 bg-dota-black relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "url('/svgs/dota-pattern.svg')" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,215,0,0.05)_0%,transparent_50%)]" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Команды-участники"
          subtitle={`${paidTeams.length} команд подтвердили участие. Присоединяйся к лучшим!`}
          accent="gold"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto mb-10"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dota-muted" />
            <Input
              placeholder="Поиск по команде или тегу..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12"
            />
          </div>
        </motion.div>

        {filteredTeams.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-dota-muted text-lg">
              Пока нет зарегистрированных команд. Будь первым!
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="h-full border-glow hover:-translate-y-1 transition-transform">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-display font-bold text-white">
                        {team.teamName}
                      </h3>
                      <span className="text-sm text-dota-gold">[{team.teamTag}]</span>
                    </div>
                    {team.status === "paid" ? (
                      <div className="flex items-center gap-1 px-2 py-1 bg-dota-gold/10 border border-dota-gold/30 rounded text-xs text-dota-gold">
                        <Trophy className="w-3 h-3" />
                        Оплачено
                      </div>
                    ) : (
                      <div className="px-2 py-1 bg-dota-muted/10 border border-dota-muted/30 rounded text-xs text-dota-muted">
                        Регистрация
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-dota-muted">
                    <Users className="w-4 h-4" />
                    <span>{team.players.length} игроков</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
