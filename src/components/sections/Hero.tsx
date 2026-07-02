"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Trophy, Users, Globe } from "lucide-react";
import { randomFromSeed } from "@/lib/random";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TiltCard } from "@/components/effects/TiltCard";
import { FloatingRunes3D } from "@/components/effects/FloatingRunes3D";
import { AegisEmblem3D } from "@/components/effects/AegisEmblem3D";
import { Text3D } from "@/components/effects/Text3D";

interface HeroProps {
  tournamentDate: Date;
  prizePool: string;
  format: string;
  server: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const difference = new Date(targetDate).getTime() - new Date().getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <TiltCard tiltAmount={15} glareEnabled={false} glowColor="gold">
      <div className="flex flex-col items-center">
        <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-dota-surface/80 border border-dota-gold/40 rounded-lg flex items-center justify-center shadow-glow-gold-sm backdrop-blur-sm">
          <span className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white">
            {String(value).padStart(2, "0")}
          </span>
          <div className="absolute inset-0 bg-gradient-to-b from-dota-gold/10 to-transparent rounded-lg pointer-events-none" />
          <div className="absolute -inset-0.5 bg-gradient-to-b from-dota-gold/20 to-dota-red/20 rounded-lg blur-sm -z-10" />
        </div>
        <span className="mt-2 text-xs md:text-sm text-dota-muted uppercase tracking-wider">
          {label}
        </span>
      </div>
    </TiltCard>
  );
}

function ParticlesBackground() {
  return (
    <div className="particles">
      {[...Array(40)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${randomFromSeed(i * 41, 0, 100)}%`,
            animationDelay: `${randomFromSeed(i * 43, 0, 8)}s`,
            animationDuration: `${randomFromSeed(i * 47, 6, 12)}s`,
            width: `${randomFromSeed(i * 53, 1, 3)}px`,
            height: `${randomFromSeed(i * 59, 1, 3)}px`,
          }}
        />
      ))}
    </div>
  );
}

export function Hero({ tournamentDate, prizePool, format, server }: HeroProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setTimeLeft(calculateTimeLeft(tournamentDate));
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(tournamentDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [tournamentDate]);

  const formattedDate = new Date(tournamentDate).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const scrollToRegister = () => {
    const element = document.querySelector("#register");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const statCards = [
    { icon: Calendar, label: "Дата", value: formattedDate, glow: "red" as const },
    { icon: Trophy, label: "Призовой фонд", value: prizePool, glow: "gold" as const },
    { icon: Users, label: "Формат", value: format, glow: "red" as const },
    { icon: Globe, label: "Сервер", value: server, glow: "gold" as const },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat dota-image"
        style={{ backgroundImage: "url('/images/fire-arena.jpg')" }}
      />
      <div className="hero-image-overlay" />
      <div className="vignette" />
      
      {/* Animated rune circle */}
      <motion.div
        className="absolute right-[-10%] top-[10%] w-[500px] h-[500px] md:w-[700px] md:h-[700px] opacity-30 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      >
        <img src="/svgs/rune-circle.svg" alt="" className="w-full h-full" />
      </motion.div>
      
      <motion.div
        className="absolute left-[-15%] bottom-[5%] w-[400px] h-[400px] md:w-[600px] md:h-[600px] opacity-20 pointer-events-none"
        animate={{ rotate: -360 }}
        transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
      >
        <img src="/svgs/rune-circle.svg" alt="" className="w-full h-full" />
      </motion.div>

      {/* 3D Floating Runes */}
      <FloatingRunes3D count={20} className="z-[1]" />

      {/* Hero silhouette */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] md:w-[500px] lg:w-[600px] opacity-40 pointer-events-none"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 0.4, y: 0 }}
        transition={{ duration: 1.5 }}
        style={{ animation: "float 8s ease-in-out infinite" }}
      >
        <img src="/svgs/hero-silhouette.svg" alt="" className="w-full" style={{ animation: "pulse-glow 4s ease-in-out infinite" }} />
      </motion.div>

      <ParticlesBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dota-red/15 border border-dota-red/40 mb-6 backdrop-blur-sm"
          >
            <span className="w-2 h-2 bg-dota-red rounded-full animate-pulse" />
            <span className="text-sm text-dota-red font-medium uppercase tracking-wider">
              Регистрация открыта
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-6 flex justify-center"
          >
            <AegisEmblem3D size={120} className="md:w-40 md:h-40" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-bold mb-4 tracking-tight text-glow"
          >
            <Text3D as="span" color="white" depth={5}>
              RUSSIAN
            </Text3D>
            <span className="block gradient-text">
              <Text3D as="span" color="gold" depth={5}>
                CUP SEASON 1
              </Text3D>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl lg:text-2xl text-dota-muted max-w-3xl mx-auto mb-10"
          >
            Главный турнир сезона по Dota 2. Собери команду и докажи своё
            превосходство.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button size="lg" onClick={scrollToRegister}>
              Участвовать
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                const el = document.querySelector("#teams");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Смотреть команды
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-16"
          >
            <p className="text-dota-gold text-sm uppercase tracking-[0.3em] mb-4">
              До старта турнира
            </p>
            <div className="flex items-center justify-center gap-3 md:gap-4">
              <CountdownUnit value={timeLeft.days} label="Дней" />
              <span className="text-2xl md:text-3xl text-dota-gold font-display">:</span>
              <CountdownUnit value={timeLeft.hours} label="Часов" />
              <span className="text-2xl md:text-3xl text-dota-gold font-display">:</span>
              <CountdownUnit value={timeLeft.minutes} label="Минут" />
              <span className="text-2xl md:text-3xl text-dota-gold font-display">:</span>
              <CountdownUnit value={timeLeft.seconds} label="Секунд" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {statCards.map((stat) => (
              <TiltCard key={stat.label} tiltAmount={12} glowColor={stat.glow}>
                <Card className="text-center py-5 border-glow" glow={stat.glow}>
                  <stat.icon className={`w-6 h-6 text-dota-${stat.glow === "red" ? "red" : "gold"} mx-auto mb-2`} />
                  <p className="text-xs text-dota-muted uppercase">{stat.label}</p>
                  <p className="font-display font-bold text-white">{stat.value}</p>
                </Card>
              </TiltCard>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
