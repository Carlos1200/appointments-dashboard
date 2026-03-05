'use client';

import { Calendar, LayoutDashboard, Settings, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { usePathname, Link } from '@/i18n/routing';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { supabase } from '@/lib/supabase/client';
import { usePermissions } from '@/hooks/usePermissions';

const NAV_ITEMS = [
  { nameKey: 'home', href: '/', icon: LayoutDashboard },
  { nameKey: 'appointments', href: '/appointments', icon: Calendar },
  { nameKey: 'settings', href: '/settings', icon: Settings },
];

export function Sidebar({ isMobileOpen, setIsMobileOpen }: { isMobileOpen: boolean, setIsMobileOpen: (v: boolean) => void }) {
  const pathname = usePathname();
  const t = useTranslations('Sidebar');
  const locale = useLocale();
  const { data: permissions = [] } = usePermissions();

  const isAdmin = permissions.includes('manage_all_appointments');

  const filteredNavItems = NAV_ITEMS.filter(item => {
    if (item.href === '/settings') return isAdmin;
    return true;
  });

  const handleLinkClick = () => {
    if (isMobileOpen) setIsMobileOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = `/${locale}/login`;
  };

  const navContent = (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 w-64 pt-6">
      <div className="px-6 mb-8 flex items-center justify-between md:justify-center">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
          {t('title')}
        </h1>
        {isMobileOpen && (
          <button onClick={() => setIsMobileOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {filteredNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href) && (item.href !== '/' || pathname === '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href as any}
              onClick={handleLinkClick}
              className={clsx(
                'flex items-center px-4 py-3 rounded-xl transition-all duration-200 group',
                isActive
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)] '
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              )}
            >
              <Icon
                className={clsx(
                  'w-5 h-5 mr-3 transition-colors',
                  isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
                )}
              />
              <span className="font-medium">{t(item.nameKey as any)}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
              AD
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-200">{t('role')}</span>
              <span className="text-xs text-slate-500">{t('practice')}</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
            title={locale === 'es' ? 'Cerrar Sesión' : 'Log out'}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:block h-screen sticky top-0">
        {navContent}
      </div>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="h-full w-64 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {navContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
