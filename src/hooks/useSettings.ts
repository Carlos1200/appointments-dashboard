import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

export interface SettingsDTO {
  id: number;
  n8n_webhook_url: string | null;
  retell_api_key: string | null;
  retell_blocked_hours: string | null;
  updated_at?: string;
}

export type UpdateSettingsDTO = Partial<Omit<SettingsDTO, 'id' | 'updated_at'>>;

// 1. Hook to fetch settings (Read singleton row id=1)
export function useSettings() {
  return useQuery<SettingsDTO, Error>({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single();
        
      if (error) {
        throw new Error(error.message);
      }
      return data as SettingsDTO;
    }
  });
}

// 2. Hook to patch settings (Update singleton row id=1)
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: UpdateSettingsDTO) => {
      const { data, error } = await supabase
        .from('settings')
        .update(updates)
        .eq('id', 1)
        .select()
        .single();
        
      if (error) {
        throw new Error(error.message);
      }
      return data as SettingsDTO;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
}
