"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useSiteData } from "@/hooks/useSiteData";

interface RegistrationProps {
  entryFee: number;
  registrationOpen: boolean;
}

export function Registration({ entryFee, registrationOpen }: RegistrationProps) {
  const paymentsEnabled = process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === "true";
  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "russiancupseasonbot";
  const { addRegistration } = useSiteData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const nickname = formData.get("captainNickname") as string;

    try {
      const result = await addRegistration({
        teamName: `Игрок ${nickname}`,
        teamTag: "SOLO",
        playerCount: 1,
        captainName: formData.get("captainName") as string,
        captainNickname: nickname,
        captainTelegram: formData.get("captainTelegram") as string,
        captainDiscord: formData.get("captainDiscord") as string,
        captainEmail: formData.get("captainEmail") as string,
        players: [
          {
            nickname,
            mmr: formData.get("mmr") as string,
            dotabuff: (formData.get("dotabuff") as string) || "",
            steam: (formData.get("steam") as string) || "",
          },
        ],
      });

      setRegistrationId(result.id);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!registrationId) return;

    setPaymentMethod("telegram");

    try {
      const { createTelegramPayment } = await import("@/server/actions/payment");
      const { url } = await createTelegramPayment(registrationId);
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка создания платежа");
      setPaymentMethod(null);
    }
  };

  const handleCheckStatus = async () => {
    if (!registrationId) return;

    setStatusMessage("Проверяем...");

    try {
      const { getPaymentStatus } = await import("@/server/actions/payment");
      const { status } = await getPaymentStatus(registrationId);

      if (status === "success") {
        setStatusMessage("Оплата подтверждена! Регистрация на турнир завершена.");
      } else if (status === "pending") {
        setStatusMessage("Оплата пока не подтверждена. Если вы уже оплатили и отправили чек боту, дождитесь проверки администратором.");
      } else {
        setStatusMessage("Платёк ещё не создан. Нажмите «Оплатить».");
      }
    } catch {
      setStatusMessage("Не удалось проверить статус, попробуйте позже.");
    }
  };

  if (success && registrationId) {
    return (
      <section id="register" className="py-28 bg-dota-black relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "url('/svgs/dota-pattern.svg')" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(229,57,53,0.08)_0%,transparent_60%)]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel rounded-2xl p-8 md:p-12 text-center border-dota-gold/30"
          >
            <div className="w-20 h-20 bg-dota-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-dota-gold/30">
              <span className="text-4xl">🎉</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Заявка принята!
            </h3>
            {paymentsEnabled ? (
              <>
                <p className="text-dota-muted text-lg mb-8">
                  Теперь оплатите участие, чтобы подтвердить регистрацию.
                  <br />
                  <span className="text-dota-gold font-bold">
                    Регистрационный взнос: {entryFee.toLocaleString("ru-RU")} ₽
                  </span>
                </p>

                <div className="max-w-md mx-auto">
                  <div className="text-left text-sm text-dota-muted mb-6 space-y-1.5">
                    <p className="text-white font-medium mb-2">Во взнос входит:</p>
                    <p>— судейское обслуживание матчей;</p>
                    <p>— игровой сервер и формирование сетки;</p>
                    <p>— трансляции ключевых матчей с комментаторами;</p>
                    <p>— информационная поддержка в Discord и Telegram.</p>
                  </div>
                  <Button
                    variant="gold"
                    fullWidth
                    size="lg"
                    disabled={paymentMethod === "telegram"}
                    onClick={handlePayment}
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {paymentMethod === "telegram"
                      ? "Открываем Telegram-бота..."
                      : "Оплатить"}
                  </Button>
                  <p className="mt-4 text-sm text-dota-muted">
                    Оплата через нашего Telegram-бота: он покажет QR-код для перевода
                    из приложения вашего банка. После оплаты отправьте чек боту,
                    администратор подтвердит платёж.
                  </p>
                  <button
                    type="button"
                    onClick={handleCheckStatus}
                    className="mt-3 text-sm text-dota-gold hover:underline"
                  >
                    Проверить статус оплаты
                  </button>
                  {statusMessage && (
                    <p className="mt-2 text-sm text-dota-muted">{statusMessage}</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <p className="text-dota-muted text-lg mb-8">
                  Заявка принята! Подтвердите регистрацию в нашем Telegram-боте:
                  он пришлёт подтверждение и дальнейшие указания.
                </p>
                <div className="max-w-md mx-auto">
                  <Button
                    variant="gold"
                    fullWidth
                    size="lg"
                    onClick={() =>
                      window.open(
                        `https://t.me/${botUsername}?start=reg_${registrationId}`,
                        "_blank"
                      )
                    }
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Подтвердить в Telegram-боте
                  </Button>
                  <p className="mt-4 text-sm text-dota-muted">
                    Администратор также получит уведомление о вашей заявке
                    и свяжется с вами при необходимости.
                  </p>
                </div>
              </>
            )}

            {error && <p className="mt-4 text-dota-red">{error}</p>}
          </motion.div>
        </div>
      </section>
    );
  }

  if (!registrationOpen) {
    return (
      <section id="register" className="py-28 bg-dota-black relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle title="Регистрация на турнир" accent="red" />
          <Card className="py-12">
            <p className="text-2xl text-dota-muted">
              Регистрация временно закрыта
            </p>
            <p className="text-dota-gold mt-2">
              Следите за обновлениями в наших социальных сетях
            </p>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="register" className="py-28 bg-dota-black relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "url('/svgs/dota-pattern.svg')" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(229,57,53,0.08)_0%,transparent_60%)]" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Регистрация на турнир"
          subtitle="Заполните форму ниже, чтобы зарегистрироваться на RUSSIAN CUP SEASON 1"
          accent="red"
        />

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          className="glass-panel rounded-2xl p-6 md:p-10 border-glow"
        >
          {error && (
            <div className="mb-6 p-4 bg-dota-red/10 border border-dota-red/30 rounded-lg text-dota-red">
              {error}
            </div>
          )}

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-display font-bold text-dota-gold mb-4">
                Информация об игроке
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Имя и фамилия *"
                  name="captainName"
                  required
                  placeholder="Иван Иванов"
                />
                <Input
                  label="Никнейм в Dota 2 *"
                  name="captainNickname"
                  required
                  placeholder="YourNickname"
                />
                <Input
                  label="MMR *"
                  name="mmr"
                  required
                  placeholder="Например, 4500"
                />
                <Input
                  label="Telegram *"
                  name="captainTelegram"
                  required
                  placeholder="@username"
                />
                <Input
                  label="Discord *"
                  name="captainDiscord"
                  required
                  placeholder="username#0000"
                />
                <Input
                  label="Email *"
                  name="captainEmail"
                  type="email"
                  required
                  placeholder="player@example.com"
                />
                <Input
                  label="Ссылка на Dotabuff"
                  name="dotabuff"
                  placeholder="https://www.dotabuff.com/players/..."
                />
                <Input
                  label="Ссылка на Steam"
                  name="steam"
                  placeholder="https://steamcommunity.com/id/..."
                />
              </div>
            </div>

            <div className="pt-6 border-t border-dota-gold/10">
              <label className="flex items-start gap-3 mb-6 cursor-pointer text-sm text-dota-muted">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 w-4 h-4 accent-dota-red flex-shrink-0"
                />
                <span>
                  Нажимая кнопку «Зарегистрироваться», я принимаю условия{" "}
                  <a href="/oferta" target="_blank" className="text-dota-gold hover:underline">
                    Публичной оферты
                  </a>{" "}
                  и{" "}
                  <a href="/regulations" target="_blank" className="text-dota-gold hover:underline">
                    Регламента турнира
                  </a>{" "}
                  и даю согласие на обработку персональных данных в соответствии с{" "}
                  <a href="/privacy" target="_blank" className="text-dota-gold hover:underline">
                    Политикой конфиденциальности
                  </a>
                  .
                </span>
              </label>
              <div className={`flex flex-col md:flex-row items-center gap-4 ${paymentsEnabled ? "justify-between" : "md:justify-end"}`}>
                {paymentsEnabled && (
                  <div>
                    <p className="text-dota-muted text-sm">Стоимость участия</p>
                    <p className="text-2xl font-display font-bold text-dota-gold">
                      {entryFee.toLocaleString("ru-RU")} ₽
                    </p>
                  </div>
                )}
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full md:w-auto"
                >
                  {loading ? "Отправка..." : "Зарегистрироваться"}
                </Button>
              </div>
            </div>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
