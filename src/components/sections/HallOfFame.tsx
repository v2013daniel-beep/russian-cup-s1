"use client";

import { motion } from "framer-motion";
import { Trophy, Crown, Medal } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";

const winners = [
  {
    place: "1",
    team: "TEAM SPIRIT",
    title: "Чемпионы",
    prize: "150 000 ₽",
    icon: Crown,
    color: "text-dota-gold",
    bgColor: "bg-dota-gold/10",
  },
  {
    place: "2",
    team: "BETBOOM TEAM",
    title: "Вице-чемпионы",
    prize: "75 000 ₽",
    icon: Trophy,
    color: "text-dota-muted",
    bgColor: "bg-dota-muted/10",
  },
  {
    place: "3",
    team: "NATUS VINCERE",
    title: "Бронзовые призёры",
    prize: "25 000 ₽",
    icon: Medal,
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
  },
];

export function HallOfFame() {
  return (
    <section className="py-24 bg-dota-black relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Зал славы"
          subtitle="Легенды прошлых сезонов"
          accent="gold"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {winners.map((winner, index) => (
            <motion.div
              key={winner.team}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="text-center py-8" glow="gold">
                <div
                  className={`w-16 h-16 ${winner.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <winner.icon className={`w-8 h-8 ${winner.color}`} />
                </div>
                <div className="text-4xl font-display font-bold text-white mb-2">
                  #{winner.place}
                </div>
                <h3 className="text-xl font-display font-bold text-dota-gold mb-1">
                  {winner.team}
                </h3>
                <p className="text-dota-muted text-sm mb-3">{winner.title}</p>
                <p className="text-white font-bold">{winner.prize}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
