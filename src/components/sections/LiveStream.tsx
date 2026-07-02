"use client";

import { motion } from "framer-motion";
import { Tv, Radio } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";

export function LiveStream() {
  return (
    <section className="py-28 relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat dota-image opacity-15"
        style={{ backgroundImage: "url('/images/neon-gaming.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-dota-black via-dota-void/95 to-dota-black" />
      <div className="vignette" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Live трансляция"
          subtitle="Смотри лучшие матчи турнира в прямом эфире"
          accent="red"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-2 md:p-4 border-glow">
            <div className="relative aspect-video bg-dota-black rounded-lg overflow-hidden flex items-center justify-center border border-dota-gold/10">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{ backgroundImage: "url('/images/neon-gaming.jpg')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dota-black via-transparent to-dota-black/50" />
              <div className="relative text-center z-10">
                <div className="w-20 h-20 bg-dota-red/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse border border-dota-red/40">
                  <Radio className="w-10 h-10 text-dota-red" />
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 text-glow">
                  Трансляция скоро начнётся
                </h3>
                <p className="text-dota-muted max-w-md mx-auto">
                  В день турнира здесь появится плеер прямой трансляции с
                  профессиональными комментаторами.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-dota-red/10 border border-dota-red/30 rounded-full text-dota-red text-sm">
                  <Tv className="w-4 h-4" />
                  <span>Следите за обновлениями</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
