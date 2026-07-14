export interface Player {
  nickname: string;
  mmr: string;
  dotabuff?: string;
  steam?: string;
}

export interface Team {
  id: string;
  teamName: string;
  teamTag: string;
  playerCount: number;
  substitute?: string;
  captainName: string;
  captainNickname: string;
  captainTelegram: string;
  captainDiscord: string;
  captainEmail: string;
  players: Player[];
  status: "pending" | "paid";
  createdAt: string;
}

export interface Registration {
  id: string;
  teamName: string;
  teamTag: string;
  playerCount: number;
  substitute?: string;
  captainName: string;
  captainNickname: string;
  captainTelegram: string;
  captainDiscord: string;
  captainEmail: string;
  players: Player[];
  createdAt: string;
}

export interface Visit {
  id: string;
  date: string;
  ip?: string;
  userAgent?: string;
}

export interface Match {
  id: string;
  round: number;
  matchNumber: number;
  teamA?: string;
  teamB?: string;
  scheduledAt?: string;
  status: "scheduled" | "live" | "finished";
  winner?: string;
}

export interface TournamentSettings {
  name: string;
  date: string;
  prizePool: string;
  entryFee: number;
  format: string;
  server: string;
  registrationOpen: boolean;
}

export interface Contacts {
  discord: string;
  telegram: string;
  email: string;
  responseTime: string;
}

export interface LiveStream {
  url: string;
  title: string;
  isActive: boolean;
}

export interface SiteData {
  tournament: TournamentSettings;
  contacts: Contacts;
  liveStream: LiveStream;
  teams: Team[];
  registrations: Registration[];
  visits: Visit[];
  matches: Match[];
}

export const defaultTournament: TournamentSettings = {
  name: "RUSSIAN CUP SEASON 1",
  date: "2024-08-15T18:00:00.000Z",
  prizePool: "250 000 ₽",
  entryFee: 5000,
  format: "5x5",
  server: "EU / RU",
  registrationOpen: true,
};

export const defaultContacts: Contacts = {
  discord: "https://discord.gg/russiancup",
  telegram: "https://t.me/russiancup_admin",
  email: "admin@russiancup.ru",
  responseTime: "ежедневно с 10:00 до 22:00 (MSK)",
};

export const defaultLiveStream: LiveStream = {
  url: "",
  title: "Трансляция скоро начнётся",
  isActive: false,
};

export const defaultTeams: Team[] = [
  {
    id: "team-1",
    teamName: "TEAM SPIRIT",
    teamTag: "TS",
    status: "paid",
    playerCount: 5,
    substitute: "",
    captainName: "Ярослав",
    captainNickname: "Miposhka",
    captainTelegram: "@ts_captain",
    captainDiscord: "miposhka#0001",
    captainEmail: "team@spirit.gg",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
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
    substitute: "",
    captainName: "Александр",
    captainNickname: "Save-",
    captainTelegram: "@bb_captain",
    captainDiscord: "save#0002",
    captainEmail: "team@betboom.gg",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
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
    substitute: "",
    captainName: "Алексей",
    captainNickname: "Solo",
    captainTelegram: "@navi_captain",
    captainDiscord: "solo#0003",
    captainEmail: "team@navi.gg",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
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
    substitute: "",
    captainName: "Иван",
    captainNickname: "Zayac",
    captainTelegram: "@l1ga_captain",
    captainDiscord: "zayac#0004",
    captainEmail: "team@l1ga.gg",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    players: [
      { nickname: "Kodos", mmr: "8500" },
      { nickname: "Swiftending", mmr: "8200" },
      { nickname: "Magenta", mmr: "8000" },
      { nickname: "Pantomem", mmr: "7800" },
      { nickname: "Zayac", mmr: "9000" },
    ],
  },
];

export const defaultMatches: Match[] = [
  { id: "m-1-1", round: 1, matchNumber: 1, teamA: "TEAM SPIRIT", teamB: "L1GA TEAM", status: "scheduled" },
  { id: "m-1-2", round: 1, matchNumber: 2, teamA: "BetBoom Team", teamB: "Natus Vincere", status: "scheduled" },
  { id: "m-2-1", round: 2, matchNumber: 1, status: "scheduled" },
  { id: "m-3-1", round: 3, matchNumber: 1, status: "scheduled" },
];

export const defaultRegistrations: Registration[] = [];

export const defaultVisits: Visit[] = [];

export function getDefaultData(): SiteData {
  return {
    tournament: { ...defaultTournament },
    contacts: { ...defaultContacts },
    liveStream: { ...defaultLiveStream },
    teams: [...defaultTeams],
    registrations: [...defaultRegistrations],
    visits: [...defaultVisits],
    matches: [...defaultMatches],
  };
}
