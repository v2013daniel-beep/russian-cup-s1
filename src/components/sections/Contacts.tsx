"use client";

import { motion } from "framer-motion";
import { MessageCircle, Send, Mail, Clock } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";

interface ContactsProps {
  discord: string;
  telegram: string;
  email: string;
  responseTime: string;
}

export function Contacts({ discord, telegram, email, responseTime }: ContactsProps) {
  const contacts = [
    {
      icon: MessageCircle,
      title: "Discord",
      value: "Присоединиться к серверу",
      href: discord,
      color: "text-indigo-400",
      bgColor: "bg-indigo-400/10",
      borderColor: "border-indigo-400/30",
    },
    {
      icon: Send,
      title: "Telegram",
      value: "Написать в чат",
      href: telegram,
      color: "text-sky-400",
      bgColor: "bg-sky-400/10",
      borderColor: "border-sky-400/30",
    },
    {
      icon: Mail,
      title: "Email",
      value: email,
      href: `mailto:${email}`,
      color: "text-dota-red",
      bgColor: "bg-dota-red/10",
      borderColor: "border-dota-red/30",
    },
  ];

  return (
    <section id="contacts" className="py-28 relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat dota-image opacity-15"
        style={{ backgroundImage: "url('/images/dark-smoke.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-dota-black via-dota-void/95 to-dota-black" />
      <div className="vignette" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Связь с администрацией"
          subtitle="Есть вопросы? Свяжитесь с нами удобным способом"
          accent="gold"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contacts.map((contact, index) => (
            <motion.a
              key={contact.title}
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={`h-full text-center py-8 hover:-translate-y-2 transition-transform border ${contact.borderColor}`}
              >
                <div
                  className={`w-16 h-16 ${contact.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 border border-current/20`}
                >
                  <contact.icon className={`w-8 h-8 ${contact.color}`} />
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-2">
                  {contact.title}
                </h3>
                <p className="text-dota-muted">{contact.value}</p>
              </Card>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex items-center justify-center gap-3 text-dota-muted bg-dota-surface/50 w-fit mx-auto px-6 py-3 rounded-full border border-dota-gold/20"
        >
          <Clock className="w-5 h-5 text-dota-gold" />
          <span>Администрация отвечает {responseTime}</span>
        </motion.div>
      </div>
    </section>
  );
}
