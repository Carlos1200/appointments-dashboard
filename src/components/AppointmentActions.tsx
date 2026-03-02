'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical, Edit2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { sileo } from 'sileo';
import { useUpdateAppointment, Appointment } from '@/hooks/useAppointments';
import { EditAppointmentModal } from './EditAppointmentModal';
import { motion, AnimatePresence } from 'framer-motion';

interface AppointmentActionsProps {
  appointment: Appointment;
}

export function AppointmentActions({ appointment }: AppointmentActionsProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  
  const locale = useLocale();
  const isEs = locale === 'es';
  const tStatus = useTranslations('Status');
  
  const { mutateAsync: updateAppointment } = useUpdateAppointment();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle outside click, scroll, and resize to safely close the portal dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleScroll(event: Event) {
      // Ignorar scroll si ocurre dentro del propio menú
      if (menuRef.current && menuRef.current.contains(event.target as Node)) {
        return;
      }
      if (isOpen) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true); // Use capture to catch div scrolls
      window.addEventListener('resize', handleScroll);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      // Dropdown width is 192px (w-48). Posicionado debajo alineado a la derecha del botón
      setCoords({
        top: rect.bottom + 8,
        left: rect.right - 192,
      });
    }
    setIsOpen(!isOpen);
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsOpen(false);
    try {
      await updateAppointment({
        id: appointment.id,
        status: newStatus
      });
    } catch (error) {
      console.error('Failed to update status', error);
      sileo.error({ title: isEs ? 'Error al actualizar el estado.' : 'Failed to update status.' });
    }
  };

  const handleEditClick = () => {
    setIsOpen(false);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <button 
        ref={buttonRef}
        onClick={toggleMenu}
        className="text-slate-500 hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-700"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              style={{ position: 'fixed', top: coords.top, left: coords.left, zIndex: 9999 }}
              className="w-48 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] bg-slate-900 border border-slate-700/80 ring-1 ring-black ring-opacity-5 overflow-hidden backdrop-blur-3xl"
            >
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <button
                  onClick={handleEditClick}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center transition-colors border-b border-slate-800/50"
                  role="menuitem"
                >
                  <Edit2 className="w-4 h-4 mr-2 text-blue-400" />
                  {isEs ? 'Editar cita' : 'Edit appointment'}
                </button>
                
                {appointment.status !== 'confirmed' && (
                  <button
                    onClick={() => handleStatusChange('confirmed')}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 flex items-center transition-colors"
                    role="menuitem"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {tStatus('confirmed')}
                  </button>
                )}
                
                {appointment.status !== 'pending' && (
                  <button
                    onClick={() => handleStatusChange('pending')}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-amber-500/10 hover:text-amber-400 flex items-center transition-colors"
                    role="menuitem"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    {tStatus('pending')}
                  </button>
                )}
                
                {appointment.status !== 'cancelled' && (
                  <button
                    onClick={() => handleStatusChange('cancelled')}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-rose-500/10 hover:text-rose-400 flex items-center transition-colors"
                    role="menuitem"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    {tStatus('cancelled')}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <EditAppointmentModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        locale={locale} 
        appointment={appointment} 
      />
    </>
  );
}
