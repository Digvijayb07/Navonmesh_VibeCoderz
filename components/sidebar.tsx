"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

const menuItems = [
  {
    icon: "📊",
    label: "Dashboard",
    href: "/",
    color: "#2563eb",
    svgIcon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    icon: "👤",
    label: "My Profile",
    href: "/profile",
    color: "#8b5cf6",
    svgIcon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    icon: "🛒",
    label: "Marketplace",
    href: "/marketplace",
    color: "#16a34a",
    svgIcon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2L3 7v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-3-5z" />
        <line x1="3" y1="7" x2="21" y2="7" />
        <path d="M16 11a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    icon: "🤝",
    label: "Exchange",
    href: "/exchange",
    color: "#ea580c",
    svgIcon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
  },
  {
    icon: "🚚",
    label: "Logistics",
    href: "/logistics",
    color: "#dc2626",
    svgIcon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    icon: "📈",
    label: "Market Prices",
    href: "/market-prices",
    color: "#059669",
    svgIcon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    icon: "⭐",
    label: "Trust Profile",
    href: "/trust-profile",
    color: "#d97706",
    svgIcon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    icon: "⚖️",
    label: "Disputes",
    href: "/disputes",
    color: "#6366f1",
    svgIcon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3v18" />
        <path d="M5 6l7-3 7 3" />
        <path d="M2 12l3-6 3 6" />
        <path d="M16 12l3-6 3 6" />
      </svg>
    ),
  },
  {
    icon: "⚙️",
    label: "Settings",
    href: "/settings",
    color: "#64748b",
    svgIcon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [trustScore, setTrustScore] = useState<number | null>(null);
  const [role, setRole] = useState<string>("Farmer");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("trust_score, role")
        .eq("id", data.user.id)
        .single();
      if (profile) {
        setTrustScore(profile.trust_score ?? 50);
        if (profile.role)
          setRole(profile.role.charAt(0).toUpperCase() + profile.role.slice(1));
      }
    });
  }, []);

  const scoreDisplay = trustScore !== null ? (trustScore / 20).toFixed(1) : "—";

  return (
    <aside className="w-64 glass-sidebar flex flex-col h-screen relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 pattern-dots opacity-30 pointer-events-none" />

      {/* Logo */}
      <div className="p-6 border-b border-green-200/20 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-lg shadow-green-500/20">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <h1
              className="font-bold text-lg text-green-900 leading-tight tracking-tight"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              FarmLink
            </h1>
            <p className="text-[11px] text-green-600/60 leading-tight">
              Agricultural Exchange
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 relative z-10">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group",
                isActive
                  ? "sidebar-item-active"
                  : "text-green-800/70 sidebar-item-hover",
              )}
            >
              <span
                className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200"
                style={{
                  backgroundColor: isActive
                    ? "rgba(255,255,255,0.2)"
                    : `${item.color}12`,
                  color: isActive ? "white" : item.color,
                }}
              >
                {item.svgIcon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-green-200/20 relative z-10">
        <div className="glass-card rounded-xl p-3 text-center">
          <div className="flex items-center gap-3 justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {role.charAt(0)}
            </div>
            <div className="text-left">
              <p className="text-[11px] text-green-700/60">
                Connected as {role}
              </p>
              <p className="text-xs font-semibold gradient-text">
                Trust Score: {scoreDisplay}/5
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
