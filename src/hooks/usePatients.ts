import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  created_at: string;
}

export type CreatePatientDTO = Omit<Patient, 'id' | 'created_at'>;
export type UpdatePatientDTO = Partial<Omit<Patient, 'created_at'>> & { id: string };

// Fetch all patients (useful for autocomplete)
export function usePatients() {
  return useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('last_name', { ascending: true });

      if (error) {
        console.error('Error fetching patients:', error);
        throw error;
      }
      return data as Patient[];
    },
  });
}

// Fetch single patient by ID
export function usePatient(id: string) {
  return useQuery({
    queryKey: ['patients', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching patient:', error);
        throw error;
      }
      return data as Patient;
    },
    enabled: !!id,
  });
}

// Create new patient
export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPatient: CreatePatientDTO) => {
      const { data, error } = await supabase
        .from('patients')
        .insert([newPatient])
        .select()
        .single();

      if (error) {
        console.error('Error creating patient:', error);
        throw error;
      }
      return data as Patient;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}

// Update existing patient
export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (patientUpdate: UpdatePatientDTO) => {
      const { id, ...updates } = patientUpdate;
      const { data, error } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating patient:', error);
        throw error;
      }
      return data as Patient;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patients', variables.id] });
      // Invalidate appointments too since they might display updated patient data
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}
