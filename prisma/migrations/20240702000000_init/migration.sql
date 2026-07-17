-- CreateTable
CREATE TABLE "Tournament" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'RUSSIAN CUP SEASON 1',
    "date" TIMESTAMP(3) NOT NULL DEFAULT '2024-08-15 18:00:00 +00:00',
    "prizePool" TEXT NOT NULL DEFAULT '250 000 ₽',
    "entryFee" INTEGER NOT NULL DEFAULT 5000,
    "format" TEXT NOT NULL DEFAULT '5x5',
    "server" TEXT NOT NULL DEFAULT 'EU / RU',
    "registrationOpen" BOOLEAN NOT NULL DEFAULT true,
    "streamUrl" TEXT,
    "streamTitle" TEXT NOT NULL DEFAULT 'Трансляция скоро начнётся',
    "streamActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "discord" TEXT NOT NULL DEFAULT 'https://discord.gg/russiancup',
    "telegram" TEXT NOT NULL DEFAULT 'https://t.me/russiancup_admin',
    "email" TEXT NOT NULL DEFAULT 'admin@russiancup.ru',
    "responseTime" TEXT NOT NULL DEFAULT 'Ежедневно с 10:00 до 22:00 (MSK)',

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "mmr" TEXT NOT NULL,
    "dotabuff" TEXT NOT NULL,
    "steam" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "method" TEXT NOT NULL DEFAULT 'robokassa',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "externalId" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "round" INTEGER NOT NULL,
    "matchNumber" INTEGER NOT NULL,
    "teamA" TEXT,
    "teamB" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "winner" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL DEFAULT 'admin',
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visit" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contact_tournamentId_key" ON "Contact"("tournamentId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_teamId_key" ON "Payment"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
