"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Trophy, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

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
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 6}s`,
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
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
            className="mb-6"
          >
            <img 
              src="/svgs/hero-emblem.svg" 
              alt="RUSSIAN CUP" 
              className="w-20 h-20 md:w-28 md:h-28 mx-auto"
              style={{ filter: "drop-shadow(0 0 20px rgba(229, 57, 53, 0.5))" }}
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-bold mb-4 tracking-tight text-glow"
          >
            <span className="text-white">RUSSIAN</span>
            <span className="block gradient-text">CUP SEASON 1</span>
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
            <Card className="text-center py-5 border-glow" glow="red">
              <Calendar className="w-6 h-6 text-dota-red mx-auto mb-2" />
              <p className="text-xs text-dota-muted uppercase">Дата</p>
              <p className="font-display font-bold text-white">{formattedDate}</p>
            </Card>
            <Card className="text-center py-5 border-glow" glow="gold">
              <Trophy className="w-6 h-6 text-dota-gold mx-auto mb-2" />
              <p className="text-xs text-dota-muted uppercase">Призовой фонд</p>
              <p className="font-display font-bold text-white">{prizePool}</p>
            </Card>
            <Card className="text-center py-5 border-glow" glow="red">
              <Users className="w-6 h-6 text-dota-red mx-auto mb-2" />
              <p className="text-xs text-dota-muted uppercase">Формат</p>
              <p className="font-display font-bold text-white">{format}</p>
            </Card>
            <Card className="text-center py-5 border-glow" glow="gold">
              <Globe className="w-6 h-6 text-dota-gold mx-auto mb-2" />
              <p className="text-xs text-dota-muted uppercase">Сервер</p>
              <p className="font-display font-bold text-white">{server}</p>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
