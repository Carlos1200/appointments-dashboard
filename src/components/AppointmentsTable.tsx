'use client';

import { Search, MoreVertical } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import clsx from 'clsx';
import { Appointment } from '@/hooks/useAppointments';

interface AppointmentsTableProps {
  appointments: Appointment[];
  isLoading: boolean;
}

export function AppointmentsTable({ appointments, isLoading }: AppointmentsTableProps) {
  const locale = useLocale();
  const isEs = locale === 'es';
  const tStatus = useTranslations('Status');

  const getStatusBadge = (status: string, color: string) => {
    const colorClasses: Record<string, string> = {
      cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    };

    return (
      <span className={clsx('px-3 py-1 rounded-full text-xs font-medium border flex items-center w-fit', colorClasses[color] || 'bg-slate-500/10 text-slate-400')}>
        <span className={clsx('w-1.5 h-1.5 rounded-full mr-2', `bg-${color}-400`)}></span>
        {status}
      </span>
    );
  };

  const getSourceBadge = (source: string, color: string) => {
    const colorClasses: Record<string, string> = {
      slate: 'text-slate-400',
      indigo: 'text-indigo-400',
      pink: 'text-pink-400',
    };
    return (
      <span className={clsx('flex items-center text-sm font-medium', colorClasses[color] || 'text-slate-400')}>
        {source}
      </span>
    );
  };

  return (
    <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-2xl relative min-h-[300px]">
      <div className="p-4 md:p-6 border-b border-slate-800/60 flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder={isEs ? 'Buscar pacientes, fechas...' : 'Search patients, dates...'} 
            className="pl-10 pr-4 py-2 bg-slate-950/50 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-200 placeholder-slate-500 w-full"
          />
        </div>
        <div className="flex gap-3">
          <select className="px-4 py-2 bg-slate-950/50 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-300 appearance-none min-w-[120px]">
            <option value="">Status</option>
            <option value="Confirmed">{tStatus('confirmed')}</option>
            <option value="Pending">{tStatus('pending')}</option>
            <option value="Cancelled">{tStatus('cancelled')}</option>
          </select>
          <select className="px-4 py-2 bg-slate-950/50 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-300 appearance-none min-w-[120px]">
            <option value="">{isEs ? 'Fuente' : 'Source'}</option>
            <option value="Manual">Manual</option>
            <option value="RetellAI">RetellAI</option>
            <option value="n8n">n8n</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/60 bg-slate-800/20 text-slate-400 text-sm">
              <th className="px-6 py-4 font-medium">{isEs ? 'Paciente' : 'Patient'}</th>
              <th className="px-6 py-4 font-medium">{isEs ? 'Fecha' : 'Date'}</th>
              <th className="px-6 py-4 font-medium">{isEs ? 'Hora' : 'Time'}</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">{isEs ? 'Fuente' : 'Source'}</th>
              <th className="px-6 py-4 font-medium text-right">{isEs ? 'Acciones' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <span className="w-8 h-8 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin mb-4" />
                    {isEs ? 'Cargando citas...' : 'Loading appointments...'}
                  </div>
                </td>
              </tr>
            ) : appointments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  {isEs ? 'No hay citas registradas.' : 'No appointments scheduled.'}
                </td>
              </tr>
            ) : (
              appointments.map((apt) => {
                let color = 'cyan';
                if(apt.status === 'confirmed') color = 'emerald';
                if(apt.status === 'pending') color = 'amber';
                if(apt.status === 'cancelled') color = 'rose';
                
                let srcColor = 'slate';
                if(apt.source === 'RetellAI') srcColor = 'indigo';
                if(apt.source === 'n8n') srcColor = 'pink';

                const initials = apt.patient_name ? apt.patient_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : '??';

                return (
                  <tr key={apt.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-xs font-bold text-white shadow-inner mr-3 group-hover:ring-2 ring-slate-700 transition-all">
                          {initials}
                        </div>
                        <span className="font-medium text-slate-200">{apt.patient_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {apt.date}
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-medium">
                      {apt.time}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(tStatus(apt.status || 'in_progress'), color)}
                    </td>
                    <td className="px-6 py-4">
                      {getSourceBadge(apt.source || 'Manual', srcColor)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-500 hover:text-slate-300 p-1 rounded-md hover:bg-slate-800 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
