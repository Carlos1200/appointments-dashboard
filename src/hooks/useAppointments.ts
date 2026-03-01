import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

// Interfaces / Types
export interface Appointment {
  id: string;
  patient_name: string;
  patient_phone: string;
  date: string;
  time: string;
  notes?: string;
  status: 'pending' | 'in_progress' | 'confirmed' | 'cancelled';
  source: string;
  created_at: string;
}

export interface CreateAppointmentDTO {
  patient_name: string;
  patient_phone: string;
  date: string;
  time: string;
  notes?: string;
  status: string;
  source: string;
}

// 1. Hook para OBTENER las citas (Read)
export function useAppointments() {
  return useQuery<Appointment[], Error>({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }
      
      return data as Appointment[];
    }
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}
