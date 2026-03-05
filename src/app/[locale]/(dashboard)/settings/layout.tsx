'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { Settings, Shield, Users, Network, ChevronLeft } from 'lucide-react';
import clsx from 'clsx';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const t = useTranslations('Settings');
  const pathname = usePathname();

  const isEs = locale === 'es';

  const menuItems = [
    {
      name: isEs ? 'General' : 'General',
      href: '/settings',
      icon: Settings,
      // isActive strictly if it's exactly /settings, since other routes are /settings/*
      isActive: pathname === '/settings',
    },
    {
      name: isEs ? 'Roles y Permisos' : 'Roles & Permissions',
      href: '/settings/roles',
      icon: Shield,
      isActive: pathname.includes('/settings/roles'),
    },
    {
      name: isEs ? 'Equipo' : 'Team',
      href: '/settings/team',
      icon: Users,
      isActive: pathname.includes('/settings/team'),
    },
    {
      name: isEs ? 'Integraciones' : 'Integrations',
      href: '/settings/integrations',
      icon: Network,
      isActive: pathname.includes('/settings/integrations'),
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 relative z-10 w-full animate-in fade-in duration-500">
      
      {/* Sidebar Navigation */}
        <div className="w-full lg:w-72 flex-shrink-0 animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="mb-6">
            <Link 
              href="/appointments"
              className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              {isEs ? 'Volver al Dashboard' : 'Back to Dashboard'}
            </Link>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-medium",
                    item.isActive
                      ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                      : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200 border border-transparent"
                  )}
                >
                  <Icon className={clsx("w-5 h-5", item.isActive ? "text-indigo-400" : "text-slate-500")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Nested Page Content Area */}
        <div className="flex-1 min-w-0">
          <div className="bg-[#0f1117] md:border border-slate-800/80 md:bg-slate-900/40 md:backdrop-blur-xl md:rounded-3xl p-4 md:p-8 min-h-[600px]">
            {children}
          </div>
        </div>

    </div>
  );
}
