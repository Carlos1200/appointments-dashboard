import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

export interface Profile {
  id: string; // Auth ID
  role_id: string | null;
  full_name: string | null;
  specialty: string | null;
  created_at: string;
  roles?: {
    name: string;
  };
}

export function useProfiles() {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          role_id,
          full_name,
          specialty,
          created_at,
          roles (
            name
          )
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as unknown as Profile[];
    }
  });
}

export function useCurrentProfile() {
  return useQuery({
    queryKey: ['current_profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error; // PRGST116 means 0 rows
      return data as Profile | null;
    }
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, role_id, full_name, specialty }: Partial<Profile> & { id: string }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ role_id, full_name, specialty })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    }
  });
}
