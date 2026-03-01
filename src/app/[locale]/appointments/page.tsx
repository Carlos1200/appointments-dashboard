'use client';

import { useState } from 'react';
import { Search, Filter, Plus, MoreVertical, PlusCircle } from 'lucide-react';
import { CreateAppointmentModal } from '@/components/CreateAppointmentModal';
import clsx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';

export default function AppointmentsPage() {
  const locale = useLocale();
  const isEs = locale === 'es';
  const tStatus = useTranslations('Status');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const appointments = [
    { id: 1, patient: 'Sarah Jenkins', initials: 'SJ', date: '2026-03-01', time: '09:00 AM', status: tStatus('in_progress'), color: 'cyan', source: 'Manual', srcColor: 'slate' },
    { id: 2, patient: 'Michael Chen', initials: 'MC', date: '2026-03-01', time: '10:30 AM', status: tStatus('confirmed'), color: 'emerald', source: 'RetellAI', srcColor: 'indigo' },
    { id: 3, patient: 'Emma Thompson', initials: 'ET', date: '2026-03-01', time: '11:15 AM', status: tStatus('pending'), color: 'amber', source: 'n8n', srcColor: 'pink' },
    { id: 4, patient: 'James Wilson', initials: 'JW', date: '2026-03-01', time: '01:00 PM', status: tStatus('confirmed'), color: 'emerald', source: 'Manual', srcColor: 'slate' },
    { id: 5, patient: 'Olivia Davis', initials: 'OD', date: '2026-03-02', time: '09:30 AM', status: tStatus('cancelled'), color: 'rose', source: 'RetellAI', srcColor: 'indigo' },
    { id: 6, patient: 'William Garcia', initials: 'WG', date: '2026-03-02', time: '14:00 PM', status: tStatus('pending'), color: 'amber', source: 'Manual', srcColor: 'slate' },
  ];

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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {isEs ? 'Todas las Citas' : 'All Appointments'}
          </h1>
          <p className="text-slate-400 mt-1">
            {isEs ? 'Gestiona todo tu calendario desde un solo lugar.' : 'Manage your entire calendar from one place.'}
          </p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all font-medium text-sm w-full md:w-auto"
        >
          <PlusCircle className="w-5 h-5" />
          {isEs ? 'Nueva Cita' : 'New Appointment'}
        </button>
      </div>

      <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-2xl">
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
              {appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-xs font-bold text-white shadow-inner mr-3 group-hover:ring-2 ring-slate-700 transition-all">
                        {apt.initials}
                      </div>
                      <span className="font-medium text-slate-200">{apt.patient}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {apt.date}
                  </td>
                  <td className="px-6 py-4 text-slate-300 font-medium">
                    {apt.time}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(apt.status, apt.color)}
                  </td>
                  <td className="px-6 py-4">
                    {getSourceBadge(apt.source, apt.srcColor)}
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

      <CreateAppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        locale={locale} 
      />
    </div>
  );
}
