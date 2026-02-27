'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: '📊', label: 'Dashboard', href: '/' },
  { icon: '🛒', label: 'Marketplace', href: '/marketplace' },
  { icon: '🤝', label: 'Exchange', href: '/exchange' },
  { icon: '🚚', label: 'Logistics', href: '/logistics' },
  { icon: '📈', label: 'Market Prices', href: '/market-prices' },
  { icon: '⭐', label: 'Trust Profile', href: '/trust-profile' },
  { icon: '📊', label: 'Analytics', href: '/analytics' },
  { icon: '⚖️', label: 'Disputes', href: '/disputes' },
  { icon: '⚙️', label: 'Settings', href: '/settings' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🌾</div>
          <div>
            <h1 className="font-bold text-lg text-sidebar-foreground">FarmLink</h1>
            <p className="text-xs text-sidebar-foreground/60">Agricultural Exchange</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="bg-sidebar-accent/20 rounded-lg p-3 text-center">
          <p className="text-xs text-sidebar-foreground/70">
            Connected as Farmer
          </p>
          <p className="text-xs font-semibold text-sidebar-foreground mt-1">
            Trust Score: 4.8/5
          </p>
        </div>
      </div>
    </aside>
  );
}
