"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useSiteData } from "@/hooks/useSiteData";
import { type Player } from "@/lib/data";

interface RegistrationProps {
  entryFee: number;
  registrationOpen: boolean;
}

const initialPlayer: Player = {
  nickname: "",
  mmr: "",
  dotabuff: "",
  steam: "",
};

export function Registration({ entryFee, registrationOpen }: RegistrationProps) {
  const { addRegistration } = useSiteData();
  const [players, setPlayers] = useState<Player[]>(
    Array.from({ length: 5 }, () => ({ ...initialPlayer }))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const result = await addRegistration({
        teamName: formData.get("teamName") as string,
        teamTag: formData.get("teamTag") as string,
        playerCount: parseInt(formData.get("playerCount") as string) || 5,
        substitute: (formData.get("substitute") as string) || undefined,
        captainName: formData.get("captainName") as string,
        captainNickname: formData.get("captainNickname") as string,
        captainTelegram: formData.get("captainTelegram") as string,
        captainDiscord: formData.get("captainDiscord") as string,
        captainEmail: formData.get("captainEmail") as string,
        players,
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

    setPaymentMethod("card");

    try {
      const { createRobokassaPayment } = await import("@/server/actions/payment");
      const { url } = await createRobokassaPayment(registrationId);
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка создания платежа");
      setPaymentMethod(null);
    }
  };

  const updatePlayer = (index: number, field: keyof Player, value: string) => {
    setPlayers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
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
            <p className="text-dota-muted text-lg mb-8">
              Теперь оплатите участие команды, чтобы подтвердить регистрацию.
              <br />
              <span className="text-dota-gold font-bold">
                Взнос за команду: {entryFee.toLocaleString("ru-RU")} ₽
              </span>
            </p>

            <div className="max-w-md mx-auto">
              <Button
                variant="gold"
                fullWidth
                size="lg"
                disabled={paymentMethod === "card"}
                onClick={handlePayment}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                {paymentMethod === "card"
                  ? "Переход к оплате..."
                  : `Оплатить картой — ${entryFee.toLocaleString("ru-RU")} ₽`}
              </Button>
              <p className="mt-4 text-sm text-dota-muted">
                Оплата банковской картой через защищённый платёжный сервис.
                После успешной оплаты регистрация команды подтверждается автоматически.
              </p>
            </div>

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

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Регистрация на турнир"
          subtitle="Заполните форму ниже, чтобы зарегистрировать команду на RUSSIAN CUP SEASON 1"
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
              <h3 className="text-xl font-display font-bold text-dota-gold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded bg-dota-gold/10 flex items-center justify-center text-sm border border-dota-gold/30">
                  1
                </span>
                Информация о команде
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Название команды *"
                  name="teamName"
                  required
                  placeholder="Natus Vincere"
                />
                <Input
                  label="Тег команды *"
                  name="teamTag"
                  required
                  placeholder="NAVI"
                />
                <Input
                  label="Количество игроков *"
                  name="playerCount"
                  type="number"
                  defaultValue={5}
                  min={1}
                  max={6}
                  required
                />
                <Input
                  label="Запасной игрок (optional)"
                  name="substitute"
                  placeholder="Nickname запасного"
                />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-display font-bold text-dota-gold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded bg-dota-gold/10 flex items-center justify-center text-sm border border-dota-gold/30">
                  2
                </span>
                Информация о капитане
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Имя *"
                  name="captainName"
                  required
                  placeholder="Иван Иванов"
                />
                <Input
                  label="Nickname *"
                  name="captainNickname"
                  required
                  placeholder="CaptainNick"
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
                  placeholder="captain@example.com"
                  className="md:col-span-2"
                />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-display font-bold text-dota-gold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded bg-dota-gold/10 flex items-center justify-center text-sm border border-dota-gold/30">
                  3
                </span>
                Состав команды (5 игроков)
              </h3>
              <div className="space-y-4">
                {players.map((player, index) => (
                  <Card key={index} className="p-4 border-dota-gold/10">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-6 h-6 rounded-full bg-dota-red/20 text-dota-red text-xs flex items-center justify-center font-bold border border-dota-red/30">
                        {index + 1}
                      </span>
                      <span className="text-sm text-dota-muted font-medium">
                        Игрок {index + 1}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <Input
                        placeholder="Никнейм *"
                        value={player.nickname}
                        onChange={(e) =>
                          updatePlayer(index, "nickname", e.target.value)
                        }
                        required
                      />
                      <Input
                        placeholder="MMR *"
                        value={player.mmr}
                        onChange={(e) =>
                          updatePlayer(index, "mmr", e.target.value)
                        }
                        required
                      />
                      <Input
                        placeholder="Dotabuff ссылка"
                        value={player.dotabuff}
                        onChange={(e) =>
                          updatePlayer(index, "dotabuff", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Steam ссылка"
                        value={player.steam}
                        onChange={(e) =>
                          updatePlayer(index, "steam", e.target.value)
                        }
                      />
                    </div>
                  </Card>
                ))}
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
                  Нажимая кнопку «Зарегистрировать команду», я принимаю условия{" "}
                  <a href="/oferta" target="_blank" className="text-dota-gold hover:underline">
                    Публичной оферты
                  </a>{" "}
                  и даю согласие на обработку персональных данных в соответствии с{" "}
                  <a href="/privacy" target="_blank" className="text-dota-gold hover:underline">
                    Политикой конфиденциальности
                  </a>
                  .
                </span>
              </label>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-dota-muted text-sm">Стоимость участия</p>
                  <p className="text-2xl font-display font-bold text-dota-gold">
                    {entryFee.toLocaleString("ru-RU")} ₽
                  </p>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full md:w-auto"
                >
                  {loading ? "Отправка..." : "Зарегистрировать команду"}
                </Button>
              </div>
            </div>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
