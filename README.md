# RUSSIAN CUP SEASON 1 — Landing Page

Современный лендинг турнира по Dota 2 с регистрацией команд, оплатой участия и админ-панелью.

## Возможности

- **Лендинг** в премиальном dark-стиле по мотивам Dota 2 с реальными атмосферными изображениями, SVG-элементами, анимациями и glow-эффектами
- **Hero** с таймером обратного отсчёта до старта турнира
- **Форма регистрации** команды (5 игроков + капитан)
- **Оплата участия** через Robokassa + fallback-методы (карта, СБП, Crypto)
- **Админ-панель** со статистикой, управлением заявками и экспортом в Excel
- **Telegram-уведомления** администратору о новых заявках и оплатах
- **Адаптивная вёрстка** под desktop, tablet и mobile
- **SEO-friendly** структура и мета-теги

## Технологический стек

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Prisma + SQLite
- Robokassa API
- Telegram Bot API

## Быстрый старт

### 1. Настройка окружения

```bash
cp .env.example .env
```

Отредактируй `.env`:

```env
# Пароль администратора
ADMIN_PASSWORD=your_secure_password

# Robokassa (для реальных платежей)
ROBOKASSA_MERCHANT_LOGIN=your_login
ROBOKASSA_PASSWORD_1=your_password_1
ROBOKASSA_PASSWORD_2=your_password_2
ROBOKASSA_TEST_MODE=1

# Telegram уведомления
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_ADMIN_CHAT_ID=your_chat_id

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Инициализация базы данных

```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

### 3. Запуск production-версии (рекомендуется)

На Windows просто запусти:

```bash
run.bat
```

Или вручную:

```bash
npm run build
npm start
```

Открой в браузере: http://localhost:3000

### 4. Доступ к админ-панели

- URL: http://localhost:3000/admin
- Логин: не требуется
- Пароль: тот, что указан в `ADMIN_PASSWORD`

## Деплой

Подробные инструкции по деплою на VPS / Vercel + PostgreSQL смотри в файле [`DEPLOY.md`](DEPLOY.md).

Кратко:
- **VPS (рекомендуется):** `docker-compose up -d --build`
- **Vercel:** `node scripts/switch-db.js postgresql && vercel --prod`

## Сборка для production

```bash
npm run build
npm start
```

## Визуальные активы

- `public/images/` — атмосферные фоновые фото (Unsplash, free for commercial use)
- `public/svgs/` — оригинальные SVG-элементы в стиле Dota 2: эмблема турнира, рунические круги, силуэт героя, декоративные разделители

## Структура проекта

```
src/
├── app/              # Next.js страницы
├── components/       # React компоненты
│   ├── sections/     # Секции лендинга
│   ├── ui/           # UI-примитивы
│   ├── layout/       # Header, Footer
│   └── admin/        # Компоненты админки
├── lib/              # Утилиты (auth, robokassa, telegram, export)
└── server/actions/   # Server Actions
prisma/
├── schema.prisma     # Схема базы данных
└── seed.ts           # Начальные данные
```

## Платежи

### Robokassa

Для работы с реальными платежами заполните `ROBOKASSA_*` переменные в `.env`.

### Тестовый режим

При `ROBOKASSA_TEST_MODE=1` платежи проходят в тестовом режиме Robokassa.

### Альтернативные способы

Карта, СБП и Crypto реализованы как заглушки с инструкциями. Администратор получает уведомление в Telegram и может подтвердить оплату вручную.

## Уведомления в Telegram

Бот отправляет сообщения при:
- Новой регистрации команды
- Успешной оплате через Robokassa

## Экспорт в Excel

В админ-панели на странице "Команды" есть кнопка экспорта всех заявок в `.xlsx`.
