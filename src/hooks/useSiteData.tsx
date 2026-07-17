"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import {
  type SiteData,
  type Team,
  type Registration,
  type Match,
  type TournamentSettings,
  type Contacts,
  type LiveStream,
} from "@/lib/data";
import { getSiteData } from "@/server/actions/site";
import {
  updateTournament as updateTournamentAction,
  toggleRegistration as toggleRegistrationAction,
} from "@/server/actions/admin";
import {
  createTeam as createTeamAction,
  addTeam as addTeamAction,
  updateTeam as updateTeamAction,
  deleteTeam as deleteTeamAction,
} from "@/server/actions/team";
import {
  setMatches as setMatchesAction,
  updateMatch as updateMatchAction,
  deleteMatch as deleteMatchAction,
  createMatch as createMatchAction,
} from "@/server/actions/match";
import { trackVisit as trackVisitAction } from "@/server/actions/visit";

interface SiteDataContextValue {
  data: SiteData;
  isLoaded: boolean;
  refresh: () => Promise<void>;
  updateTournament: (tournament: Partial<TournamentSettings> & Partial<LiveStream>) => Promise<void>;
  updateContacts: (contacts: Partial<Contacts>) => Promise<void>;
  updateLiveStream: (liveStream: Partial<LiveStream>) => Promise<void>;
  setTeams: (teams: Team[]) => void;
  addTeam: (team: Omit<Team, "id" | "createdAt">) => Promise<void>;
  updateTeam: (id: string, team: Partial<Team>) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
  addRegistration: (registration: Omit<Registration, "id" | "createdAt">) => Promise<Registration>;
  deleteRegistration: (id: string) => Promise<void>;
  setMatches: (matches: Match[]) => Promise<void>;
  updateMatch: (id: string, match: Partial<Match>) => Promise<void>;
  trackVisit: () => Promise<void>;
  reset: () => void;
}

const SiteDataContext = createContext<SiteDataContextValue | null>(null);

export function SiteDataProvider({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: SiteData;
}) {
  const [data, setDataState] = useState<SiteData>(initialData);
  const [isLoaded, setIsLoaded] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const fresh = await getSiteData();
      setDataState(fresh);
    } catch (error) {
      console.error("Failed to refresh site data:", error);
    }
  }, []);

  const updateTournament = useCallback(
    async (tournament: Partial<TournamentSettings> & Partial<LiveStream>) => {
      await updateTournamentAction({
        name: tournament.name ?? data.tournament.name,
        date: tournament.date ?? data.tournament.date,
        prizePool: tournament.prizePool ?? data.tournament.prizePool,
        entryFee: tournament.entryFee ?? data.tournament.entryFee,
        format: tournament.format ?? data.tournament.format,
        server: tournament.server ?? data.tournament.server,
        registrationOpen: tournament.registrationOpen ?? data.tournament.registrationOpen,
        contacts: data.contacts,
        streamUrl: tournament.url ?? data.liveStream.url,
        streamTitle: tournament.title ?? data.liveStream.title,
        streamActive: tournament.isActive ?? data.liveStream.isActive,
      });
      await refresh();
    },
    [data, refresh]
  );

  const updateContacts = useCallback(
    async (contacts: Partial<Contacts>) => {
      await updateTournamentAction({
        name: data.tournament.name,
        date: data.tournament.date,
        prizePool: data.tournament.prizePool,
        entryFee: data.tournament.entryFee,
        format: data.tournament.format,
        server: data.tournament.server,
        registrationOpen: data.tournament.registrationOpen,
        contacts: {
          discord: contacts.discord ?? data.contacts.discord,
          telegram: contacts.telegram ?? data.contacts.telegram,
          email: contacts.email ?? data.contacts.email,
          responseTime: contacts.responseTime ?? data.contacts.responseTime,
        },
        streamUrl: data.liveStream.url,
        streamTitle: data.liveStream.title,
        streamActive: data.liveStream.isActive,
      });
      await refresh();
    },
    [data, refresh]
  );

  const updateLiveStream = useCallback(
    async (liveStream: Partial<LiveStream>) => {
      await updateTournamentAction({
        name: data.tournament.name,
        date: data.tournament.date,
        prizePool: data.tournament.prizePool,
        entryFee: data.tournament.entryFee,
        format: data.tournament.format,
        server: data.tournament.server,
        registrationOpen: data.tournament.registrationOpen,
        contacts: data.contacts,
        streamUrl: liveStream.url ?? data.liveStream.url,
        streamTitle: liveStream.title ?? data.liveStream.title,
        streamActive: liveStream.isActive ?? data.liveStream.isActive,
      });
      await refresh();
    },
    [data, refresh]
  );

  const setTeams = useCallback((teams: Team[]) => {
    setDataState((prev) => ({ ...prev, teams, registrations: teams.map(mapTeamToRegistration) }));
  }, []);

  const addTeam = useCallback(
    async (team: Omit<Team, "id" | "createdAt">) => {
      await addTeamAction({
        teamName: team.teamName,
        teamTag: team.teamTag,
        playerCount: team.playerCount,
        substitute: team.substitute,
        captainName: team.captainName,
        captainNickname: team.captainNickname,
        captainTelegram: team.captainTelegram,
        captainDiscord: team.captainDiscord,
        captainEmail: team.captainEmail,
        players: team.players as { nickname: string; mmr: string; dotabuff: string; steam: string }[],
        status: team.status,
      });
      await refresh();
    },
    [refresh]
  );

  const updateTeam = useCallback(
    async (id: string, team: Partial<Team>) => {
      await updateTeamAction(id, {
        teamName: team.teamName,
        teamTag: team.teamTag,
        playerCount: team.playerCount,
        substitute: team.substitute,
        captainName: team.captainName,
        captainNickname: team.captainNickname,
        captainTelegram: team.captainTelegram,
        captainDiscord: team.captainDiscord,
        captainEmail: team.captainEmail,
        players: team.players as { nickname: string; mmr: string; dotabuff: string; steam: string }[],
        status: team.status,
      });
      await refresh();
    },
    [refresh]
  );

  const deleteTeam = useCallback(
    async (id: string) => {
      await deleteTeamAction(id);
      await refresh();
    },
    [refresh]
  );

  const addRegistration = useCallback(
    async (registration: Omit<Registration, "id" | "createdAt">): Promise<Registration> => {
      const result = await createTeamAction({
        teamName: registration.teamName,
        teamTag: registration.teamTag,
        playerCount: registration.playerCount,
        substitute: registration.substitute,
        captainName: registration.captainName,
        captainNickname: registration.captainNickname,
        captainTelegram: registration.captainTelegram,
        captainDiscord: registration.captainDiscord,
        captainEmail: registration.captainEmail,
        players: registration.players as { nickname: string; mmr: string; dotabuff: string; steam: string }[],
      });

      await refresh();

      return {
        ...registration,
        id: result.teamId,
        createdAt: new Date().toISOString(),
      };
    },
    [refresh]
  );

  const deleteRegistration = useCallback(
    async (id: string) => {
      await deleteTeamAction(id);
      await refresh();
    },
    [refresh]
  );

  const setMatches = useCallback(
    async (matches: Match[]) => {
      await setMatchesAction(matches);
      await refresh();
    },
    [refresh]
  );

  const updateMatch = useCallback(
    async (id: string, match: Partial<Match>) => {
      await updateMatchAction(id, match);
      await refresh();
    },
    [refresh]
  );

  const trackVisit = useCallback(async () => {
    await trackVisitAction();
  }, []);

  const reset = useCallback(() => {
    // No-op in production; kept for API compatibility
  }, []);

  return (
    <SiteDataContext.Provider
      value={{
        data,
        isLoaded,
        refresh,
        updateTournament,
        updateContacts,
        updateLiveStream,
        setTeams,
        addTeam,
        updateTeam,
        deleteTeam,
        addRegistration,
        deleteRegistration,
        setMatches,
        updateMatch,
        trackVisit,
        reset,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) {
    throw new Error("useSiteData must be used within SiteDataProvider");
  }
  return ctx;
}

function mapTeamToRegistration(team: Team): Registration {
  return {
    id: team.id,
    teamName: team.teamName,
    teamTag: team.teamTag,
    playerCount: team.playerCount,
    substitute: team.substitute,
    captainName: team.captainName,
    captainNickname: team.captainNickname,
    captainTelegram: team.captainTelegram,
    captainDiscord: team.captainDiscord,
    captainEmail: team.captainEmail,
    players: team.players,
    createdAt: team.createdAt,
  };
}
