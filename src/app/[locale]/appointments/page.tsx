'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { CreateAppointmentModal } from '@/components/CreateAppointmentModal';
import { AppointmentsTable } from '@/components/AppointmentsTable';
import { useLocale } from 'next-intl';
import { useAppointments } from '@/hooks/useAppointments';

export default function AppointmentsPage() {
  const locale = useLocale();
  const isEs = locale === 'es';
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // React Query Fetcher (Cache, Stale time & Refetching managed automatically)
  const { data: appointments = [], isLoading } = useAppointments();

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

      <AppointmentsTable 
        appointments={appointments} 
        isLoading={isLoading} 
      />

      <CreateAppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        locale={locale} 
      />
    </div>
  );
}
