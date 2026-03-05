'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Menu, Loader2, ShieldAlert } from 'lucide-react';
import { useCurrentProfile } from '@/hooks/useProfiles';
import { useLocale } from 'next-intl';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { data: profile, isLoading } = useCurrentProfile();
  const locale = useLocale();
  const isEs = locale === 'es';

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

        <main className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto flex flex-col">
          {isLoading ? (
             <div className="flex-1 flex items-center justify-center">
               <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
             </div>
          ) : profile && !profile.role_id ? (
             <div className="flex-1 flex items-center justify-center p-4">
               <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 text-center animate-in zoom-in-95 duration-500 shadow-2xl">
                 <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                   <ShieldAlert className="w-8 h-8 text-amber-500" />
                 </div>
                 <h2 className="text-2xl font-bold text-white mb-3">
                   {isEs ? 'Acceso Pendiente' : 'Access Pending'}
                 </h2>
                 <p className="text-slate-400 mb-6 leading-relaxed">
                   {isEs 
                     ? 'Tu cuenta ha sido creada exitosamente, pero un administrador aún debe asignarte un Rol y Permisos para que puedas acceder al sistema.'
                     : 'Your account has been successfully created, but an administrator still needs to assign you a Role and Permissions before you can access the system.'}
                 </p>
                 <div className="bg-slate-950/50 border border-slate-800/60 rounded-xl p-4">
                   <p className="text-sm font-medium text-slate-300">
                     {isEs ? '¿Qué sigue?' : 'What\'s next?'}
                   </p>
                   <p className="text-xs text-slate-500 mt-1">
                     {isEs 
                       ? 'Comunícate con el dueño de la clínica o el máster admin para que actualice tu perfil en la sección de Equipo.'
                       : 'Contact the clinic owner or master admin so they can update your profile in the Team section.'}
                   </p>
                 </div>
               </div>
             </div>
          ) : (
             children
          )}
        </main>
      </div>
    </div>
  );
}
