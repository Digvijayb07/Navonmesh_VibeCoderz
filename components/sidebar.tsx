"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

const menuItems = [
  { icon: '📊', label: 'Dashboard', href: '/' },
  { icon: '👤', label: 'My Profile', href: '/profile' },
  { icon: '🛒', label: 'Marketplace', href: '/marketplace' },
  { icon: '🤝', label: 'Exchange', href: '/exchange' },
  { icon: '⭐', label: 'Trust Profile', href: '/trust-profile' },
  { icon: '⚖️', label: 'Disputes', href: '/disputes' },
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
