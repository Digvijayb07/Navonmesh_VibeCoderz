'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export function TopNav() {
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // Get current session user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Derive display name and avatar letter from user metadata or email
  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Account';

  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <header className="bg-background border-b border-border sticky top-0 z-40 shadow-sm">
      <div className="h-16 px-6 flex items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <Input
            type="search"
            placeholder="Search crops, prices, buyers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button
            className="relative p-2 hover:bg-secondary rounded-lg transition-colors"
            title="Notifications"
          >
            <span className="text-xl">🔔</span>
            <div className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </button>

          {/* Messages */}
          <button
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            title="Messages"
          >
            <span className="text-xl">💬</span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              className="flex items-center gap-2 px-3 py-2 hover:bg-secondary rounded-lg transition-colors"
              title="User Menu"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                {avatarLetter}
              </div>
              <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                {displayName}
              </span>
              <span className="text-xs text-muted-foreground">▾</span>
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-1 z-50">
                {user?.email && (
                  <div className="px-4 py-2 text-xs text-muted-foreground truncate border-b border-border">
                    {user.email}
                  </div>
                )}
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-secondary transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close menu on outside click */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
}
