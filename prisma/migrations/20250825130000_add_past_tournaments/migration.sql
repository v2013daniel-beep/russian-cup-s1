-- CreateTable
CREATE TABLE "PastTournament" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "winner" TEXT NOT NULL,
    "secondPlace" TEXT,
    "thirdPlace" TEXT,
    "teamsCount" INTEGER NOT NULL DEFAULT 0,
    "prizePool" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PastTournament_pkey" PRIMARY KEY ("id")
);
