"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export function MouseGlow3D() {
  const [isMounted, setIsMounted] = useState(false);
  const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 50, damping: 20 });

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
        style={{
          background: useMotionTemplate(
            mouseX,
            mouseY,
            "radial-gradient(600px circle at {x}px {y}px, rgba(229,57,53,0.08), transparent 40%)"
          ),
        }}
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

function useMotionTemplate(x: any, y: any, template: string) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const unsubscribeX = x.on("change", (latestX: number) => {
      const latestY = y.get();
      setValue(template.replace("{x}", String(latestX)).replace("{y}", String(latestY)));
    });

    const unsubscribeY = y.on("change", (latestY: number) => {
      const latestX = x.get();
      setValue(template.replace("{x}", String(latestX)).replace("{y}", String(latestY)));
    });

    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [x, y, template]);

  return value;
}
