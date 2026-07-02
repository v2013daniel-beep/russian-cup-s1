"use client";

import { motion } from "framer-motion";

const runes = ["ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ", "ᚷ", "ᚹ", "ᚺ", "ᚾ", "ᛁ", "ᛃ"];

interface FloatingRunes3DProps {
  count?: number;
  className?: string;
}

export function FloatingRunes3D({ count = 15, className }: FloatingRunes3DProps) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    rune: runes[i % runes.length],
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 16 + Math.random() * 32,
    duration: 15 + Math.random() * 20,
    delay: Math.random() * -20,
    depth: Math.random() * 200 - 100,
    rotateDuration: 8 + Math.random() * 12,
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute text-dota-gold/20 font-bold select-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            fontSize: particle.size,
            textShadow: "0 0 20px rgba(255, 215, 0, 0.3)",
          }}
          initial={{
            y: 0,
            opacity: 0,
            rotateX: 0,
            rotateY: 0,
            z: particle.depth,
          }}
          animate={{
            y: [-30, 30, -30],
            opacity: [0.1, 0.4, 0.1],
            rotateX: [0, 360],
            rotateY: [0, -360],
          }}
          transition={{
            y: {
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
            },
            opacity: {
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
            },
            rotateX: {
              duration: particle.rotateDuration,
              repeat: Infinity,
              ease: "linear",
              delay: particle.delay,
            },
            rotateY: {
              duration: particle.rotateDuration * 1.3,
              repeat: Infinity,
              ease: "linear",
              delay: particle.delay,
            },
          }}
        >
          {particle.rune}
        </motion.div>
      ))}
    </div>
  );
}
