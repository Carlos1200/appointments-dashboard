'use client';

import { useLocale } from 'next-intl';
import { Users, Mail, Loader2, UserPlus, ShieldAlert } from 'lucide-react';
import { useProfiles, useUpdateProfile } from '@/hooks/useProfiles';
import { useRoles } from '@/hooks/useRoles';
import { sileo } from 'sileo';
import clsx from 'clsx';
import { useState } from 'react';

export default function TeamManagementPage() {
  const locale = useLocale();
  const isEs = locale === 'es';

  const { data: profiles = [], isLoading: loadingProfiles } = useProfiles();
  const { data: roles = [], isLoading: loadingRoles } = useRoles();
  const { mutateAsync: updateProfile } = useUpdateProfile();
  
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const isLoading = loadingProfiles || loadingRoles;

  const handleRoleChange = async (profileId: string, newRoleId: string) => {
    setUpdatingId(profileId);
    try {
      await updateProfile({ id: profileId, role_id: newRoleId });
      sileo.success({ title: isEs ? 'Rol actualizado correctamente' : 'Role updated successfully' });
    } catch (e: any) {
      console.error(e);
      sileo.error({ title: 'Error', description: e.message });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 overflow-y-auto pr-2 pb-10 max-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {isEs ? 'Gestión de Equipo' : 'Team Management'}
          </h1>
          <p className="text-slate-400 mt-1">
            {isEs 
              ? 'Administra los roles, perfiles y accesos de tu staff clínico.'
              : 'Manage roles, profiles, and access for your clinical staff.'}
          </p>
        </div>
      </div>

      <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-start gap-3">
        <UserPlus className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-indigo-200">
           {isEs ? (
             <p>Pídele a tus nuevos Doctores o Asistentes que rellenen el formulario en <strong>/register</strong>. Una vez completado, su perfil aparecerá automáticamente en esta tabla para que tú, como Admin, les asignes su rol clínico y especialidad oficial.</p>
           ) : (
             <p>Ask your new Doctors or Assistants to fill out the form at <strong>/register</strong>. Once completed, their profile will automatically appear in this table for you to assign their official clinical role and specialty.</p>
           )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-20">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800/60 bg-gradient-to-b from-slate-900/80 to-slate-900/40 shadow-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="p-4 border-b border-slate-800/60 text-slate-400 font-medium text-sm">
                  {isEs ? 'Miembro del Staff' : 'Staff Member'}
                </th>
                <th className="p-4 border-b border-slate-800/60 text-slate-400 font-medium text-sm">
                  {isEs ? 'Especialidad / Area' : 'Specialty / Area'}
                </th>
                <th className="p-4 border-b border-slate-800/60 text-slate-400 font-medium text-sm w-48">
                  {isEs ? 'Rol Asignado' : 'Assigned Role'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {profiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                        <Users className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-200">
                          {profile.full_name || (isEs ? 'Usuario sin nombre' : 'Unnamed User')}
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5" title={profile.id}>
                          ID: {profile.id.substring(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-400">
                     {profile.specialty || '-'}
                  </td>
                  <td className="p-4">
                    <div className="relative flex items-center gap-2">
                        <select
                          value={profile.role_id || ''}
                          disabled={updatingId === profile.id}
                          onChange={(e) => handleRoleChange(profile.id, e.target.value)}
                          className={clsx(
                              "w-full px-3 py-2 bg-slate-950/50 border rounded-xl text-sm outline-none transition-all appearance-none cursor-pointer",
                              profile.roles?.name === 'Admin' ? "border-indigo-500/50 text-indigo-300" : "border-slate-800 text-slate-300 hover:border-slate-700 focus:border-indigo-500",
                              updatingId === profile.id && "opacity-50"
                          )}
                        >
                          <option value="" disabled>{isEs ? 'Sin asignar' : 'Unassigned'}</option>
                          {roles.map((r) => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                          ))}
                        </select>
                        {updatingId === profile.id && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin absolute right-3 pointer-events-none" />}
                    </div>
                    {!profile.role_id && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-500">
                            <ShieldAlert className="w-3 h-3" />
                            {isEs ? 'Sin acceso' : 'No access'}
                        </div>
                    )}
                  </td>
                </tr>
              ))}
              {profiles.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-500">
                    {isEs ? 'No hay usuarios registrados aún.' : 'No users registered yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
