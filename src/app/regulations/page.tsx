import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Регламент турнира | RUSSIAN CUP SEASON 1",
  description:
    "Официальный регламент киберспортивного турнира RUSSIAN CUP SEASON 1 по Dota 2: формат, правила, судейство, расписание.",
};

export default function RegulationsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-dota-black pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-8">
            Регламент турнира
          </h1>

          <Card className="p-6 md:p-10 space-y-6 text-dota-muted leading-relaxed">
            <section>
              <h2 className="text-xl font-display font-bold text-dota-gold mb-3">1. Общие положения</h2>
              <p>
                «RUSSIAN CUP SEASON 1» (далее — «Турнир») — киберспортивное соревнование по игре
                Dota 2, проводимое ИП Бахтиевой Риммой Шаймардановной (ИНН: 024202629803,
                ОГРНИП: 326028000205896), далее — «Организатор».
              </p>
              <p className="mt-3">
                Киберспорт официально признан видом спорта в Российской Федерации, дисциплина
                Dota 2 входит в реестр киберспортивных дисциплин. Турнир является спортивным
                соревнованием: результаты определяются исключительно мастерством участников.
                Турнир не является азартной игрой, лотереей, тотализатором или пари,
                основанным на риске.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-dota-gold mb-3">2. Формат проведения</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Формат матчей: 5x5, режим Captain&apos;s Mode.</li>
                <li>Серверы: EU / RU (указывается в расписании конкретного матча).</li>
                <li>Система проведения и турнирная сетка публикуются на сайте после закрытия регистрации.</li>
                <li>Дата и время каждого матча определяются расписанием Турнира.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-dota-gold mb-3">3. Условия участия</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>К участию допускаются команды из 5 основных игроков; допускается один запасной игрок.</li>
                <li>Возраст участников — от 16 лет. Участникам младше 18 лет требуется согласие законного представителя.</li>
                <li>Регистрация команды подтверждается после оплаты регистрационного взноса.</li>
                <li>Один игрок может быть заявлен только за одну команду.</li>
                <li>Данные аккаунтов (Steam, Dotabuff) должны быть достоверными и соответствовать заявленным игрокам.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-dota-gold mb-3">4. Регистрационный взнос</h2>
              <p>
                Регистрационный взнос является оплатой услуг Организатора по проведению Турнира
                и включает:
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li>формирование турнирной сетки и расписания;</li>
                <li>судейское обслуживание матчей;</li>
                <li>предоставление и настройку игрового сервера;</li>
                <li>организацию трансляций ключевых матчей с комментаторами;</li>
                <li>информационное сопровождение участников (уведомления, поддержка в Discord и Telegram).</li>
              </ul>
              <p className="mt-3">
                Условия возврата регистрационного взноса определены разделом 6{" "}
                <a href="/oferta" className="text-dota-gold hover:underline">
                  Публичной оферты
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-dota-gold mb-3">5. Судейство</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Каждый матч обслуживается судьёй, назначаемым Организатором.</li>
                <li>Судья фиксирует результат матча, контролирует соблюдение правил и разрешает спорные ситуации.</li>
                <li>Решения судей являются окончательными. Апелляция рассматривается главным судьёй в течение 24 часов после матча.</li>
                <li>Контакт главного судьи публикуется в Discord-канале Турнира.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-dota-gold mb-3">6. Правила честной игры</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Запрещено использование читов, скриптов, багов игры и стороннего ПО, дающего преимущество.</li>
                <li>Запрещена передача аккаунта другому лицу и участие под чужой учётной записью.</li>
                <li>Участники обязаны соблюдать спортивное поведение; оскорбления и угрозы в адрес игроков и судей недопустимы.</li>
                <li>Нарушение правил влечёт предупреждение, техническое поражение или дисквалификацию команды без возврата регистрационного взноса.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-dota-gold mb-3">7. Технические положения</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Команда обязана явиться на матч в полном составе не позднее чем через 15 минут после назначенного времени.</li>
                <li>Каждой команде предоставляется право на техническую паузу продолжительностью до 10 минут за матч.</li>
                <li>При массовом сбое на стороне игровых серверов матч переносится по решению судьи.</li>
                <li>Организатор не отвечает за качество интернет-соединения и оборудование участников.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-dota-gold mb-3">8. Призовой фонд</h2>
              <p>
                Призовой фонд Турнира является фиксированным, формируется за счёт собственных
                средств Организатора и не зависит от количества участников и суммы
                регистрационных взносов. Распределение призового фонда по местам публикуется
                на сайте. Порядок и сроки выплаты призовых определены разделом 5{" "}
                <a href="/oferta" className="text-dota-gold hover:underline">
                  Публичной оферты
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-dota-gold mb-3">9. Контакты Организатора</h2>
              <p>
                ИП Бахтиева Римма Шаймардановна<br />
                ИНН: 024202629803<br />
                ОГРНИП: 326028000205896<br />
                Email: russiancup@mail.ru<br />
                Телефон: +7 929 748-46-31
              </p>
            </section>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
