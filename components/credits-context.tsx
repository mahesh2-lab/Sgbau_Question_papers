"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { useUser } from "@clerk/nextjs";
import { publicSupabase } from "@/lib/publicsupabase";

type CreditsContextType = {
  credits: number;
  setCredits: (credits: number) => void; // still expose for imperative updates
  refreshCredits: (opts?: { force?: boolean }) => Promise<void>;
  loading: boolean;
  error: string | null;
};

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export const CreditsProvider = ({ children }: { children: ReactNode }) => {
  const { user, isSignedIn } = useUser();
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshCredits = useCallback(
    async ({ force = false }: { force?: boolean } = {}) => {
      if (!isSignedIn || !user) return;
      if (!force && credits !== 0) return; // avoid redundant fetch unless forced
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/credits", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(data?.error || "Failed to fetch credits");
        }
        if (typeof data?.credits === "number") {
          setCredits(data.credits);
        } else if (typeof data?.["credits"] === "number") {
          setCredits(data["credits"]);
        } else {
          // fallback to 0 if shape unexpected
          setCredits(0);
        }
      } catch (e: any) {
        setError(e?.message || "Error loading credits");
      } finally {
        setLoading(false);
      }
    },
    [isSignedIn, user, credits]
  );

  // Initial fetch
  useEffect(() => {
    refreshCredits({ force: true });
  }, [refreshCredits]);

  // Realtime subscription to profile row (credits changes)
  useEffect(() => {
    if (!publicSupabase || !user?.id) return;
    // Guard: only subscribe if env keys configured (runtime safe)
    try {
      const channel = publicSupabase
        .channel("realtime:profiles:credits")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "profiles",
            filter: `id=eq.${user.id}`,
          },
          (payload: any) => {
            const next = payload?.new?.credits;
            if (typeof next === "number") {
              setCredits(next);
            }
          }
        )
        .subscribe((status: string) => {
          if (status === "SUBSCRIBED") {
            // Optionally force refresh once subscribed to ensure latest
            refreshCredits({ force: true });
          }
        });
      return () => {
        channel?.unsubscribe();
      };
    } catch (err) {
      console.warn("Realtime subscription setup failed", err);
    }
  }, [user?.id, refreshCredits]);

  // Listen for manual broadcast events (e.g., after server actions navigation)
  useEffect(() => {
    const handler = () => refreshCredits({ force: true });
    window.addEventListener("credits-updated", handler);
    return () => window.removeEventListener("credits-updated", handler);
  }, [refreshCredits]);

  return (
    <CreditsContext.Provider
      value={{ credits, setCredits, refreshCredits, loading, error }}
    >
      {children}
    </CreditsContext.Provider>
  );
};

export const useCredits = () => {
  const context = useContext(CreditsContext);
  if (!context) {
    throw new Error("useCredits must be used within a CreditsProvider");
  }
  return context;
};

// Utility to imperatively ask all listeners to refresh (alternative to returning new credits from an API)
export const notifyCreditsUpdated = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("credits-updated"));
  }
};
