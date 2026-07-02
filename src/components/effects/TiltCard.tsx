"use client";

import { ReactNode, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltAmount?: number;
  glareEnabled?: boolean;
  glowColor?: "red" | "gold" | "blue" | "purple" | "none";
}

export function TiltCard({
  children,
  className,
  tiltAmount = 12,
  glareEnabled = true,
  glowColor = "none",
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateXValue = (mouseY / (rect.height / 2)) * -tiltAmount;
    const rotateYValue = (mouseX / (rect.width / 2)) * tiltAmount;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);

    const glareX = ((e.clientX - rect.left) / rect.width) * 100;
    const glareY = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePosition({ x: 50, y: 50 });
    setIsHovered(false);
  };

  const glowColors = {
    red: "shadow-[0_0_30px_rgba(229,57,53,0.35)]",
    gold: "shadow-[0_0_30px_rgba(255,215,0,0.25)]",
    blue: "shadow-[0_0_30px_rgba(96,165,250,0.25)]",
    purple: "shadow-[0_0_30px_rgba(168,85,247,0.25)]",
    none: "",
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative transform-gpu",
        isHovered && glowColors[glowColor],
        className
      )}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
      animate={{
        rotateX,
        rotateY,
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {children}

        {glareEnabled && (
          <div
            className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
              opacity: isHovered ? 1 : 0,
              transform: "translateZ(1px)",
            }}
          />
        )}
      </div>
    </motion.div>
  );
}
