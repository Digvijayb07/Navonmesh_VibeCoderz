import { Sidebar } from "./sidebar";
import { TopNav } from "./top-nav";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 pattern-dots opacity-40 pointer-events-none" />

      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <TopNav />
        <main className="flex-1 overflow-y-auto gradient-subtle">
          {children}
        </main>
      </div>
    </div>
  );
}
