"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";

const faqs = [
  {
    question: "Как принять участие в турнире?",
    answer:
      "Заполните форму регистрации на сайте, указав данные команды и капитана. После этого оплатите регистрационный взнос через нашего Telegram-бота по QR-коду из приложения вашего банка.",
  },
  {
    question: "Сколько стоит участие?",
    answer:
      "Стоимость участия указана в форме регистрации и может изменяться администрацией. Стандартный регистрационный взнос за команду — 5000 ₽.",
  },
  {
    question: "Что входит в регистрационный взнос?",
    answer:
      "Взнос является оплатой услуг организатора: формирование турнирной сетки и расписания, судейское обслуживание матчей, игровой сервер, трансляции ключевых матчей с комментаторами, информационная поддержка в Discord и Telegram. Призовой фонд турнира фиксированный и формируется организатором из собственных средств — он не зависит от количества участников.",
  },
  {
    question: "Какой формат турнира?",
    answer:
      "Турнир проходит в классическом формате 5x5 на серверах EU / RU. Подробная сетка и расписание публикуются после закрытия регистрации.",
  },
  {
    question: "Можно ли заменить игрока после регистрации?",
    answer:
      "Да, при необходимости замену нужно согласовать с администрацией через Discord или Telegram не позднее чем за 24 часа до начала матча.",
  },
  {
    question: "Как проходит оплата и подтверждение участия?",
    answer:
      "После заполнения формы нажмите «Оплатить»: откроется наш Telegram-бот, он покажет QR-код с реквизитами и точной суммой. Переведите деньги в приложении вашего банка и пришлите боту скриншот чека. Администратор проверит поступление (обычно в течение часа с 10:00 до 22:00 МСК) и бот пришлёт подтверждение регистрации команды.",
  },
  {
    question: "Можно ли вернуть деньги за участие?",
    answer:
      "Да. Возврат регистрационного взноса возможен по заявлению на почту russiancup@mail.ru не позднее чем за 48 часов до начала турнира. При отмене турнира организатором средства возвращаются в полном объёме в течение 14 рабочих дней. Подробности — в разделе 6 Публичной оферты.",
  },
  {
    question: "Будет ли трансляция турнира?",
    answer:
      "Да, ключевые матчи будут транслироваться на Twitch с комментаторами. Ссылка на трансляцию появится на сайте в день турнира.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-dota-black relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title="Частые вопросы" accent="gold" />

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="glass-panel rounded-xl overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-display font-bold text-white pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-dota-gold flex-shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 text-dota-muted leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
