import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import { X, Calendar as CalendarIcon, Phone, Mail, Activity, AlertCircle } from 'lucide-react';
import { Appointment } from '@/hooks/useAppointments';
import clsx from 'clsx';
import { useMemo } from 'react';

interface PatientSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string | null;
  appointments: Appointment[]; // We pass all appointments globally queried to derive metrics
}

export function PatientSlideOver({ isOpen, onClose, patientId, appointments }: PatientSlideOverProps) {
  const locale = useLocale();
  const isEs = locale === 'es';

  // Find all appointments for this explicitly selected patient ID
  const patientAppointments = useMemo(() => {
    if (!patientId) return [];
    return appointments.filter(a => a.patient_id === patientId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [patientId, appointments]);

  const patientBaseData = patientAppointments[0]?.patients;

  const totalVisits = patientAppointments.filter(a => a.status === 'completed' || a.status === 'confirmed').length;
  const cancellations = patientAppointments.filter(a => a.status === 'cancelled').length;
  const upcoming = patientAppointments.filter(a => a.status === 'pending' || a.status === 'in_progress').length;

  const cancellationRate = patientAppointments.length > 0 ? (cancellations / patientAppointments.length) * 100 : 0;
  const isHighRisk = cancellationRate > 30;

  return (
    <AnimatePresence>
      {isOpen && patientId && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Slide Over Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6 border-b border-slate-800/80 sticky top-0 bg-slate-900/95 backdrop-blur z-10 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  {patientBaseData?.first_name} {patientBaseData?.last_name}
                  {isHighRisk && (
                    <span className="flex items-center gap-1 text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full font-medium ml-2">
                      <AlertCircle className="w-3 h-3" />
                      {isEs ? 'Riesgo de Cancelación' : 'High Cancel Risk'}
                    </span>
                  )}
                </h2>
                <div className="flex items-center gap-3 mt-2 text-sm text-slate-400">
                  {patientBaseData?.phone && (
                    <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{patientBaseData.phone}</span>
                  )}
                  {patientBaseData?.email && (
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{patientBaseData.email}</span>
                  )}
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold text-white mb-1">{totalVisits}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{isEs ? 'Visitas' : 'Visits'}</span>
                </div>
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold text-blue-400 mb-1">{upcoming}</span>
                  <span className="text-[10px] text-blue-400/80 uppercase tracking-wider font-semibold">{isEs ? 'Futuras' : 'Upcoming'}</span>
                </div>
                <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold text-rose-400 mb-1">{cancellations}</span>
                  <span className="text-[10px] text-rose-400/80 uppercase tracking-wider font-semibold">{isEs ? 'Canceladas' : 'Cancelled'}</span>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  {isEs ? 'Historial de Citas' : 'Appointment History'}
                </h3>
                <div className="relative border-l border-slate-800 ml-3 space-y-8 pb-4">
                  {patientAppointments.map((apt, index) => {
                    const isPassed = new Date(apt.date) < new Date();
                    return (
                      <div key={apt.id} className="relative pl-6">
                        <span className={clsx(
                          "absolute -left-1.5 w-3 h-3 rounded-full border-2 border-slate-900",
                          apt.status === 'confirmed' ? 'bg-emerald-500' :
                          apt.status === 'cancelled' ? 'bg-rose-500' :
                          apt.status === 'pending' ? 'bg-amber-500' : 'bg-blue-500'
                        )} />
                        
                        <div className="flex flex-col gap-1">
                          <span className={clsx("text-sm font-semibold", isPassed ? "text-slate-400" : "text-slate-200")}>
                            {apt.date}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" /> {apt.time} • {apt.source}
                          </span>
                          {apt.notes && (
                            <div className="mt-2 text-xs text-slate-400 bg-slate-800/30 p-2 rounded-lg border border-slate-800">
                              {apt.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
