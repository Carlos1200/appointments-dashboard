import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Calendar, CheckCircle2, PhoneCall, TrendingUp, MoreVertical, Search, Filter } from 'lucide-react';
import clsx from 'clsx';

export default async function DashboardHome({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Dashboard');
  const tStatus = await getTranslations('Status');
  const tType = await getTranslations('Type');
  const greeting = locale === 'es' ? 'Buenos días, Admin' : 'Good morning, Admin';

  const stats = [
    {
      title: locale === 'es' ? 'Citas de Hoy' : 'Today\'s Appointments',
      value: '24',
      trend: '+12%',
      trendUp: true,
      icon: Calendar,
      color: 'blue'
    },
    {
      title: locale === 'es' ? 'Tasa de Éxito Semanal' : 'Weekly Success Rate',
      value: '94%',
      trend: '+2.4%',
      trendUp: true,
      icon: TrendingUp,
      color: 'emerald'
    },
    {
      title: locale === 'es' ? 'Agentes RetellAI Activos' : 'Active RetellAI Agents',
      value: '4',
      status: locale === 'es' ? 'Corriendo' : 'Running',
      icon: PhoneCall,
      color: 'indigo'
    }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      patient: 'Sarah Jenkins',
      initials: 'SJ',
      time: '09:00 AM',
      type: tType('check_up'),
      status: tStatus('in_progress'),
      color: 'cyan'
    },
    {
      id: 2,
      patient: 'Michael Chen',
      initials: 'MC',
      time: '10:30 AM',
      type: tType('consultation'),
      status: tStatus('confirmed'),
      color: 'emerald'
    },
    {
      id: 3,
      patient: 'Emma Thompson',
      initials: 'ET',
      time: '11:15 AM',
      type: tType('follow_up'),
      status: tStatus('pending'),
      color: 'amber'
    },
    {
      id: 4,
      patient: 'James Wilson',
      initials: 'JW',
      time: '01:00 PM',
      type: tType('test_results'),
      status: tStatus('confirmed'),
      color: 'emerald'
    }
  ];

  const getStatusBadge = (status: string, color: string) => {
    const colorClasses: Record<string, string> = {
      cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    };

    return (
      <span className={clsx('px-3 py-1 rounded-full text-xs font-medium border flex items-center w-fit', colorClasses[color] || 'bg-slate-500/10 text-slate-400')}>
        <span className={clsx('w-1.5 h-1.5 rounded-full mr-2', `bg-${color}-400`)}></span>
        {status}
      </span>
    );
  };

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

      <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800/60 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {locale === 'es' ? 'Agenda de Hoy' : 'Today\'s Schedule'}
          </h2>
          <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">
            {locale === 'es' ? 'Ver todo' : 'View all'}
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/60 bg-slate-800/20 text-slate-400 text-sm">
                <th className="px-6 py-4 font-medium">{locale === 'es' ? 'Paciente' : 'Patient'}</th>
                <th className="px-6 py-4 font-medium">{locale === 'es' ? 'Hora Programada' : 'Scheduled Time'}</th>
                <th className="px-6 py-4 font-medium">{locale === 'es' ? 'Tipo' : 'Type'}</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {upcomingAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-xs font-bold text-white shadow-inner mr-3 group-hover:ring-2 ring-slate-700 transition-all">
                        {apt.initials}
                      </div>
                      <span className="font-medium text-slate-200">{apt.patient}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300 font-medium">
                    {apt.time}
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {apt.type}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(apt.status, apt.color)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-500 hover:text-slate-300 p-1 rounded-md hover:bg-slate-800 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
