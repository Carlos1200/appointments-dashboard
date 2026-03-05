import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface Permission {
  id: string;
  action: string;
  description: string;
}

export interface RolePermission {
  role_id: string;
  permission_id: string;
}

export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as Role[];
    }
  });
}

export function usePermissionsList() {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('action');
      if (error) throw error;
      return data as Permission[];
    }
  });
}

export function useRolePermissions() {
  return useQuery({
    queryKey: ['role_permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_permissions')
        .select('*');
      if (error) throw error;
      return data as RolePermission[];
    }
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, description }: { name: string, description: string }) => {
      const { data, error } = await supabase
        .from('roles')
        .insert({ name, description })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    }
  });
}

export function useCreatePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ action, description }: { action: string, description: string }) => {
      const { data, error } = await supabase
        .from('permissions')
        .insert({ action, description })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    }
  });
}

// Toggle a specific permission for a specific role
export function useToggleRolePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ role_id, permission_id, isEnabled }: { role_id: string, permission_id: string, isEnabled: boolean }) => {
      if (isEnabled) {
        // We are enabling it, insert the row
        const { error } = await supabase
          .from('role_permissions')
          .insert({ role_id, permission_id });
        if (error) throw error;
      } else {
        // We are disabling it, delete the row
        const { error } = await supabase
          .from('role_permissions')
          .delete()
          .match({ role_id, permission_id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role_permissions'] });
    }
  });
}
