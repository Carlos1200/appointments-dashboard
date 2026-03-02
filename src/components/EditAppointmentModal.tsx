'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar as CalendarIcon, Clock, Phone, User, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { sileo } from 'sileo';
import { useUpdateAppointment, Appointment } from '@/hooks/useAppointments';

interface EditAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
  appointment: Appointment | null;
}

export function EditAppointmentModal({ isOpen, onClose, locale, appointment }: EditAppointmentModalProps) {
  const isEs = locale === 'es';
  const { mutateAsync: updateAppointment, status } = useUpdateAppointment();
  const isSubmitting = status === 'pending';
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    notes: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pre-fill form when appointment changes
  useEffect(() => {
    if (appointment) {
      setFormData({
        name: appointment.patient_name || '',
        phone: appointment.patient_phone || '',
        date: appointment.date || '',
        // Format time to HH:mm for the select input if needed, though the DB might already store HH:mm
        time: appointment.time?.substring(0, 5) || '',
        notes: appointment.notes || ''
      });
    }
  }, [appointment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointment) return;

    try {
      await updateAppointment({
        id: appointment.id,
        patient_name: formData.name,
        patient_phone: formData.phone,
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
      });
      sileo.success({ title: isEs ? 'Cita actualizada rectamente' : 'Appointment updated successfully' });
      onClose();
    } catch (error) {
      console.error('Error updating appointment:', error);
      sileo.error({ title: isEs ? 'Error actualizando la cita. Intenta de nuevo.' : 'Error updating appointment. Try again.' });
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && appointment && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-slate-900/90 border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-800/60">
              <h2 className="text-xl font-semibold text-white">
                {isEs ? 'Editar Cita' : 'Edit Appointment'}
              </h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {isEs ? 'Nombre del Cliente' : 'Client Name'}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {isEs ? 'Número de Teléfono' : 'Phone Number'}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                      <input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {isEs ? 'Fecha' : 'Date'}
                    </label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                      <input
                        required
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all [color-scheme:dark]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {isEs ? 'Hora' : 'Time'}
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                      <select 
                        required 
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="">{isEs ? 'Seleccionar hora' : 'Select time'}</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="13:00">01:00 PM</option>
                        <option value="14:00">02:00 PM</option>
                        <option value="16:00">04:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {isEs ? 'Notas (Opcional)' : 'Notes (Optional)'}
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-slate-500 w-4 h-4" />
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                    placeholder={isEs ? 'Cualquier detalle importante para la cita...' : 'Any important details for the appointment...'}
                  />
                </div>
              </div>

              <div className="mt-8 flex items-center justify-end gap-3 pt-6 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-colors border border-slate-700/50"
                >
                  {isEs ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  ) : null}
                  {isEs ? 'Guardar Cambios' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(modalContent, document.body);
}
