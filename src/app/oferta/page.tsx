import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Публичная оферта | RUSSIAN CUP SEASON 1",
  description: "Публичная оферта о порядке участия в турнире RUSSIAN CUP SEASON 1 по Dota 2.",
};

export default function OfertaPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-dota-black pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-8">
            Публичная оферта
          </h1>

          <Card className="p-6 md:p-10 space-y-6 text-dota-muted leading-relaxed">
            <section>
              <h2 className="text-xl font-display font-bold text-dota-gold mb-3">1. Общие положения</h2>
              <p>
                Настоящая публичная оферта (далее — «Оферта») является официальным предложением
                ИП Софронова Ивана Дмитриевича (ИНН: 130302322800, ОГРНИП: 325508100700869),
                далее — «Организатор», заключить договор на участие в турнире
                «RUSSIAN CUP SEASON 1» по игре Dota 2 (далее — «Турнир») на условиях,
                изложенных ниже.
              </p>
              <p className="mt-3">
                Регистрация команды на сайте и/или оплата участия означает полное и безоговорочное
                принятие условий настоящей Оферты.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-dota-gold mb-3">2. Предмет договора</h2>
              <p>
                Организатор обязуется провести Турнир, а Участник обязуется соблюдать правила
                Турнира и уплатить вступительный взнос в размере, указанном на сайте.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-dota-gold mb-3">3. Порядок регистрации и оплаты</h2>
              <p>
                Регистрация команды осуществляется через форму на сайте. После успешной регистрации
                Участник получает возможность оплатить вступительный взнос способами, указанными
                на сайте.
              </p>
              <p className="mt-3">
                Регистрация считается подтверждённой только после поступления оплаты.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-dota-gold mb-3">4. Правила участия</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Команда состоит из 5 основных игроков и может включать запасного игрока.</li>
                <li>Участники обязаны соблюдать спортивное поведение и правила честной игры.</li>
                <li>Использование читов, багов и стороннего ПО запрещено и ведёт к дисквалификации.</li>
                <li>Организатор оставляет за собой право дисквалифицировать команду за нарушение правил.</li>
                <li>Решения судей и администрации Турнира являются окончательными.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-dota-gold mb-3">5. Призовой фонд</h2>
              <p>
                Призовой фонд Турнира указывается на сайте и распределяется между победителями
                в соответствии с занятыми местами. Выплата призовых осуществляется в течение
                14 (четырнадцати) рабочих дней после завершения Турнира и предоставления
                победителями необходимых реквизитов.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-dota-gold mb-3">6. Возврат средств</h2>
              <p>
                Вступительный взнос возврату не подлежит, за исключением случаев отмены Турнира
                по инициативе Организатора. В случае отмены Турнира Организатор возвращает
                уплаченные средства в течение 14 (четырнадцати) рабочих дней.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-dota-gold mb-3">7. Ответственность сторон</h2>
              <p>
                Организатор не несёт ответственности за технические сбои на стороне Участника,
                проблемы с интернет-соединением, а также за действия третьих лиц.
              </p>
              <p className="mt-3">
                Участник несёт ответственность за достоверность предоставленных данных.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-dota-gold mb-3">8. Персональные данные</h2>
              <p>
                Регистрируясь на Турнир, Участник даёт согласие на обработку своих персональных
                данных в целях организации и проведения Турнира, а также для связи с Участником.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-dota-gold mb-3">9. Заключительные положения</h2>
              <p>
                Организатор вправе вносить изменения в настоящую Оферту. Актуальная версия
                всегда доступна на сайте.
              </p>
              <p className="mt-3">
                Все споры разрешаются путём переговоров, а при недостижении согласия —
                в соответствии с законодательством Российской Федерации.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-dota-gold mb-3">10. Реквизиты Организатора</h2>
              <p>
                ИП Софронов Иван Дмитриевич<br />
                ИНН: 130302322800<br />
                ОГРНИП: 325508100700869
              </p>
            </section>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
