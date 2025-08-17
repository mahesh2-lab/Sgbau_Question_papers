import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useCredits } from "@/components/credits-context";

interface SidebarCreditsProps {
  sidebarCollapsed: boolean;
}

export default function SidebarCredits({
  sidebarCollapsed,
}: SidebarCreditsProps) {
  const { user, isSignedIn } = useUser();
  const { credits, setCredits, refreshCredits } = useCredits();
  const [creditsLoading, setCreditsLoading] = useState<boolean>(false);
  const [creditsError, setCreditsError] = useState<string | null>(null);

  const fetchCredits = useCallback(
    async (force = false) => {
      if (!user) return;

      // Skip fetching if we already have credits in context and not forcing
      if (!force && credits != 0) return;

      setCreditsLoading(true);
      setCreditsError(null);

      try {
        const response = await fetch("/api/credits", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log("Fetched credits:", data);

        if (!response.ok) {
          throw new Error(data.error || "Error fetching credits");
        }

        // Handle empty / missing credits gracefully
        setCredits(typeof data?.credits === "number" ? data.credits : 0);
      } catch (error: any) {
        setCreditsError(error.message || "Error loading credits");
      } finally {
        setCreditsLoading(false);
      }
    },
    [user, credits, setCredits]
  );

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  return (
    <div className="p-2">
      <div className="bg-slate-800 rounded-lg shadow-sm p-3 flex flex-col items-start">
        {!sidebarCollapsed && (
          <div className="flex items-center justify-between mb-1 text-xs font-medium text-slate-300 w-full">
            <span className="pl-1">Credits</span>
            <Button
              variant="ghost"
              className="h-9 w-20 ml-2 px-3 py-2 transition-colors rounded-lg shadow hover:bg-emerald-600 active:bg-emerald-700 focus:ring-2 focus:ring-emerald-400 cursor-pointer flex items-center justify-center gap-2 font-semibold text-xs text-white"
              title="Sync"
              aria-label="Sync"
              onClick={() => refreshCredits({ force: true })}
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`w-5 h-5 mr-1 ${
                  creditsLoading ? "animate-spin" : ""
                }`}
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 6.707a1 1 0 0 1 0-1.414l2.829-2.829A8 8 0 1 1 2 10a1 1 0 1 1 2 0 6 6 0 1 0 1.757-4.243l-1.464 1.464a1 1 0 0 1-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Sync
            </Button>
          </div>
        )}
        <div className="w-full flex justify-center items-center">
          <div className="text-lg font-bold text-center text-emerald-400">
            {isSignedIn ? (creditsLoading ? "--" : credits) : 0}
          </div>
        </div>
        {!sidebarCollapsed && creditsError && (
          <div
            className="mt-1 text-xs text-rose-400 truncate max-w-[160px]"
            title={creditsError}
          >
            {creditsError}
          </div>
        )}
        {!sidebarCollapsed && !isSignedIn && (
          <div className="mt-1 text-xs text-slate-500">Sign in</div>
        )}
      </div>
    </div>
  );
}
