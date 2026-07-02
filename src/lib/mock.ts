export const isMockMode = () => process.env.MOCK_MODE === "true";

export const mockTournament = {
  id: "default",
  name: "RUSSIAN CUP SEASON 1",
  date: "2024-08-15T18:00:00.000Z",
  prizePool: "250 000 ₽",
  entryFee: 5000,
  format: "5x5",
  server: "EU / RU",
  registrationOpen: true,
  contacts: {
    discord: "https://discord.gg/russiancup",
    telegram: "https://t.me/russiancup_admin",
    email: "admin@russiancup.ru",
    responseTime: "ежедневно с 10:00 до 22:00 (MSK)",
  },
};

export const mockTeams = [
  {
    id: "team-1",
    teamName: "TEAM SPIRIT",
    teamTag: "TS",
    status: "paid",
    playerCount: 5,
    players: [
      { nickname: "Yatoro", mmr: "12000" },
      { nickname: "Larl", mmr: "11000" },
      { nickname: "Collapse", mmr: "11500" },
      { nickname: "Mira", mmr: "10500" },
      { nickname: "Miposhka", mmr: "10000" },
    ],
  },
  {
    id: "team-2",
    teamName: "BetBoom Team",
    teamTag: "BB",
    status: "paid",
    playerCount: 5,
    players: [
      { nickname: "Nightfall", mmr: "11000" },
      { nickname: "gpk", mmr: "11500" },
      { nickname: "MieRo", mmr: "10500" },
      { nickname: "Save-", mmr: "10000" },
      { nickname: "TORONTOTOKYO", mmr: "11000" },
    ],
  },
  {
    id: "team-3",
    teamName: "Natus Vincere",
    teamTag: "NAVI",
    status: "pending",
    playerCount: 5,
    players: [
      { nickname: "Crystallize", mmr: "10000" },
      { nickname: "Malady", mmr: "9500" },
      { nickname: "nefrit", mmr: "9800" },
      { nickname: "W_Zayac", mmr: "9200" },
      { nickname: "Solo", mmr: "9000" },
    ],
  },
  {
    id: "team-4",
    teamName: "L1GA TEAM",
    teamTag: "L1G",
    status: "pending",
    playerCount: 5,
    players: [
      { nickname: "Kodos", mmr: "8500" },
      { nickname: "Swiftending", mmr: "8200" },
      { nickname: "Magenta", mmr: "8000" },
      { nickname: "Pantomem", mmr: "7800" },
      { nickname: "Zayac", mmr: "9000" },
    ],
  },
];

export const mockStats = {
  visitsToday: 47,
  visitsTotal: 1284,
  totalTeams: mockTeams.length,
  paidTeams: mockTeams.filter((t) => t.status === "paid").length,
  pendingTeams: mockTeams.filter((t) => t.status === "pending").length,
  totalRevenue: mockTeams
    .filter((t) => t.status === "paid")
    .reduce((acc, t) => acc + mockTournament.entryFee, 0),
};
