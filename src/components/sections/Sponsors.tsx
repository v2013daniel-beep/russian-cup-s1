"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";

const sponsors = [
  { name: "WINLINE", tier: "title" },
  { name: "HyperPC", tier: "gold" },
  { name: "Logitech G", tier: "gold" },
  { name: "Red Bull", tier: "silver" },
  { name: "Twitch", tier: "silver" },
  { name: "VK Play", tier: "silver" },
];

export function Sponsors() {
  return (
    <section className="py-20 bg-dota-void relative border-y border-dota-gold/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Партнёры турнира"
          subtitle="При поддержке лучших брендов киберспорта"
          accent="red"
        />

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {sponsors.map((sponsor, index) => (
            <motion.div
              key={sponsor.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={`px-8 py-4 rounded-xl border border-dota-gold/20 bg-dota-surface/50 hover:border-dota-gold/50 transition-all ${
                sponsor.tier === "title"
                  ? "text-2xl md:text-3xl"
                  : sponsor.tier === "gold"
                  ? "text-xl md:text-2xl"
                  : "text-lg md:text-xl"
              }`}
            >
              <span
                className={`font-display font-bold tracking-wider ${
                  sponsor.tier === "title"
                    ? "gradient-text"
                    : "text-dota-muted"
                }`}
              >
                {sponsor.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
