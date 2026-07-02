"use client";

import { motion } from "framer-motion";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  accent?: "red" | "gold";
}

export function SectionTitle({
  title,
  subtitle,
  centered = true,
  accent = "gold",
}: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={`mb-14 ${centered ? "text-center" : ""}`}
    >
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
        <span className={accent === "gold" ? "gradient-text" : "text-dota-red"}>
          {title}
        </span>
      </h2>
      {subtitle && (
        <p className="text-dota-muted text-lg md:text-xl max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      <div className="mt-6 max-w-lg mx-auto">
        <img 
          src="/svgs/section-divider.svg" 
          alt="" 
          className="w-full h-6 opacity-80"
        />
      </div>
    </motion.div>
  );
}
