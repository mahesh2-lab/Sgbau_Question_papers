"use client";

import React, { useEffect } from "react";
import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  Wrench,
  Rocket,
  GraduationCap,
  Calendar,
  Trophy,
  ScrollText,
} from "lucide-react";
import { type Notification } from "@/lib/notifications";
import { cn } from "@/lib/utils";

const severityStyles: Record<NonNullable<Notification["severity"]>, string> = {
  Info: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  Warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  Critical: "bg-red-500/10 text-red-400 border-red-500/30",
  Error: "bg-red-500/10 text-red-400 border-red-500/30",
};

const categoryIcon: Record<string, React.ReactNode> = {
  exam: <Calendar className="w-4 h-4" />,
  results: <Trophy className="w-4 h-4" />,
  academic: <GraduationCap className="w-4 h-4" />,
  scholarship: <ScrollText className="w-4 h-4" />,
  maintenance: <Wrench className="w-4 h-4" />,
  notice: <Rocket className="w-4 h-4" />,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/notifications");
        if (!res.ok) {
          throw new Error("Failed to fetch notifications");
        }
        const data = await res.json();
        // Sort by createdAt descending
        setNotifications(
          Array.isArray(data)
            ? data.sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
            : []
        );
      } catch (err: any) {
        setError(err?.message || "Error fetching notifications");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  // const notifications = notificationsMock.sort(
  //   (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  // );

  return (
    <div className="p-6 max-w-4xl mx-auto text-gray-200 h-full flex flex-col">
      <div className="mb-8 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-indigo-500/40">
          <Bell className="w-6 h-6 text-indigo-300" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-gray-400 mt-1">
            System updates, features, maintenance and security information.
          </p>
        </div>
      </div>

      <div
        className="space-y-4 overflow-y-auto pr-2 custom-scroll flex-1"
        style={{ maxHeight: "calc(100vh - 180px)" }}
      >
        <div className="space-y-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="relative rounded-xl border border-gray-800/80 bg-gray-900/60 backdrop-blur-sm p-4 transition-colors animate-pulse"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800/70 border border-gray-700/50">
                      <div className="w-4 h-4 bg-gray-700 rounded" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <div className="h-4 w-32 bg-gray-700 rounded mb-1" />
                        <span className="h-3 w-12 bg-gray-800 rounded" />
                        <span className="h-3 w-16 bg-gray-800 rounded" />
                      </div>
                      <div className="h-3 w-full bg-gray-800 rounded mb-2" />
                      <div className="h-3 w-2/3 bg-gray-800 rounded mb-2" />
                      <div className="mt-3 flex items-center gap-2 text-[11px]">
                        <span className="h-3 w-20 bg-gray-700 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "relative rounded-xl border border-gray-800/80 bg-gray-900/60 backdrop-blur-sm p-4 transition-colors"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800/70 border border-gray-700/50">
                      {categoryIcon[n.category] || <Bell className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h2 className="font-semibold text-base leading-tight text-white">
                          {n.title}
                        </h2>
                        {n.severity && (
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                              severityStyles[n.severity]
                            )}
                          >
                            {n.severity}
                          </span>
                        )}
                        <span className="text-[11px] uppercase tracking-wide text-gray-500 font-medium">
                          {n.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                        {n.message}
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-[11px] text-gray-500">
                        <time dateTime={n.createdAt}>
                          {new Date(n.createdAt).toLocaleString()}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-20 border border-dashed border-gray-700 rounded-xl bg-gray-900/40">
          <Bell className="w-10 h-10 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">No notifications yet.</p>
        </div>
      )}

      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.3);
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.45);
        }
      `}</style>
    </div>
  );
}
