import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Search, Filter } from 'lucide-react';
import { DashboardStats } from '@/components/DashboardStats';
import { UpcomingAppointments } from '@/components/UpcomingAppointments';

export default async function DashboardHome({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const greeting = locale === 'es' ? 'Buenos días, Admin' : 'Good morning, Admin';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">{greeting}</h1>
          <p className="text-slate-400 mt-1">{locale === 'es' ? 'Aquí tienes el resumen de tu clínica hoy.' : 'Here is your clinic overview for today.'}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder={locale === 'es' ? 'Buscar...' : 'Search...'} 
              className="pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-200 placeholder-slate-500 w-full md:w-64 backdrop-blur-sm"
            />
          </div>
          <button className="p-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <DashboardStats />
      <UpcomingAppointments />
    </div>
  );
}
