"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionTemplate } from "framer-motion";

export function MouseGlow3D() {
  const [isMounted, setIsMounted] = useState(false);
  const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 50, damping: 20 });

  const background = useMotionTemplate`
    radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(229,57,53,0.08), transparent 40%)
  `;

  useEffect(() => {
    setIsMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!isMounted) return null;

  return (
    <>
      <motion.div
        className="fixed inset-0 pointer-events-none z-30"
        style={{ background }}
      />
      <motion.div
        className="fixed w-64 h-64 rounded-full pointer-events-none z-20"
        style={{
          left: mouseX,
          top: mouseY,
          x: "-50%",
          y: "-50%",
          background: "radial-gradient(circle, rgba(255,215,0,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
    </>
  );
}
