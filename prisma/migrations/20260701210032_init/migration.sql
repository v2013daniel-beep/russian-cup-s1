-- CreateTable
CREATE TABLE "Tournament" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'RUSSIAN CUP SEASON 1',
    "date" DATETIME NOT NULL DEFAULT '2024-08-15 18:00:00 +00:00',
    "prizePool" TEXT NOT NULL DEFAULT '250 000 ₽',
    "entryFee" INTEGER NOT NULL DEFAULT 5000,
    "format" TEXT NOT NULL DEFAULT '5x5',
    "server" TEXT NOT NULL DEFAULT 'EU / RU',
    "registrationOpen" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tournamentId" TEXT NOT NULL,
    "discord" TEXT NOT NULL DEFAULT 'https://discord.gg/russiancup',
    "telegram" TEXT NOT NULL DEFAULT 'https://t.me/russiancup_admin',
    "email" TEXT NOT NULL DEFAULT 'admin@russiancup.ru',
    "responseTime" TEXT NOT NULL DEFAULT 'Ежедневно с 10:00 до 22:00 (MSK)',
    CONSTRAINT "Contact_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teamName" TEXT NOT NULL,
    "teamTag" TEXT NOT NULL,
    "playerCount" INTEGER NOT NULL DEFAULT 5,
    "substitute" TEXT,
    "captainName" TEXT NOT NULL,
    "captainNickname" TEXT NOT NULL,
    "captainTelegram" TEXT NOT NULL,
    "captainDiscord" TEXT NOT NULL,
    "captainEmail" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teamId" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "mmr" TEXT NOT NULL,
    "dotabuff" TEXT NOT NULL,
    "steam" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teamId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "method" TEXT NOT NULL DEFAULT 'robokassa',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "externalId" TEXT,
    "paidAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Payment_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL DEFAULT 'admin',
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Visit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT,
    "userAgent" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Contact_tournamentId_key" ON "Contact"("tournamentId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_teamId_key" ON "Payment"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");
