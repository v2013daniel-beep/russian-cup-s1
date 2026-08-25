"use client";

import { motion } from "framer-motion";
import { Trophy, Crown, Medal, Award } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";
import { useSiteData } from "@/hooks/useSiteData";

const placeStyles: Record<number, { icon: React.ElementType; color: string; bgColor: string }> = {
  1: { icon: Crown, color: "text-dota-gold", bgColor: "bg-dota-gold/10" },
  2: { icon: Trophy, color: "text-dota-muted", bgColor: "bg-dota-muted/10" },
  3: { icon: Medal, color: "text-orange-400", bgColor: "bg-orange-400/10" },
};

export function HallOfFame() {
  const { data } = useSiteData();
  const entries = data.hallOfFame;

  return (
    <section className="py-24 bg-dota-black relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Зал славы"
          subtitle="Легенды прошлых сезонов"
          accent="gold"
        />

        {entries.length === 0 ? (
          <Card className="py-12 text-center">
            <Award className="w-12 h-12 text-dota-muted mx-auto mb-4" />
            <p className="text-xl text-dota-muted">
              Победители будут объявлены после завершения турнира
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {entries.map((entry, index) => {
              const style = placeStyles[entry.place] || placeStyles[3];
              const Icon = style.icon;

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="text-center py-8" glow="gold">
                    <div
                      className={`w-16 h-16 ${style.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                      <Icon className={`w-8 h-8 ${style.color}`} />
                    </div>
                    <div className="text-4xl font-display font-bold text-white mb-2">
                      #{entry.place}
                    </div>
                    <h3 className="text-xl font-display font-bold text-dota-gold mb-1">
                      {entry.team}
                    </h3>
                    <p className="text-dota-muted text-sm mb-3">{entry.title}</p>
                    <p className="text-white font-bold">{entry.prize}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
