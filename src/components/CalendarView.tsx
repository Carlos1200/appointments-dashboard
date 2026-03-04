'use client';

import { useState, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { 
  format, 
  startOfWeek, 
  addDays, 
  parse, 
  isSameDay, 
  isToday,
  addWeeks,
  subWeeks
} from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import clsx from 'clsx';
import { Appointment } from '@/hooks/useAppointments';
import { AppointmentActions } from './AppointmentActions';
import { PatientSlideOver } from './PatientSlideOver';

interface CalendarViewProps {
  appointments: Appointment[];
  isLoading: boolean;
}

const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM

export function CalendarView({ appointments, isLoading }: CalendarViewProps) {
  const locale = useLocale();
  const isEs = locale === 'es';
  const dateFnsLocale = isEs ? es : enUS;
  const tStatus = useTranslations('Status');

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const handlePreviousWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const handleNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

  // Generate the 7 days of the currently viewed week
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  // Map appointments to cells
  const getAppointmentsForDayAndHour = (date: Date, hour: number) => {
    return appointments.filter(apt => {
      if (!apt.date || !apt.time) return false;
      
      const aptDate = parse(apt.date, 'yyyy-MM-dd', new Date());
      const aptHour = parseInt(apt.time.split(':')[0], 10);
      
      return isSameDay(aptDate, date) && aptHour === hour;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'pending': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'cancelled': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default: return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    }
  };

  return (
    <>
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-xl flex flex-col h-[800px]">
        
        {/* Calendar Header Constraints */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/80">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-white capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: dateFnsLocale })}
          </h2>
          <div className="flex bg-slate-950/50 rounded-lg p-1 border border-slate-800">
            <button 
              onClick={handlePreviousWeek}
              className="p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={handleToday}
              className="px-3 py-1 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            >
              {isEs ? 'Hoy' : 'Today'}
            </button>
            <button 
              onClick={handleNextWeek}
              className="p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {isLoading && (
          <div className="flex items-center text-sm text-slate-400 gap-2">
            <span className="w-4 h-4 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin" />
            {isEs ? 'Actualizando...' : 'Updating...'}
          </div>
        )}
      </div>

      {/* Grid Layout Container */}
      <div className="flex-1 overflow-auto bg-slate-950/30">
        <div className="min-w-[800px] h-full flex flex-col">
          
          {/* Days Header */}
          <div className="grid grid-cols-8 border-b border-slate-800/80 sticky top-0 z-20 bg-slate-900/95 backdrop-blur-md">
            <div className="py-3 px-2 border-r border-slate-800/80"></div>
            {weekDays.map(day => (
              <div 
                key={day.toISOString()} 
                className={clsx(
                  "py-3 px-2 text-center border-r border-slate-800/80 flex flex-col items-center justify-center gap-1",
                  isToday(day) && "bg-blue-500/5"
                )}
              >
                <span className={clsx(
                  "text-xs font-medium uppercase",
                  isToday(day) ? "text-blue-400" : "text-slate-500"
                )}>
                  {format(day, 'EEE', { locale: dateFnsLocale })}
                </span>
                <span className={clsx(
                  "w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold",
                  isToday(day) ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "text-slate-300"
                )}>
                  {format(day, 'd')}
                </span>
              </div>
            ))}
          </div>

          {/* Time Grid */}
          <div className="flex-1 relative">
            {HOURS.map(hour => (
              <div key={hour} className="grid grid-cols-8 border-b border-slate-800/40 min-h-[100px] group">
                {/* Time Axis Column */}
                <div className="p-2 border-r border-slate-800/80 text-right sticky left-0 bg-slate-900/90 z-10 w-full">
                  <span className="text-xs font-medium text-slate-500 relative -top-3 pr-2">
                    {hour === 12 ? '12:00 PM' : hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                  </span>
                </div>
                
                {/* Day Columns for current Hour */}
                {weekDays.map(day => {
                  const dayAppointments = getAppointmentsForDayAndHour(day, hour);
                  
                  return (
                    <div 
                      key={`${day.toISOString()}-${hour}`} 
                      className={clsx(
                        "border-r border-slate-800/40 p-1 transition-colors hover:bg-slate-800/20 relative",
                        isToday(day) && "bg-blue-500/[0.02]"
                      )}
                    >
                      <div className="flex flex-col gap-1 w-full h-full">
                        {dayAppointments.map(apt => (
                          <div 
                            key={apt.id} 
                            className={clsx(
                              "relative group/card text-xs p-2 rounded-lg border flex flex-col gap-1 transition-all hover:scale-[1.02] hover:shadow-lg hover:z-30 cursor-pointer overflow-hidden",
                              getStatusColor(apt.status)
                            )}
                          >
                            <div className="flex items-start justify-between">
                              <span 
                                className="font-semibold truncate pr-4 hover:underline hover:text-blue-400 transition-colors cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPatientId(apt.patient_id);
                                }}
                              >
                                {`${apt.patients?.first_name || ''} ${apt.patients?.last_name || ''}`.trim() || 'Unknown'}
                              </span>
                              <div className="absolute top-1 right-1 opacity-100 lg:opacity-0 lg:group-hover/card:opacity-100 transition-opacity bg-slate-900/80 rounded-md backdrop-blur-sm z-50">
                                <AppointmentActions appointment={apt} />
                              </div>
                            </div>
                            <div className="flex items-center text-[10px] opacity-80 mt-auto">
                              <span>{apt.time.substring(0,5)}</span>
                              {apt.source !== 'Manual' && (
                                <span className="ml-auto px-1.5 py-0.5 rounded-sm bg-black/20 font-medium tracking-wide">
                                  {apt.source}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          </div>
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
