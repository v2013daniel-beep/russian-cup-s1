import {
  getDefaultData,
  defaultTeams,
  type SiteData,
  type Team,
  type Registration,
} from "@/lib/data";

export const isMockMode = () => process.env.MOCK_MODE === "true";

// Backward-compatible shapes for existing server actions
export const mockTournament = {
  id: "default",
  ...getDefaultData().tournament,
  contacts: { ...getDefaultData().contacts },
};

export const mockTeams = defaultTeams.map((team) => ({
  ...team,
  createdAt: team.createdAt,
  updatedAt: team.createdAt,
}));

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

// LocalStorage-based demo store helpers
const STORAGE_KEY = "russian-cup-s1-data";

export function loadSiteData(): SiteData {
  if (typeof window === "undefined") return getDefaultData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultData();
    return { ...getDefaultData(), ...JSON.parse(raw) };
  } catch {
    return getDefaultData();
  }
}

export function saveSiteData(data: SiteData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function resetSiteData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function addRegistration(data: Omit<Registration, "id" | "createdAt">): Registration {
  const site = loadSiteData();
  const registration: Registration = {
    ...data,
    id: `reg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
  };
  site.registrations.unshift(registration);

  // Also create/update a team from registration
  const existingTeamIndex = site.teams.findIndex(
    (t) => t.teamName.toLowerCase() === data.teamName.toLowerCase()
  );
  const team: Team = {
    id: existingTeamIndex >= 0 ? site.teams[existingTeamIndex].id : `team-${Date.now()}`,
    ...data,
    status: "pending",
    createdAt: existingTeamIndex >= 0
      ? site.teams[existingTeamIndex].createdAt
      : new Date().toISOString(),
  };
  if (existingTeamIndex >= 0) {
    site.teams[existingTeamIndex] = team;
  } else {
    site.teams.unshift(team);
  }

  saveSiteData(site);
  return registration;
}

export function trackVisitClient(ip?: string, userAgent?: string): void {
  const site = loadSiteData();
  site.visits.push({
    id: `visit-${Date.now()}`,
    date: new Date().toISOString(),
    ip,
    userAgent,
  });
  saveSiteData(site);
}

export type { SiteData, Team, Registration };
