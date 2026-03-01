'use client';

import { MoreVertical } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import clsx from 'clsx';

export function UpcomingAppointments() {
  const locale = useLocale();
  const isEs = locale === 'es';
  const tType = useTranslations('Type');
  const tStatus = useTranslations('Status');

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
    <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-slate-800/60 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          {isEs ? 'Agenda de Hoy' : "Today's Schedule"}
        </h2>
        <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">
          {isEs ? 'Ver todo' : 'View all'}
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/60 bg-slate-800/20 text-slate-400 text-sm">
              <th className="px-6 py-4 font-medium">{isEs ? 'Paciente' : 'Patient'}</th>
              <th className="px-6 py-4 font-medium">{isEs ? 'Hora Programada' : 'Scheduled Time'}</th>
              <th className="px-6 py-4 font-medium">{isEs ? 'Tipo' : 'Type'}</th>
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
  );
}
