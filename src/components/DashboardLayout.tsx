'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0f1117] text-slate-200">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="md:hidden sticky top-0 z-30 flex items-center h-16 px-4 border-b border-slate-800/60 bg-[#0f1117]/80 backdrop-blur-md">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 -ml-2 text-slate-400 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
          >
            <Menu size={24} />
          </button>
          <span className="ml-4 font-semibold text-slate-200">Admin Dashboard</span>
        </header>

        <main className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
