"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";

interface Notification {
  id: string;
  user_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationBell({ userId }: { userId: string | null }) {
  const supabase = createClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setNotifications(data as Notification[]);
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Realtime subscription
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("notifications-bell")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Mark all as read
  const markAllRead = async () => {
    if (!userId) return;
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  return (
    <div className="relative" ref={ref}>
      <button
        className="relative p-2.5 rounded-xl hover:bg-green-50 transition-all duration-200 hover:shadow-sm"
        title="Notifications"
        onClick={() => setOpen((prev) => !prev)}>
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-400 text-white text-[10px] font-bold px-1 shadow-sm shadow-red-500/30 animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Mobile: Fixed positioning */}
          <div className="sm:hidden fixed left-2 right-2 top-16 w-auto bg-white rounded-2xl shadow-xl shadow-green-900/10 border border-green-200 z-[60] overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-green-200 bg-green-50">
              <span className="font-semibold text-sm text-green-900 whitespace-nowrap">
                Notifications
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-green-600 hover:text-green-700 hover:underline transition-colors whitespace-nowrap ml-4">
                  Mark all read
                </button>
              )}
            </div>

            {/* List - Horizontal Scroll */}
            <div className="overflow-x-auto overflow-y-hidden bg-white py-4">
              {notifications.length === 0 ? (
                <div className="py-6 text-center text-sm text-green-600/50">
                  No notifications yet
                </div>
              ) : (
                <div className="flex gap-3 px-4">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`flex-shrink-0 w-72 p-4 rounded-xl border transition-colors duration-200 ${
                        !n.is_read
                          ? "bg-green-50 border-green-200"
                          : "bg-white border-green-100 hover:bg-green-50/50"
                      }`}>
                      <p className="text-sm text-green-900 break-words whitespace-normal line-clamp-3">
                        {n.message}
                      </p>
                      <p className="text-xs text-green-600/60 mt-2 whitespace-nowrap">
                        {timeAgo(n.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop: Absolute positioning below bell */}
          <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[600px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl shadow-green-900/10 border border-green-200 z-[60] overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-green-200 bg-green-50">
              <span className="font-semibold text-sm text-green-900 whitespace-nowrap">
                Notifications
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-green-600 hover:text-green-700 hover:underline transition-colors whitespace-nowrap ml-4">
                  Mark all read
                </button>
              )}
            </div>

            {/* List - Horizontal Scroll */}
            <div className="overflow-x-auto overflow-y-hidden bg-white py-4">
              {notifications.length === 0 ? (
                <div className="py-6 text-center text-sm text-green-600/50">
                  No notifications yet
                </div>
              ) : (
                <div className="flex gap-3 px-4">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`flex-shrink-0 w-72 p-4 rounded-xl border transition-colors duration-200 ${
                        !n.is_read
                          ? "bg-green-50 border-green-200"
                          : "bg-white border-green-100 hover:bg-green-50/50"
                      }`}>
                      <p className="text-sm text-green-900 break-words whitespace-normal line-clamp-3">
                        {n.message}
                      </p>
                      <p className="text-xs text-green-600/60 mt-2 whitespace-nowrap">
                        {timeAgo(n.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
