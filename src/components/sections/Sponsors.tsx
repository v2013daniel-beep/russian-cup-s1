"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Handshake, TrendingUp, Users, Trophy, Mail } from "lucide-react";

export function Sponsors() {
  return (
    <section className="py-24 bg-dota-void relative border-y border-dota-gold/10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.05)_0%,transparent_60%)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Партнёры и инвесторы"
          subtitle="Станьте частью главного Dota 2 события сезона"
          accent="red"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 border-glow">
              <div className="w-14 h-14 bg-dota-gold/10 rounded-xl flex items-center justify-center mb-6 border border-dota-gold/30">
                <Handshake className="w-7 h-7 text-dota-gold" />
              </div>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
                Открыты к сотрудничеству
              </h3>
              <p className="text-dota-muted leading-relaxed mb-6">
                RUSSIAN CUP SEASON 1 — это возможность вывести ваш бренд на аудиторию
                увлечённых киберспортом игроков, стримеров и инфлюенсеров. Мы ищем
                надёжных партнёров и инвесторов, которые разделяют нашу страсть к
                Dota 2 и хотят быть частью чего-то по-настоящему большого.
              </p>
              <p className="text-dota-gold font-display font-bold text-xl mb-6">
                Вместе мы создадим турнир, который запомнят надолго.
              </p>
              <a href="#contacts">
                <Button size="lg">
                  <Mail className="w-4 h-4 mr-2" />
                  Связаться с нами
                </Button>
              </a>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <BenefitCard
              icon={Users}
              title="Прямой доступ к аудитории"
              description="Покажите свой бренд тысячам игроков Dota 2, зрителей трансляций и подписчиков турнирных сообществ."
            />
            <BenefitCard
              icon={TrendingUp}
              title="Рост узнаваемости"
              description="Логотип и упоминания бренда на сайте, в социальных сетях, стримах и внутриигровых материалах турнира."
            />
            <BenefitCard
              icon={Trophy}
              title="Эксклюзивные пакеты спонсорства"
              description="Title-партнёр, золотой, серебряный и медиа-пакеты — гибкие условия под ваши задачи и бюджет."
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function BenefitCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Card className="p-6 hover:border-dota-gold/30 transition-colors">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-dota-gold/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-dota-gold/30">
          <Icon className="w-6 h-6 text-dota-gold" />
        </div>
        <div>
          <h4 className="text-lg font-display font-bold text-white mb-1">{title}</h4>
          <p className="text-dota-muted text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </Card>
  );
}
