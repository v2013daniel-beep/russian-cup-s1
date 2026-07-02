# Деплой RUSSIAN CUP SEASON 1

## Вариант 1: Деплой на VPS (рекомендуется для production)

Проще всего, используется SQLite. Подходит, если есть свой сервер (Ubuntu/Debian).

### Требования
- Сервер с Ubuntu 20.04+ / Debian 11+
- Установленный Docker и Docker Compose
- Домен (опционально, для HTTPS)

### Быстрый старт через Docker Compose

1. **Скопируй файлы проекта на сервер**

```bash
scp -r "Dota 2 new version" user@your-server-ip:/opt/
ssh user@your-server-ip
cd /opt/Dota\ 2\ new\ version
```

2. **Создай файл окружения**

```bash
cp .env.example .env
nano .env
```

Заполни обязательные переменные:

```env
DATABASE_URL="file:./prisma/prod.db"
ADMIN_PASSWORD="your_secure_password"
NEXT_PUBLIC_APP_URL="http://your-domain.com"
JWT_SECRET="your_random_secret_min_32_chars"

# Robokassa (для реальных платежей)
ROBOKASSA_MERCHANT_LOGIN="your_login"
ROBOKASSA_PASSWORD_1="your_password_1"
ROBOKASSA_PASSWORD_2="your_password_2"
ROBOKASSA_TEST_MODE="1"

# Telegram
TELEGRAM_BOT_TOKEN="your_bot_token"
TELEGRAM_ADMIN_CHAT_ID="your_chat_id"
```

3. **Запусти проект**

```bash
docker-compose up -d --build
```

4. **Проверь работу**

```bash
# Логи приложения
docker logs russian-cup-s1

# Статус контейнеров
docker ps
```

Сайт доступен на `http://your-server-ip:3000`.

### HTTPS через Nginx + Certbot

1. **Установи Certbot**

```bash
sudo apt install certbot python3-certbot-nginx
```

2. **Получи SSL-сертификат**

```bash
sudo certbot --nginx -d your-domain.com
```

3. **Обнови `.env`**

```env
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

4. **Перезапусти**

```bash
docker-compose up -d
```

### Обновление сайта

```bash
cd /opt/Dota\ 2\ new\ version
git pull  # если используешь git
docker-compose down
docker-compose up -d --build
```

---

## Вариант 2: Деплой на Vercel + PostgreSQL

Более современный вариант, но требует PostgreSQL (например, Vercel Postgres, Supabase, Railway).

### 1. Подготовка проекта

Переключи схему Prisma на PostgreSQL:

```bash
node scripts/switch-db.js postgresql
```

### 2. Установи Vercel CLI

```bash
node\npm i -g vercel
```

### 3. Зарегистрируйся и создай проект

```bash
vercel login
vercel
```

Следуй инструкциям в терминале.

### 4. Подключи PostgreSQL

Рекомендуется **Vercel Postgres** или **Supabase**.

#### Vercel Postgres:
1. В дашборде Vercel открой свой проект.
2. Перейди во вкладку **Storage** → **Create Database** → **Vercel Postgres**.
3. Подключи базу к проекту.
4. Скопируй `DATABASE_URL` в переменные окружения Vercel.

#### Supabase:
1. Создай проект на https://supabase.com
2. Скопируй Connection String из настроек.

### 5. Настрой переменные окружения в Vercel

В дашборде Vercel → **Settings** → **Environment Variables** добавь:

```
DATABASE_URL=postgresql://...
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_random_secret_min_32_chars
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
ROBOKASSA_MERCHANT_LOGIN=your_login
ROBOKASSA_PASSWORD_1=your_password_1
ROBOKASSA_PASSWORD_2=your_password_2
ROBOKASSA_TEST_MODE=1
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_ADMIN_CHAT_ID=your_chat_id
```

### 6. Примени миграции к базе данных

```bash
npx prisma migrate deploy
```

Или через Vercel CLI:

```bash
vercel env pull .env
npx prisma migrate deploy
```

### 7. Засидь начальные данные

```bash
npx prisma db seed
```

### 8. Пересобери и задеплой

```bash
vercel --prod
```

### Важно про Vercel

- SQLite не работает на Vercel (serverless), поэтому обязательно используй PostgreSQL.
- `NEXT_PUBLIC_APP_URL` должен совпадать с реальным доменом (Vercel даёт свой).
- Для Robokassa ResultURL указывай `https://your-domain.vercel.app/api/payment/result`.

---

## Вариант 3: Ручной деплой на сервер (без Docker)

Если Docker недоступен:

```bash
# На сервере
cd /opt/Dota\ 2\ new\ version
export PATH="$PWD/node:$PATH"
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run build
npm start
```

Для фонового запуска используй `pm2` или `systemd`:

```bash
node\npm i -g pm2
pm2 start npm --name "russian-cup" -- start
pm2 save
pm2 startup
```

---

## Проверка после деплоя

1. Открой главную страницу — должен открыться лендинг.
2. Проверь форму регистрации.
3. Зайди в админку `/admin` с паролем из `ADMIN_PASSWORD`.
4. Проверь Robokassa в тестовом режиме.
5. Проверь Telegram-уведомления.

## Типичные проблемы

### Ошибка подключения к базе данных
- Проверь `DATABASE_URL`.
- Убедись, что запущена миграция: `npx prisma migrate deploy`.

### 500 ошибка на страницах
- Проверь логи: `docker logs russian-cup-s1` или `vercel logs`.
- Убедись, что все env-переменные заполнены.

### Не работает админка
- Проверь `JWT_SECRET` — должен быть длиной не менее 32 символов.
- Проверь `ADMIN_PASSWORD`.

### Robokassa не принимает платежи
- Проверь `ROBOKASSA_MERCHANT_LOGIN` и пароли.
- Убедись, что `NEXT_PUBLIC_APP_URL` совпадает с доменом.
- Проверь `ROBOKASSA_TEST_MODE` (1 — тест, 0 — боевой).
