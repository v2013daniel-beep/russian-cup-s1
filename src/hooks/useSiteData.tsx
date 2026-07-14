"use client";

import {
  createContext,
  useContext,
  useEffect,
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
  getDefaultData,
} from "@/lib/data";
import { loadSiteData, saveSiteData, resetSiteData } from "@/lib/mock";

interface SiteDataContextValue {
  data: SiteData;
  isLoaded: boolean;
  setData: (data: SiteData) => void;
  updateTournament: (tournament: Partial<TournamentSettings>) => void;
  updateContacts: (contacts: Partial<Contacts>) => void;
  updateLiveStream: (liveStream: Partial<LiveStream>) => void;
  setTeams: (teams: Team[]) => void;
  addTeam: (team: Omit<Team, "id" | "createdAt">) => void;
  updateTeam: (id: string, team: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  addRegistration: (registration: Omit<Registration, "id" | "createdAt">) => Registration;
  deleteRegistration: (id: string) => void;
  setMatches: (matches: Match[]) => void;
  updateMatch: (id: string, match: Partial<Match>) => void;
  trackVisit: (ip?: string, userAgent?: string) => void;
  reset: () => void;
}

const SiteDataContext = createContext<SiteDataContextValue | null>(null);

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<SiteData>(() => getDefaultData());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setDataState(loadSiteData());
    setIsLoaded(true);
  }, []);

  const setData = useCallback((newData: SiteData) => {
    setDataState(newData);
    saveSiteData(newData);
  }, []);

  const updateTournament = useCallback((tournament: Partial<TournamentSettings>) => {
    setDataState((prev) => {
      const next = { ...prev, tournament: { ...prev.tournament, ...tournament } };
      saveSiteData(next);
      return next;
    });
  }, []);

  const updateContacts = useCallback((contacts: Partial<Contacts>) => {
    setDataState((prev) => {
      const next = { ...prev, contacts: { ...prev.contacts, ...contacts } };
      saveSiteData(next);
      return next;
    });
  }, []);

  const updateLiveStream = useCallback((liveStream: Partial<LiveStream>) => {
    setDataState((prev) => {
      const next = { ...prev, liveStream: { ...prev.liveStream, ...liveStream } };
      saveSiteData(next);
      return next;
    });
  }, []);

  const setTeams = useCallback((teams: Team[]) => {
    setDataState((prev) => {
      const next = { ...prev, teams };
      saveSiteData(next);
      return next;
    });
  }, []);

  const addTeam = useCallback((team: Omit<Team, "id" | "createdAt">) => {
    setDataState((prev) => {
      const newTeam: Team = {
        ...team,
        id: `team-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      const next = { ...prev, teams: [newTeam, ...prev.teams] };
      saveSiteData(next);
      return next;
    });
  }, []);

  const updateTeam = useCallback((id: string, team: Partial<Team>) => {
    setDataState((prev) => {
      const next = {
        ...prev,
        teams: prev.teams.map((t) => (t.id === id ? { ...t, ...team } : t)),
      };
      saveSiteData(next);
      return next;
    });
  }, []);

  const deleteTeam = useCallback((id: string) => {
    setDataState((prev) => {
      const next = { ...prev, teams: prev.teams.filter((t) => t.id !== id) };
      saveSiteData(next);
      return next;
    });
  }, []);

  const addRegistration = useCallback((registration: Omit<Registration, "id" | "createdAt">): Registration => {
    let created: Registration | null = null;
    setDataState((prev) => {
      const newRegistration: Registration = {
        ...registration,
        id: `reg-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      // Sync team
      const existingIndex = prev.teams.findIndex(
        (t) => t.teamName.toLowerCase() === registration.teamName.toLowerCase()
      );
      const team: Team = {
        id: existingIndex >= 0 ? prev.teams[existingIndex].id : `team-${Date.now()}`,
        ...registration,
        status: existingIndex >= 0 ? prev.teams[existingIndex].status : "pending",
        createdAt: existingIndex >= 0 ? prev.teams[existingIndex].createdAt : new Date().toISOString(),
      };

      const teams = [...prev.teams];
      if (existingIndex >= 0) {
        teams[existingIndex] = team;
      } else {
        teams.unshift(team);
      }

      created = newRegistration;

      const next = {
        ...prev,
        registrations: [newRegistration, ...prev.registrations],
        teams,
      };
      saveSiteData(next);
      return next;
    });
    return created!;
  }, []);

  const deleteRegistration = useCallback((id: string) => {
    setDataState((prev) => {
      const next = { ...prev, registrations: prev.registrations.filter((r) => r.id !== id) };
      saveSiteData(next);
      return next;
    });
  }, []);

  const setMatches = useCallback((matches: Match[]) => {
    setDataState((prev) => {
      const next = { ...prev, matches };
      saveSiteData(next);
      return next;
    });
  }, []);

  const updateMatch = useCallback((id: string, match: Partial<Match>) => {
    setDataState((prev) => {
      const next = {
        ...prev,
        matches: prev.matches.map((m) => (m.id === id ? { ...m, ...match } : m)),
      };
      saveSiteData(next);
      return next;
    });
  }, []);

  const trackVisit = useCallback((ip?: string, userAgent?: string) => {
    setDataState((prev) => {
      const next = {
        ...prev,
        visits: [
          ...prev.visits,
          {
            id: `visit-${Date.now()}`,
            date: new Date().toISOString(),
            ip,
            userAgent,
          },
        ],
      };
      saveSiteData(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    resetSiteData();
    setDataState(getDefaultData());
  }, []);

  return (
    <SiteDataContext.Provider
      value={{
        data,
        isLoaded,
        setData,
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
