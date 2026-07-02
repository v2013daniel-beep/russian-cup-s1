"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";

export function Bracket() {
  return (
    <section className="py-24 bg-dota-black relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <Card className="p-8 md:p-12">
            <div className="text-center">
              <p className="text-dota-muted text-lg mb-4">
                Сетка турнира будет сформирована после закрытия регистрации.
              </p>
              <p className="text-dota-gold font-display font-bold text-xl">
                Ожидаем участников...
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-50">
              {[1, 2, 3].map((round) => (
                <div key={round} className="space-y-4">
                  <h4 className="text-center font-display font-bold text-dota-muted mb-4">
                    Раунд {round}
                  </h4>
                  {[1, 2].map((match) => (
                    <div
                      key={match}
                      className="bg-dota-surface rounded-lg p-4 border border-dota-gold/10"
                    >
                      <div className="flex items-center justify-between text-sm text-dota-muted mb-2">
                        <span>TBD</span>
                        <span>-</span>
                      </div>
                      <div className="h-px bg-dota-gold/10 my-2" />
                      <div className="flex items-center justify-between text-sm text-dota-muted">
                        <span>TBD</span>
                        <span>-</span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
