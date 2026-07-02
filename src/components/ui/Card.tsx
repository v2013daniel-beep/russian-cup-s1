"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: "red" | "gold" | "none";
}

export function Card({ children, className, glow = "none" }: CardProps) {
  return (
    <div
      className={cn(
        "glass-panel rounded-xl p-6 transition-all duration-300 hover:border-dota-gold/30",
        glow === "red" && "hover:shadow-glow-red-sm",
        glow === "gold" && "hover:shadow-glow-gold-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
