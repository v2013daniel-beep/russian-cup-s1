"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Text3DProps {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span" | "p";
  depth?: number;
  color?: "red" | "gold" | "white";
}

export function Text3D({
  children,
  className,
  as: Component = "span",
  depth = 4,
  color = "white",
}: Text3DProps) {
  const colorClasses = {
    red: "text-dota-red",
    gold: "text-dota-gold",
    white: "text-white",
  };

  const shadowColors = {
    red: "rgba(229,57,53,0.5)",
    gold: "rgba(255,215,0,0.5)",
    white: "rgba(255,255,255,0.3)",
  };

  const layers = Array.from({ length: depth }, (_, i) => i + 1);

  return (
    <motion.span
      className={cn("relative inline-block", className)}
      style={{ perspective: 500 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {layers.map((layer) => (
        <Component
          key={layer}
          className={cn(colorClasses[color], "absolute inset-0 select-none")}
          style={{
            transform: `translateZ(${-layer * 2}px)`,
            textShadow: `${layer}px ${layer}px 0 ${shadowColors[color]}`,
            opacity: 1 - layer * 0.15,
          }}
          aria-hidden="true"
        >
          {children}
        </Component>
      ))}
      <Component className={cn(colorClasses[color], "relative z-10")}>
        {children}
      </Component>
    </motion.span>
  );
}
