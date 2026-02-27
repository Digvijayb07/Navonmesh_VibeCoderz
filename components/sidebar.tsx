"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

const menuItems = [
  { icon: "📊", label: "Dashboard", href: "/" },
  { icon: "👤", label: "My Profile", href: "/profile" },
  { icon: "🛒", label: "Marketplace", href: "/marketplace" },
  { icon: "🤝", label: "Exchange", href: "/exchange" },
  { icon: "⭐", label: "Trust Profile", href: "/trust-profile" },
  { icon: "⚖️", label: "Disputes", href: "/disputes" },
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
      <div className="px-6 py-7 border-b border-green-200/20 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-lg shadow-green-500/20">
            <svg
              width="24"
              height="24"
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
              className="font-bold text-xl text-green-900 leading-tight tracking-tight"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Krishi Exchange
            </h1>
            <p className="text-xs text-green-600/60 leading-tight mt-0.5">
              Agricultural Marketplace
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5 relative z-10">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "sidebar-item-active"
                  : "text-green-800/70 sidebar-item-hover",
              )}
            >
              <span
                className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-colors duration-200"
                style={{
                  backgroundColor: isActive
                    ? "rgba(255,255,255,0.2)"
                    : `${item.color}12`,
                  color: isActive ? "white" : item.color,
                }}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-5 border-t border-green-200/20 relative z-10">
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="flex items-center gap-3 justify-center">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {role.charAt(0)}
            </div>
            <div className="text-left">
              <p className="text-xs text-green-700/60">Connected as {role}</p>
              <p className="text-sm font-semibold gradient-text">
                Trust Score: {scoreDisplay}/5
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
