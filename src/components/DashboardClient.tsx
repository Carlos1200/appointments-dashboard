'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { useLocale } from 'next-intl';
import { DashboardStats } from '@/components/DashboardStats';
import { UpcomingAppointments } from '@/components/UpcomingAppointments';
import { DashboardCharts } from '@/components/DashboardCharts';
import { useAppointments } from '@/hooks/useAppointments';
import { usePermissions } from '@/hooks/usePermissions';
import { useProfiles } from '@/hooks/useProfiles';

interface DashboardClientProps {
  greeting: string;
  description: string;
}

export function DashboardClient({ greeting, description }: DashboardClientProps) {
  const locale = useLocale();
  const isEs = locale === 'es';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('all');

  // Fetch all appointments
  const { data: rawAppointments = [], isLoading } = useAppointments();
  
  // RBAC checks for Doctor Filtering
  const { data: permissions = [] } = usePermissions();
  const { data: profiles = [] } = useProfiles();
  const canManageAll = permissions.includes('manage_all_appointments');
  const doctors = profiles.filter(p => p.roles?.name === 'Doctor' || p.roles?.name === 'Admin');

  // Filter appointments if a specific doctor is selected (Only applies if canManageAll is true, otherwise RLS restricts data naturally)
  const allAppointments = (canManageAll && selectedDoctor !== 'all') 
    ? rawAppointments.filter(apt => apt.doctor_id === selectedDoctor)
    : rawAppointments;

  // Filter for today's appointments
  // Obtener fecha en formato YYYY-MM-DD localmente
  const today = new Date();
  const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

  const todayAppointments = allAppointments.filter(apt => {
      // If we selected 'unassigned', we need to check if doctor_id is null or empty
      if (canManageAll && selectedDoctor === 'unassigned') {
          return apt.date === todayStr && !apt.doctor_id;
      }
      return apt.date === todayStr;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">{greeting}</h1>
          <p className="text-slate-400 mt-1">{description}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder={isEs ? 'Buscar pacientes...' : 'Search patients...'} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-200 placeholder-slate-500 w-full md:w-64 backdrop-blur-sm"
            />
          </div>
          
          {canManageAll && (
              <div className="relative">
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="pl-4 pr-10 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-200 placeholder-slate-500 w-full md:w-48 backdrop-blur-sm appearance-none cursor-pointer"
                >
                  <option value="all">{isEs ? 'Todos los Doctores' : 'All Doctors'}</option>
                  <option value="unassigned">{isEs ? 'Sin Asignar' : 'Unassigned'}</option>
                  {doctors.map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.full_name || 'Dr.'}</option>
                  ))}
                </select>
              </div>
          )}

          <button className="p-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <DashboardStats appointments={todayAppointments} />
      <DashboardCharts appointments={allAppointments} />
      <UpcomingAppointments 
        appointments={todayAppointments} 
        isLoading={isLoading} 
        searchTerm={searchTerm} 
      />
    </div>
  );
}
