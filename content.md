# Контекст работы над проектом

**Обновлено:** 2026-09-18  
**Проект:** Russian Cup S1 — лендинг/регистрация турнира по Dota 2  
**Локальная папка:** `D:\KimiKod\Dota 2 new version`  
**Резервная копия:** `D:\KimiKod\Project\russian-cup-s1`  
**Репозиторий:** https://github.com/v2013daniel-beep/russian-cup-s1.git  
**Домен:** https://russiancupturnament.com/ (+ www)  
**База данных:** Локальный PostgreSQL на VPS (`127.0.0.1:5432/russiancup`, user `russiancup`).
Supabase **больше не используется** — из России соединения до него нестабильны (таймауты пула Prisma P2024 под нагрузкой, как transaction-, так и session-pooler). Данные перенесены из Supabase 2026-09-13 скриптами `export-data.mjs`/`import-data.mjs` (без таблицы visits — аналитика). URL к Supabase сохранён в бэкапе `.env.supabase.bak` на VPS.
**Стек:** Next.js 14 + TypeScript + Tailwind + Prisma + PostgreSQL (локальный).  
**Платёжный сервис (в работе):** **ENOT.io** (замена ЮKassa и Robokassa — обе отказали).

---

## Платежи: ЮKassa ❌ → Robokassa ❌ → ENOT.io ⏳ (2026-09-18)

- **ЮKassa** — финальный отказ: «не можем заключить договор с ИП Бахтиева Р.Ш. (НЭК.467906.01), решение окончательное». Причины не раскрывают. Вероятно: скоринг ИП (свежая регистрация) и/или модель «взнос + призовой фонд» выглядит как тотализатор.
- **Robokassa** — отменили сами, не подключали.
- **ENOT.io** — выбран как замена. Работает с ИП и физлицами, модерация до суток.
  - API: создание инвойса `POST https://api.enot.io/invoice/create` (заголовок `x-api-key`), webhook с подписью `x-api-sha256-signature`. Доки: https://docs.enot.io/e/new/create-invoice
  - **Подтверждение домена пройдено способом HTML-файла** (способ через DNS TXT-запись `enot=87005dad` у ENOT не сработал — их кэш DNS не видел запись, хотя Google/Cloudflare DNS её видели; TXT-запись в зоне reg.ru осталась, не мешает).
  - Файл `enot_87005dad.html` (содержимое: `enot-domain-conform-text`) лежит в `/opt/russiancup/app/public/` и **отдаётся напрямую через nginx** (см. ниже), доступен по `https://russiancupturnament.com/enot_87005dad.html` (200).
  - **Дальше:** после одобрения кассы получить `Shop ID` + `секретный ключ (API key)`, заменить `createRobokassaPayment` на ENOT в `src/server/actions/payment.ts`, написать webhook в `src/app/api/payment/result/route.ts`, env: `ENOT_SHOP_ID`, `ENOT_SECRET_KEY`, `ENOT_API_KEY`.

## Оформление сайта под модерацию агрегаторов (2026-09-18)

Правки для снятия «флага тотализатора» при модерации (Robokassa, ENOT, CloudPayments):

- **Оферта** (`src/app/oferta/page.tsx`): п.2 — взнос как оплата услуг организации (сетка, судейство, сервер, трансляции) + «не является азартной игрой, киберспорт — вид спорта»; п.5 — призовой фонд фиксированный, из собственных средств организатора, не зависит от взносов; п.6 — возврат по заявлению за 48 часов до начала (было «не возвращается»), секция имеет `id="refund"`; п.4 — ссылка на Регламент. «Вступительный взнос» → «регистрационный взнос» везде.
- **Новая страница** `/regulations` (`src/app/regulations/page.tsx`) — Регламент турнира: формат, условия участия (16+), судейство, честная игра, состав взноса, призовой фонд.
- **FAQ**: новый вопрос «Что входит в регистрационный взнос?», новая формулировка возврата.
- **Registration.tsx**: блок «Во взнос входит» на экране оплаты, Регламент в чекбоксе согласия.
- **Footer**: ссылки «Регламент турнира» и «Возврат средств» (/oferta#refund), маркировка «16+ | Киберспортивное соревнование, не является азартной игрой» (было 18+).
- **TournamentInfo**: «Гарантированный призовой фонд ... от организатора».
- **Сопроводительные письма** для Robokassa и ENOT — `moderation-letters.md` в корне (отправлять ПОСЛЕ деплоя этих правок).
- **TODO перед повторной подачей:** проверить ОКВЭД ИП (нужны 93.29.9/93.19/90.02; кодов группы 92 быть не должно).
- Локальная сборка (`npm run build`) проходит, страница `/regulations` генерируется.

## ПРАВИЛО: экономия токенов

После завершения задачи — короткий отчёт в чат (что сделано, что осталось), детали фиксировать в md-файлах проекта, а не в переписке.

## Оплата через Telegram-бота (2026-09-18, внедрено)

Кассы (ЮKassa, Robokassa, ENOT) отказали окончательно → приём оплаты через своего бота, перевод по реквизитам ИП (QR по ГОСТ СТ0001, Альфа-Банк). Ручное подтверждение админом.

- **Бот:** @russiancupseasonbot, код `bot/src/index.js` (grammy + qrcode, CommonJS, лонг-поллинг вручную timeout=5). Prisma Client подтягивается из родительского `node_modules` приложения (отдельный generate в bot/ не нужен).
- **Реквизиты зашиты в коде** (`PAYEE` в bot/src/index.js): счёт 40802810329310008672, БИК 042202824, Альфа-Банк.
- **Схема:** Payment + поля `kopecks` (уникальные копейки 1-99 для идентификации перевода), `telegramId`, `telegramUsername`, `receiptFileId`. Метод оплаты: `telegram_qr`.
- **Поток:** форма → `createTelegramPayment` (src/server/actions/payment.ts) → deep link `t.me/russiancupseasonbot?start=pay_<externalId>` → бот выдаёт QR+реквизиты → клиент шлёт чек → админу в TELEGRAM_ADMIN_CHAT_ID фото с кнопками ok:/no: → ✅ = Payment.success + Team.paid, ❌ = повторная отправка чека.
- **Robokassa удалена** (lib/robokassa.ts, api/payment/result). Страница api/payment/success не используется.
- **КРИТИЧНО — релей:** с VPS (RU IP) api.telegram.org НЕДОСТУПЕН (таймаут, Telegram блочит RU). Весь трафик идёт через релей на Vercel: код `D:\KimiKod\tg-relay` (вне репозитория), URL `https://russiancup-tg-relay.vercel.app/api/tg/bot<token>/<method>`, env TG_BOT_TOKEN в Vercel. И сайт (src/lib/telegram.ts), и бот используют `TG_API_ROOT`. **Токен Vercel, выданный 18.09, невалиден (User not found) — нужен свежий (Settings → Tokens).**
- **VPS:** systemd `russiancup-bot.service` (enabled, НЕ запущен до деплоя релея; старт: `systemctl start russiancup-bot`). env бота: `/opt/russiancup/app/bot/.env` (BOT_TOKEN, ADMIN_CHAT_ID, DATABASE_URL, TG_API_ROOT). В сайтовом .env добавлены TG_API_ROOT и TELEGRAM_BOT_USERNAME.
- **Деплой бота:** `cd /opt/russiancup/app && git pull && cd bot && npm ci && systemctl restart russiancup-bot` (после правок сайта — обычный деплой сайта).
- До деплоя релея уведомления сайта админу в Telegram не доходят (были сломаны молча и раньше — та же блокировка).

## Изменения в nginx на VPS (2026-09-18)

В `/etc/nginx/sites-available/russiancup` добавлен блок **до** `location /`:
```nginx
location = /enot_87005dad.html {
    alias /opt/russiancup/app/public/enot_87005dad.html;
    default_type text/html;
}
```
**Важно:** Next.js (`next start`) раздаёт из `public/` только файлы, существовавшие на момент `next build`. Новые файлы в `public/` без пересборки НЕ отдаются (404) — поэтому файл ENOT отдан через nginx alias. При пересборке/деплое сайта файл сохранится (лежит в репозитории нет — лежит только на VPS в public/; при `git pull`+rebuild не затирается, т.к. не конфликтует с git).

## Инцидент: сайт не открывался у админа из Москвы (2026-09-17)

У заказчика открывалось, у администратора (Москва) — «не удаётся установить соединение» и по Wi-Fi, и по LTE. Сервер был полностью исправен (ноды check-host.net RU — 200 за 0.2с). Диагноз: **клиентская проблема** — тест по голому IP `http://134.0.113.240` у админа открылся (404 nginx = связь есть). Причина: старый DNS-кэш/VPN/Private Relay (iCloud) на его устройствах, ведущие на мёртвый IP Vercel. Решение: режим полёта 30с, отключить VPN и iCloud Private Relay, очистить кэш Safari, перезагрузить; запасной вариант — VPN на 1–2 дня, пока протухнет кэш оператора.

---

## ТЕКУЩАЯ АРХИТЕКТУРА ХОСТИНГА (важно, изменилось!)

Сайт **больше не на Vercel**. Хостится на VPS reg.ru:

```
Клиент → VPS reg.ru (Москва, nginx + SSL) → Next.js на localhost:3000 → локальный PostgreSQL
```

- **VPS:** reg.ru, тариф HP C1-M1-D10 (1 vCPU / 1 ГБ RAM / 10 ГБ NVMe + swap 2 ГБ), регион Москва-3, Ubuntu 24.04.
- **IP:** `134.0.113.240` (домен и www смотрят A-записями на него; DNS — бесплатные NS reg.ru).
- **Приложение:** `/opt/russiancup/app` (git clone репозитория), `.env` — `/opt/russiancup/app/.env` (копия локального).
- **Сервис:** systemd `russiancup.service` (`npm start`, порт 3000, HOSTNAME=127.0.0.1, автозапуск + Restart=always).
- **nginx:** `/etc/nginx/sites-available/russiancup` — прокси на `127.0.0.1:3000`, SSL Let's Encrypt (certbot, автообновление), редирект http→https.
- **Доступ по SSH:** root@134.0.113.240 (пароль у заказчика; удобный запуск команд — скрипт `D:\KimiKod\vps-tools\ssh-exec.mjs`, Node + ssh2).

**Деплой теперь такой:**
```bash
ssh root@134.0.113.240
cd /opt/russiancup/app && git pull && npm ci && npx prisma generate && npm run build
systemctl restart russiancup
```
(Сборка на 1 vCPU занимает ~10–15 минут.)

**Vercel:** проект остался (`prj_qattsfHwpYmxykZowI9y10cdKTo4`, команда `dote-2`) как запасной вариант, но домен туда больше не смотрит. Токен Vercel хранится отдельно, не в репозитории.

---

## История: почему переехали с Vercel (модерация ЮKassa, 2026-09-13)

ЮKassa трижды отклоняла заявку: «не удаётся установить соединение с сайтом», хотя с наших машин сайт открывался.

Диагностика показала:
1. Сначала была потеряна A-запись apex при переносе DNS на reg.ru — исправлено.
2. Затем выяснилось: IP Vercel `76.76.21.21` **недоступен из части российских сетей** (TCP-таймаут; с российского VPS до него тоже нет связи, до других IP Vercel — есть). Из-за этого модераторы ЮKassa сайт не видели.
3. Попытка проксировать Vercel через российский VPS (nginx → Vercel) упёрлась в **JS-челлендж Vercel** (`X-Vercel-Mitigated: challenge`) на IP VPS — отключается только в платных WAF-настройках, через API не снимается. `attackModeEnabled:false` через API не помогло.
4. Решение: **полный перенос приложения на VPS** (Supabase остался в EU — с VPS доступен, работает).

Результат: сайт отдаёт 200 из Москвы, Питера, Казахстана, Германии (проверено check-host.net).

---

## Доработка под модерацию ЮKassa (2026-09-11)

ЮKassa поставила подключение на паузе: «сайт не работает или находится в разработке». Что исправлено:
- Страница `/privacy` (Политика обработки ПД) + ссылка в футере.
- В футере email `russiancup@mail.ru` и телефон `+7 929 748-46-31`.
- Обязательный чекбокс согласия с офертой и политикой ПД в форме регистрации.
- Блок оплаты: убраны крипта/СБП-заглушки и «свяжитесь с администрацией»; один сценарий «Оплатить картой» (`createRobokassaPayment` в `src/server/actions/payment.ts`).
- FAQ: убраны Robokassa/крипта, добавлен вопрос про возврат.
- Пустая сетка TBD скрыта («Сетка будет сформирована...»), смягчены тексты пустых блоков.
- Контакты: Telegram `https://t.me/FODY_ex`, email `russiancup@mail.ru`, телефон `+7 929 748-46-31` (поле `phone` добавлено в модель `Contact` через `scripts/update-contacts.mjs`; `prisma db push` через pooler вис — колонка добавлена raw SQL).
- Призовой фонд синхронизирован: везде «100 000 ₽».

## Ранее (2026-09-09 и раньше)

- `middleware.ts` для защиты `/admin/*`; унифицированы cookie/авторизация админа.
- Синхронизированы схемы Prisma; `DATABASE_URL` pooler Supabase в `.env`.
- ESLint, убрано дублирование `trackVisit`, единый `buildRobokassaUrl`.
- Зал славы: захардкоженные команды обнулены, редактируется через админку.
- Подвал: реквизиты **ИП БАХТИЕВА РИММА ШАЙМАРДАНОВНА, ИНН 024202629803, ОГРНИП 326028000205896** + ссылка на оферту.
- Страница «Прошедшие турниры» + вкладка в админке.
- Локальная копия проекта: `D:\KimiKod\Project\russian-cup-s1` (~69 МБ, без node_modules/.next/.git/.vercel).

---

## Известные нерешённые вопросы

- **Онлайн-касса:** подключается **ENOT.io** — домен подтверждён (HTML-файл), ждём одобрения кассы и ключи (Shop ID + secret). После получения: заменить Robokassa на ENOT в `src/server/actions/payment.ts` и webhook `src/app/api/payment/result/route.ts`. ЮKassa и Robokassa — окончательно отказали/отменены, код Robokassa (`payment.ts`, `buildRobokassaUrl`) подлежит замене.
- **JWT_SECRET:** для production сгенерировать случайную строку и прописать в `.env` на VPS (и локально).
- **Мониторинг:** нет; при желании добавить проверку доступности из РФ (cron + check-host/uptime-robot). Заказчик спрашивал — обсуждали UptimeRobot/Telegram-бота с VPS, пока не настроено.

---

## Ключевые команды

Локально (Windows, Git Bash; Node — портативный `D:\KimiKod\node-portable`):
```bash
export PATH="/d/KimiKod/node-portable:$PATH"
npm install && npx prisma generate
npm run dev      # разработка
npm run build    # сборка
npm run lint     # линт
```

На VPS:
```bash
systemctl status russiancup        # статус приложения
journalctl -u russiancup -f        # логи приложения
nginx -t && systemctl reload nginx # проверка/перезагрузка nginx
certbot renew --dry-run            # проверка автообновления SSL
```

---

## Примечания для продолжения работы

- Рабочая папка: `D:\KimiKod\Dota 2 new version`; резерв: `D:\KimiKod\Project\russian-cup-s1`.
- Перед правками проверить `git status` и актуальность `.env`.
- После правок: локальная сборка → коммит/пуш → `git pull` + пересборка на VPS → `systemctl restart russiancup` → проверка сайта.
- SSH-доступ к VPS удобно выполнять через `D:\KimiKod\vps-tools\ssh-exec.mjs` (содержит пароль — не коммитить, папка вне репозитория).
- Если сайт «не открывается» у кого-то в РФ — первым делом проверять с check-host.net нодами RU и логи nginx на VPS.
