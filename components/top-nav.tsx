'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function TopNav() {
  const [searchQuery, setSearchQuery] = useState('');

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
          <button className="relative p-2 hover:bg-secondary rounded-lg transition-colors" title="Notifications">
            <span className="text-xl">🔔</span>
            <div className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </button>

          {/* Messages */}
          <button className="p-2 hover:bg-secondary rounded-lg transition-colors" title="Messages">
            <span className="text-xl">💬</span>
          </button>

          {/* User Menu */}
          <button className="flex items-center gap-2 px-3 py-2 hover:bg-secondary rounded-lg transition-colors" title="User Menu">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              F
            </div>
            <span className="text-sm font-medium text-foreground">Farmer Account</span>
          </button>
        </div>
      </div>
    </header>
  );
}
