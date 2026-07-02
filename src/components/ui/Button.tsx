"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "gold";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  ...props
}: ButtonProps) {
  const baseStyles =
    "relative inline-flex items-center justify-center font-display uppercase tracking-wider transition-all duration-300 overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-dota-red text-white border border-dota-red hover:bg-dota-red-bright hover:shadow-glow-red hover:-translate-y-0.5",
    secondary:
      "bg-dota-panel text-dota-text border border-dota-muted/30 hover:border-dota-red hover:text-dota-red hover:-translate-y-0.5",
    outline:
      "bg-transparent text-dota-gold border border-dota-gold hover:bg-dota-gold/10 hover:shadow-glow-gold hover:-translate-y-0.5",
    gold:
      "bg-gradient-to-r from-dota-gold via-dota-gold-dim to-dota-gold text-dota-black font-bold border border-dota-gold hover:shadow-glow-gold hover:-translate-y-0.5",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      <span className="absolute inset-0 btn-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
