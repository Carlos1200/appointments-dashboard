import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { Patient } from './usePatients';
import { dispatchWebhook } from '@/lib/n8n/webhook';

// Interfaces / Types
export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id?: string;
  // Make patient data available after joined queries
  patients?: Patient;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'in_progress' | 'completed';
  type: string;
  source: string;
  notes: string | null;
  created_at: string;
}

export interface CreateAppointmentDTO {
  patient_id: string;
  doctor_id?: string;
  date: string;
  time: string;
  notes?: string;
  status?: string;
  type?: string;
  source?: string;
}

export interface UpdateAppointmentDTO {
  id: string;
  patient_id?: string;
  doctor_id?: string;
  date?: string;
  time?: string;
  notes?: string;
  status?: string;
}

// 1. Hook para OBTENER las citas (Read)
export function useAppointments() {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patients (*)
        `)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) {
        console.error('Error fetching appointments', error);
        throw error;
      }
      return data as Appointment[];
    },
  });
}

// 2. Hook para CREAR una cita (Create)
export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newAppointment: CreateAppointmentDTO) => {
      const { data, error } = await supabase
        .from('appointments')
        .insert(newAppointment)
        .select()
        .single(); // Devuelve solo el elemento insertado
        
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    // Al concluir, invalidamos la caché para que la tabla se refresque instantáneamente
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      // Ejecutamos el trigger del webhook (en segundo plano, no bloqueante)
      dispatchWebhook('appointment.created', data);
    },
  });
}

// 3. Hook para ACTUALIZAR una cita (Update)
export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedAppointment: UpdateAppointmentDTO) => {
      const { id, ...updates } = updatedAppointment;

      const { data, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      
      // Determine if cancelled or just updated
      const eventName = data.status === 'cancelled' ? 'appointment.cancelled' : 'appointment.updated';
      dispatchWebhook(eventName, data);
    },
  });
}
