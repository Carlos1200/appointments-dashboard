import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

export function usePermissions() {
  return useQuery({
    queryKey: ['user_permissions'],
    staleTime: 1000 * 60 * 5, // Cache permissions for 5 mins
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Fetch the role's permissions through the profile join
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          role_id,
          roles (
            name,
            role_permissions (
              permissions (
                action
              )
            )
          )
        `)
        .eq('id', user.id)
        .single();
        
      if (error || !data?.roles) {
        return [];
      }

      // Flatten the permissions into a simple array of strings (actions)
      // data.roles.role_permissions -> array of object with nested permissions
      const rpArray: any[] = (data.roles as any).role_permissions || [];
      const actions = rpArray.map(rp => rp.permissions?.action).filter(Boolean) as string[];

      return actions;
    }
  });
}
