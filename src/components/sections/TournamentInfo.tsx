"use client";

import { motion } from "framer-motion";
import { Trophy, Users, Globe, Zap, Target, Crown } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";

interface TournamentInfoProps {
  prizePool: string;
  format: string;
  server: string;
}

export function TournamentInfo({ prizePool, format, server }: TournamentInfoProps) {
  const features = [
    {
      icon: Trophy,
      title: "Премиальный призовой фонд",
      description: `Соревнуйтесь за ${prizePool}. Денежные призы для призёров турнира.`,
      color: "text-dota-gold",
      bgColor: "bg-dota-gold/10",
      borderColor: "border-dota-gold/30",
    },
    {
      icon: Users,
      title: "Командный формат",
      description: `Классический формат ${format}. Собери сильнейший состав и покажи командную игру.`,
      color: "text-dota-red",
      bgColor: "bg-dota-red/10",
      borderColor: "border-dota-red/30",
    },
    {
      icon: Globe,
      title: "Сервер EU / RU",
      description: `Оптимальный пинг для игроков из СНГ и Европы на серверах ${server}.`,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400/30",
    },
    {
      icon: Zap,
      title: "Живые трансляции",
      description: "Лучшие матчи турнира будут транслироваться с профессиональными комментаторами.",
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      borderColor: "border-yellow-400/30",
    },
    {
      icon: Target,
      title: "Честная борьба",
      description: "Строгий контроль MMR, античит и наблюдение администраторов на каждом матче.",
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/30",
    },
    {
      icon: Crown,
      title: "Hall of Fame",
      description: "Победители турнира навсегда войдут в историю RUSSIAN CUP.",
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-400/30",
    },
  ];

  return (
    <section className="py-28 relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat dota-image opacity-20"
        style={{ backgroundImage: "url('/images/arena-lights.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-dota-black via-dota-void/95 to-dota-black" />
      <div className="vignette" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Почему стоит участвовать"
          subtitle="Турнир, созданный игроками для игроков"
          accent="red"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`h-full border ${feature.borderColor}`} glow="gold">
                <div
                  className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4`}
                >
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-display font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-dota-muted text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
