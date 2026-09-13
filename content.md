# Контекст работы над проектом

**Обновлено:** 2026-09-13  
**Проект:** Russian Cup S1 — лендинг/регистрация турнира по Dota 2  
**Локальная папка:** `D:\KimiKod\Dota 2 new version`  
**Резервная копия:** `D:\KimiKod\Project\russian-cup-s1`  
**Репозиторий:** https://github.com/v2013daniel-beep/russian-cup-s1.git  
**Домен:** https://russiancupturnament.com/ (+ www)  
**База данных:** Supabase — `https://hlymvaaoggduxhmngudn.supabase.co` (PostgreSQL, eu-west-1, pooler 6543)  
**Стек:** Next.js 14 + TypeScript + Tailwind + Prisma + PostgreSQL (Supabase).

---

## ТЕКУЩАЯ АРХИТЕКТУРА ХОСТИНГА (важно, изменилось!)

Сайт **больше не на Vercel**. Хостится на VPS reg.ru:

```
Клиент → VPS reg.ru (Москва, nginx + SSL) → Next.js на localhost:3000 → Supabase
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

- **Онлайн-касса:** подключается **ЮKassa** (заявка №138827514, CRM020480285). Сайт под модерацию доработан, ждём повторной проверки после переезда на VPS. Robokassa-код (`payment.ts`, `buildRobokassaUrl`) пока остаётся — при подключении ЮKassa заменить провайдера оплаты.
- **JWT_SECRET:** для production сгенерировать случайную строку и прописать в `.env` на VPS (и локально).
- **Мониторинг:** нет; при желании добавить проверку доступности из РФ (cron + check-host/uptime-robot).

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
