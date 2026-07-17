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
    teamName: "CYBER BEARS",
    teamTag: "CB",
    status: "paid",
    playerCount: 5,
    substitute: "",
    captainName: "Дмитрий",
    captainNickname: "Arct1c",
    captainTelegram: "@cyberbears_cap",
    captainDiscord: "arctic#0001",
    captainEmail: "cap@cyberbears.ru",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    players: [
      { nickname: "Arct1c", mmr: "9800" },
      { nickname: "FrostByte", mmr: "9200" },
      { nickname: "Polar", mmr: "8900" },
      { nickname: "Glacier", mmr: "9100" },
      { nickname: "Blizzard", mmr: "8700" },
    ],
  },
  {
    id: "team-2",
    teamName: "NEON LEGION",
    teamTag: "NL",
    status: "paid",
    playerCount: 5,
    substitute: "",
    captainName: "Артём",
    captainNickname: "NeonLord",
    captainTelegram: "@neonlegion_cap",
    captainDiscord: "neonlord#0002",
    captainEmail: "cap@neonlegion.ru",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    players: [
      { nickname: "NeonLord", mmr: "10100" },
      { nickname: "Pulse", mmr: "9500" },
      { nickname: "Voltage", mmr: "9300" },
      { nickname: "Circuit", mmr: "9100" },
      { nickname: "Flux", mmr: "8800" },
    ],
  },
  {
    id: "team-3",
    teamName: "VOID WALKERS",
    teamTag: "VW",
    status: "pending",
    playerCount: 5,
    substitute: "",
    captainName: "Максим",
    captainNickname: "VoidCaller",
    captainTelegram: "@voidwalkers_cap",
    captainDiscord: "voidcaller#0003",
    captainEmail: "cap@voidwalkers.ru",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    players: [
      { nickname: "VoidCaller", mmr: "9600" },
      { nickname: "Abyss", mmr: "9400" },
      { nickname: "Shadow", mmr: "9000" },
      { nickname: "Eclipse", mmr: "9200" },
      { nickname: "Phantom", mmr: "8900" },
    ],
  },
  {
    id: "team-4",
    teamName: "CRIMSON GUARD",
    teamTag: "CG",
    status: "pending",
    playerCount: 5,
    substitute: "",
    captainName: "Игорь",
    captainNickname: "CrimsonKing",
    captainTelegram: "@crimsonguard_cap",
    captainDiscord: "crimsonking#0004",
    captainEmail: "cap@crimsonguard.ru",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    players: [
      { nickname: "CrimsonKing", mmr: "9900" },
      { nickname: "Bloodrage", mmr: "9500" },
      { nickname: "Reaper", mmr: "9100" },
      { nickname: "Warlord", mmr: "9300" },
      { nickname: "Berserk", mmr: "8800" },
    ],
  },
  {
    id: "team-5",
    teamName: "FROST WOLVES",
    teamTag: "FW",
    status: "pending",
    playerCount: 5,
    substitute: "",
    captainName: "Сергей",
    captainNickname: "AlphaWolf",
    captainTelegram: "@frostwolves_cap",
    captainDiscord: "alphawolf#0005",
    captainEmail: "cap@frostwolves.ru",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    players: [
      { nickname: "AlphaWolf", mmr: "9700" },
      { nickname: "Howl", mmr: "9200" },
      { nickname: "Frost", mmr: "8900" },
      { nickname: "Claw", mmr: "9100" },
      { nickname: "Storm", mmr: "8800" },
    ],
  },
  {
    id: "team-6",
    teamName: "IRON TITANS",
    teamTag: "IT",
    status: "pending",
    playerCount: 5,
    substitute: "",
    captainName: "Андрей",
    captainNickname: "Titan",
    captainTelegram: "@irontitans_cap",
    captainDiscord: "titan#0006",
    captainEmail: "cap@irontitans.ru",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    players: [
      { nickname: "Titan", mmr: "10000" },
      { nickname: "Steel", mmr: "9400" },
      { nickname: "Forge", mmr: "9100" },
      { nickname: "Hammer", mmr: "9300" },
      { nickname: "Anvil", mmr: "8900" },
    ],
  },
];

export const defaultMatches: Match[] = [];

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
