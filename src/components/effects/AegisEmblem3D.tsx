"use client";

import { motion } from "framer-motion";

interface AegisEmblem3DProps {
  size?: number;
  className?: string;
}

export function AegisEmblem3D({ size = 160, className }: AegisEmblem3DProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        width: size,
        height: size,
        perspective: 800,
      }}
      animate={{
        rotateY: [0, 360],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateX: [0, 15, 0, -15, 0],
          rotateY: [0, 10, 0, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border-2 border-dota-gold/40"
          style={{
            background: "radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)",
            boxShadow: "0 0 40px rgba(255,215,0,0.3), inset 0 0 40px rgba(229,57,53,0.1)",
            transform: "translateZ(20px)",
          }}
        />

        {/* Inner ring */}
        <div
          className="absolute inset-4 rounded-full border border-dota-red/50"
          style={{
            transform: "translateZ(40px)",
            boxShadow: "0 0 25px rgba(229,57,53,0.3)",
          }}
        />

        {/* Center shield/aegis shape */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: "translateZ(60px)" }}
        >
          <svg
            width={size * 0.5}
            height={size * 0.55}
            viewBox="0 0 80 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M40 5L70 20V45C70 65 40 85 40 85C40 85 10 65 10 45V20L40 5Z"
              fill="url(#aegisGradient)"
              stroke="#FFD700"
              strokeWidth="2"
            />
            <path
              d="M40 15L60 26V45C60 58 40 72 40 72C40 72 20 58 20 45V26L40 15Z"
              fill="#0A0A0A"
              stroke="#E53935"
              strokeWidth="1.5"
            />
            <circle cx="40" cy="42" r="8" fill="#FFD700" />
            <defs>
              <linearGradient id="aegisGradient" x1="10" y1="5" x2="70" y2="85" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFD700" />
                <stop offset="0.5" stopColor="#D4AF37" />
                <stop offset="1" stopColor="#B8860B" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Floating particles around */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * (size / 2.2);
          const y = Math.sin(rad) * (size / 2.2);
          return (
            <motion.div
              key={angle}
              className="absolute w-2 h-2 rounded-full bg-dota-gold"
              style={{
                left: `calc(50% + ${x}px - 4px)`,
                top: `calc(50% + ${y}px - 4px)`,
                boxShadow: "0 0 10px rgba(255,215,0,0.8)",
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          );
        })}
      </motion.div>
    </motion.div>
  );
}
