'use client';

import { Calendar, TrendingUp, PhoneCall } from 'lucide-react';
import { useLocale } from 'next-intl';
import clsx from 'clsx';

export function DashboardStats() {
  const locale = useLocale();
  const isEs = locale === 'es';

  // Estos datos podrían venir de un custom hook también (ej: useStats())
  const stats = [
    {
      title: isEs ? 'Citas de Hoy' : "Today's Appointments",
      value: '24',
      trend: '+12%',
      trendUp: true,
      icon: Calendar,
      color: 'blue'
    },
    {
      title: isEs ? 'Tasa de Éxito Semanal' : 'Weekly Success Rate',
      value: '94%',
      trend: '+2.4%',
      trendUp: true,
      icon: TrendingUp,
      color: 'emerald'
    },
    {
      title: isEs ? 'Agentes RetellAI Activos' : 'Active RetellAI Agents',
      value: '4',
      status: isEs ? 'Corriendo' : 'Running',
      icon: PhoneCall,
      color: 'indigo'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        const bgColors: Record<string, string> = {
          blue: 'from-blue-600/20 to-blue-600/5 border-blue-500/20',
          emerald: 'from-emerald-600/20 to-emerald-600/5 border-emerald-500/20',
          indigo: 'from-indigo-600/20 to-indigo-600/5 border-indigo-500/20',
        };
        
        const iconColors: Record<string, string> = {
          blue: 'text-blue-400 bg-blue-500/10',
          emerald: 'text-emerald-400 bg-emerald-500/10',
          indigo: 'text-indigo-400 bg-indigo-500/10',
        };

        return (
          <div key={i} className={clsx('relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 backdrop-blur-md', bgColors[stat.color])}>
            <div className="flex justify-between items-start mb-4">
              <div className={clsx('p-3 rounded-xl', iconColors[stat.color])}>
                <Icon className="w-6 h-6" />
              </div>
              {stat.trend && (
                <span className={clsx('text-xs font-medium px-2 py-1 rounded-full bg-slate-900/50', stat.trendUp ? 'text-emerald-400' : 'text-rose-400')}>
                  {stat.trend}
                </span>
              )}
              {stat.status && (
                <span className="flex items-center text-xs font-medium px-2 py-1 rounded-full bg-slate-900/50 text-indigo-400 border border-indigo-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-1.5 animate-pulse"></span>
                  {stat.status}
                </span>
              )}
            </div>
            <h3 className="text-slate-400 text-sm font-medium">{stat.title}</h3>
            <p className="text-3xl font-bold text-white mt-1 shadow-sm">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}
