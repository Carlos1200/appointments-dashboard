'use client';

import { MoreVertical } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import clsx from 'clsx';
import { useState } from 'react';
import { Appointment } from '@/hooks/useAppointments';
import { AppointmentActions } from './AppointmentActions';
import { PatientSlideOver } from './PatientSlideOver';

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  isLoading: boolean;
  searchTerm: string;
}

export function UpcomingAppointments({ appointments, isLoading, searchTerm }: UpcomingAppointmentsProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const locale = useLocale();
  const isEs = locale === 'es';
  const tType = useTranslations('Type');
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

  // Filtrar si hay searchTerm
  const filtered = appointments.filter((apt) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    const fullName = `${apt.patients?.first_name || ''} ${apt.patients?.last_name || ''}`.trim();
    return (
      fullName.toLowerCase().includes(s) ||
      apt.source?.toLowerCase().includes(s)
    );
  });

  return (
    <>
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
              <th className="px-6 py-4 font-medium">{isEs ? 'Fuente' : 'Source'}</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <span className="w-6 h-6 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin mb-4" />
                    {isEs ? 'Cargando agenda...' : 'Loading schedule...'}
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  {isEs ? 'No hay citas para mostrar.' : 'No appointments to show.'}
                </td>
              </tr>
            ) : (
              filtered.map((apt) => {
                let color = 'cyan';
                if(apt.status === 'confirmed') color = 'emerald';
                if(apt.status === 'pending') color = 'amber';
                if(apt.status === 'cancelled') color = 'rose';

                const fullName = `${apt.patients?.first_name || ''} ${apt.patients?.last_name || ''}`.trim() || 'Unknown';
                const initials = fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

                return (
                  <tr key={apt.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div 
                        className="flex items-center cursor-pointer group/patient"
                        onClick={() => setSelectedPatientId(apt.patient_id)}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-xs font-bold text-white shadow-inner mr-3 group-hover/patient:ring-2 ring-blue-500 transition-all">
                          {initials}
                        </div>
                        <span className="font-medium text-slate-200 group-hover/patient:text-blue-400 transition-colors underline-offset-4 group-hover/patient:underline">{fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-medium">
                      {apt.time}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {apt.source || 'Manual'}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(tStatus(apt.status || 'in_progress'), color)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <AppointmentActions appointment={apt} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      </div>
      <PatientSlideOver 
        isOpen={!!selectedPatientId} 
        onClose={() => setSelectedPatientId(null)} 
        patientId={selectedPatientId}
        appointments={appointments}
      />
    </>
  );
}
