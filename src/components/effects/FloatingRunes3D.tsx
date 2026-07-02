"use client";

import { motion } from "framer-motion";
import { seededRandom, randomFromSeed } from "@/lib/random";

const runes = ["ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ", "ᚷ", "ᚹ", "ᚺ", "ᚾ", "ᛁ", "ᛃ"];

interface FloatingRunes3DProps {
  count?: number;
  className?: string;
}

export function FloatingRunes3D({ count = 15, className }: FloatingRunes3DProps) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    rune: runes[i % runes.length],
    x: randomFromSeed(i * 7, 0, 100),
    y: randomFromSeed(i * 13 + 1, 0, 100),
    size: randomFromSeed(i * 19 + 2, 16, 48),
    duration: randomFromSeed(i * 23 + 3, 15, 35),
    delay: -randomFromSeed(i * 29 + 4, 0, 20),
    depth: randomFromSeed(i * 31 + 5, -100, 100),
    rotateDuration: randomFromSeed(i * 37 + 6, 8, 20),
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
