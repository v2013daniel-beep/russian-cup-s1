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
      const fresh = await getSiteData();
      await updateTournamentAction({
        name: tournament.name ?? fresh.tournament.name,
        date: tournament.date ?? fresh.tournament.date,
        prizePool: tournament.prizePool ?? fresh.tournament.prizePool,
        entryFee: tournament.entryFee ?? fresh.tournament.entryFee,
        format: tournament.format ?? fresh.tournament.format,
        server: tournament.server ?? fresh.tournament.server,
        registrationOpen: tournament.registrationOpen ?? fresh.tournament.registrationOpen,
        contacts: fresh.contacts,
        streamUrl: tournament.url ?? fresh.liveStream.url,
        streamTitle: tournament.title ?? fresh.liveStream.title,
        streamActive: tournament.isActive ?? fresh.liveStream.isActive,
      });
      await refresh();
    },
    [refresh]
  );

  const updateContacts = useCallback(
    async (contacts: Partial<Contacts>) => {
      const fresh = await getSiteData();
      await updateTournamentAction({
        name: fresh.tournament.name,
        date: fresh.tournament.date,
        prizePool: fresh.tournament.prizePool,
        entryFee: fresh.tournament.entryFee,
        format: fresh.tournament.format,
        server: fresh.tournament.server,
        registrationOpen: fresh.tournament.registrationOpen,
        contacts: {
          discord: contacts.discord ?? fresh.contacts.discord,
          telegram: contacts.telegram ?? fresh.contacts.telegram,
          email: contacts.email ?? fresh.contacts.email,
          responseTime: contacts.responseTime ?? fresh.contacts.responseTime,
        },
        streamUrl: fresh.liveStream.url,
        streamTitle: fresh.liveStream.title,
        streamActive: fresh.liveStream.isActive,
      });
      await refresh();
    },
    [refresh]
  );

  const updateLiveStream = useCallback(
    async (liveStream: Partial<LiveStream>) => {
      const fresh = await getSiteData();
      await updateTournamentAction({
        name: fresh.tournament.name,
        date: fresh.tournament.date,
        prizePool: fresh.tournament.prizePool,
        entryFee: fresh.tournament.entryFee,
        format: fresh.tournament.format,
        server: fresh.tournament.server,
        registrationOpen: fresh.tournament.registrationOpen,
        contacts: fresh.contacts,
        streamUrl: liveStream.url ?? fresh.liveStream.url,
        streamTitle: liveStream.title ?? fresh.liveStream.title,
        streamActive: liveStream.isActive ?? fresh.liveStream.isActive,
      });
      await refresh();
    },
    [refresh]
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
