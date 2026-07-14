"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";
import { TiltCard } from "@/components/effects/TiltCard";
import { FloatingRunes3D } from "@/components/effects/FloatingRunes3D";
import { type Match } from "@/lib/data";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface BracketProps {
  matches?: Match[];
}

export function Bracket({ matches = [] }: BracketProps) {
  const rounds = matches.length > 0
    ? Array.from(new Set(matches.map((m) => m.round))).sort((a, b) => a - b)
    : [1, 2, 3];

  const getRoundName = (round: number, total: number) => {
    if (round === total) return "Финал";
    if (round === total - 1) return "Полуфинал";
    return `Раунд ${round}`;
  };

  return (
    <section className="py-24 bg-dota-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(229,57,53,0.06)_0%,transparent_60%)]" />
      <FloatingRunes3D count={10} className="z-[1] opacity-40" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Сетка турнира"
          subtitle="Single elimination bracket — до последнего героя"
          accent="gold"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <TiltCard tiltAmount={6} glareEnabled={false}>
            <Card className="p-8 md:p-12">
              {matches.length === 0 ? (
                <div className="text-center">
                  <p className="text-dota-muted text-lg mb-4">
                    Сетка турнира будет сформирована после закрытия регистрации.
                  </p>
                  <p className="text-dota-gold font-display font-bold text-xl">
                    Ожидаем участников...
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
                    {rounds.map((round) => {
                      const roundMatches = matches.filter((m) => m.round === round);
                      return (
                        <div
                          key={round}
                          className="space-y-4 md:space-y-0 flex flex-col justify-around"
                          style={{ minHeight: round === rounds[rounds.length - 1] ? "200px" : "400px" }}
                        >
                          <h4 className="text-center font-display font-bold text-dota-gold mb-4 md:mb-0">
                            {getRoundName(round, rounds.length)}
                          </h4>
                          {roundMatches.map((match) => (
                            <TiltCard
                              key={match.id}
                              tiltAmount={8}
                              glowColor="gold"
                              className="mx-auto w-full max-w-[220px]"
                            >
                              <div className="bg-dota-surface rounded-lg p-4 border border-dota-gold/20">
                                <div className="flex items-center justify-between text-sm text-dota-text mb-3">
                                  <span className="font-medium truncate max-w-[80px]">
                                    {match.teamA || "TBD"}
                                  </span>
                                  <span className="text-dota-muted">
                                    {match.status === "finished" && match.winner === match.teamA ? "W" : "-"}
                                  </span>
                                </div>
                                <div className="h-px bg-gradient-to-r from-transparent via-dota-gold/30 to-transparent my-2" />
                                <div className="flex items-center justify-between text-sm text-dota-text">
                                  <span className="font-medium truncate max-w-[80px]">
                                    {match.teamB || "TBD"}
                                  </span>
                                  <span className="text-dota-muted">
                                    {match.status === "finished" && match.winner === match.teamB ? "W" : "-"}
                                  </span>
                                </div>
                                {match.scheduledAt && (
                                  <p className="mt-2 text-xs text-dota-muted text-center">
                                    {format(new Date(match.scheduledAt), "d MMM HH:mm", { locale: ru })}
                                  </p>
                                )}
                                {match.status === "live" && (
                                  <div className="mt-2 text-center">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-dota-red/20 text-dota-red text-xs rounded-full animate-pulse">
                                      LIVE
                                    </span>
                                  </div>
                                )}
                              </div>
                            </TiltCard>
                          ))}
                        </div>
                      );
                    })}
                  </div>

                  {/* Connector lines for desktop */}
                  <div className="hidden md:block absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none">
                    <svg className="w-full h-[300px]" viewBox="0 0 800 300" fill="none">
                      <defs>
                        <linearGradient id="bracketGradient" x1="0" y1="0" x2="800" y2="0">
                          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.3" />
                          <stop offset="50%" stopColor="#E53935" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#FFD700" stopOpacity="0.3" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M220 80 H320 V150 H420 M220 220 H320 V150 H420"
                        stroke="url(#bracketGradient)"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="8 4"
                        className="animate-pulse"
                      />
                      <path
                        d="M220 80 H320 V150 H420 M220 220 H320 V150 H420"
                        stroke="url(#bracketGradient)"
                        strokeWidth="4"
                        fill="none"
                        opacity="0.3"
                        filter="blur(4px)"
                      />
                      <path
                        d="M540 150 H640"
                        stroke="url(#bracketGradient)"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="8 4"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </Card>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
}
