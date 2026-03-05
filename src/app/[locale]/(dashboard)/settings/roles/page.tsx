'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Shield, Check, Loader2, AlertCircle, Plus } from 'lucide-react';
import { useRoles, usePermissionsList, useRolePermissions, useToggleRolePermission, useCreateRole, useCreatePermission } from '@/hooks/useRoles';
import clsx from 'clsx';
import { sileo } from 'sileo';

export default function RolesMatrixPage() {
  const locale = useLocale();
  const isEs = locale === 'es';

  // Fetch all necessary dimension data
  const { data: roles = [], isLoading: loadingRoles } = useRoles();
  const { data: permissions = [], isLoading: loadingPerms } = usePermissionsList();
  const { data: rolePerms = [], isLoading: loadingLinks } = useRolePermissions();
  const { mutateAsync: togglePermission, status } = useToggleRolePermission();
  const { mutateAsync: createRole, status: roleStatus } = useCreateRole();
  const { mutateAsync: createPerm, status: permStatus } = useCreatePermission();

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isPermModalOpen, setIsPermModalOpen] = useState(false);
  
  const [newRole, setNewRole] = useState({ name: '', description: '' });
  const [newPerm, setNewPerm] = useState({ action: '', description: '' });

  const isToggling = status === 'pending';
  const isCreatingRole = roleStatus === 'pending';
  const isCreatingPerm = permStatus === 'pending';

  const isLoading = loadingRoles || loadingPerms || loadingLinks;

  // Helper to check if a specific role has a specific permission active
  const hasPermission = (roleId: string, permissionId: string) => {
    return rolePerms.some((rp) => rp.role_id === roleId && rp.permission_id === permissionId);
  };

  const handleToggle = async (roleId: string, permissionId: string, currentStatus: boolean, roleName: string) => {
    // Admins shouldn't lose their settings accidentally unless really intended, but for safety we can allow it.
    if (roleName === 'Admin' && currentStatus === true) {
        // Optional guard
    }

    try {
      await togglePermission({
        role_id: roleId,
        permission_id: permissionId,
        isEnabled: !currentStatus
      });
      // Sileo success is optional here since visual feedback is instant
    } catch (e: any) {
      console.error(e);
      sileo.error({ title: isEs ? 'Error actualizando permiso' : 'Error updating permission', description: e.message });
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.name) return;
    try {
      await createRole(newRole);
      sileo.success({ title: isEs ? 'Rol creado exitosamente' : 'Role created successfully' });
      setNewRole({ name: '', description: '' });
      setIsRoleModalOpen(false);
    } catch (error: any) {
      sileo.error({ title: isEs ? 'Error creando rol' : 'Error creating role', description: error.message });
    }
  };

  const handleCreatePerm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPerm.action) return;
    try {
      await createPerm({ action: newPerm.action.toLowerCase().replace(/\s+/g, '_'), description: newPerm.description });
      sileo.success({ title: isEs ? 'Permiso creado exitosamente' : 'Permission created successfully' });
      setNewPerm({ action: '', description: '' });
      setIsPermModalOpen(false);
    } catch (error: any) {
      sileo.error({ title: isEs ? 'Error creando permiso' : 'Error creating permission', description: error.message });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 overflow-y-auto pr-2 pb-10 max-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          {isEs ? 'Matriz de Permisos' : 'Permissions Matrix'}
        </h1>
        <p className="text-slate-400 mt-1 max-w-2xl">
          {isEs 
            ? 'Controla dinámicamente qué acciones puede realizar cada Rol dentro de la plataforma. Los cambios se aplican matemáticamente en tiempo real.'
            : 'Dynamically control what actions each Role can perform within the platform. Changes are mathematically applied in real time.'}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={() => setIsRoleModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" />
          {isEs ? 'Nuevo Rol' : 'New Role'}
        </button>
        <button 
          onClick={() => setIsPermModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl transition-colors border border-slate-700/50"
        >
          <Plus className="w-4 h-4" />
          {isEs ? 'Nuevo Permiso' : 'New Permission'}
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-20">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800/60 bg-gradient-to-b from-slate-900/80 to-slate-900/40 p-1 shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-4 border-b border-slate-800/60 text-slate-400 font-medium text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-indigo-400" />
                    {isEs ? 'Permiso / Acción' : 'Permission / Action'}
                  </div>
                </th>
                {roles.map((role) => (
                  <th key={role.id} className="p-4 border-b border-l border-slate-800/60 text-center font-semibold text-white">
                    {role.name}
                    <div className="text-[10px] text-slate-500 font-normal mt-1 max-w-[120px] mx-auto leading-tight">
                        {role.description}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.map((perm) => (
                <tr key={perm.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 border-b border-slate-800/60">
                    <div className="font-medium text-slate-200">{perm.action}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{perm.description}</div>
                  </td>
                  {roles.map((role) => {
                    const isActive = hasPermission(role.id, perm.id);
                    const isAdmin = role.name === 'Admin';
                    
                    return (
                      <td key={`${role.id}-${perm.id}`} className="p-4 border-b border-l border-slate-800/60 text-center align-middle">
                        <button
                          onClick={() => handleToggle(role.id, perm.id, isActive, role.name)}
                          disabled={isToggling && false} // React query handles optimistic / disabled states, keeping button alive
                          className={clsx(
                            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900",
                            isActive ? "bg-indigo-500" : "bg-slate-700",
                            (isAdmin && isActive) && "opacity-50 cursor-not-allowed" // Discourage disabling Admin
                          )}
                          role="switch"
                          aria-checked={isActive}
                        >
                          <span
                            aria-hidden="true"
                            className={clsx(
                              isActive ? "translate-x-5" : "translate-x-0",
                              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                            )}
                          >
                            {isActive && (
                                <span className="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity opacity-100 ease-in duration-200">
                                  <Check className="h-3 w-3 text-indigo-600" aria-hidden="true" />
                                </span>
                            )}
                          </span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 bg-blue-500/5 border-t border-slate-800/60 flex items-start gap-3 rounded-b-2xl">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-400 leading-relaxed">
                  {isEs 
                  ? 'Nota: Los Master Admins no deberían perder permisos críticos por accidente. Si deshabilitas el acceso a configuraciones para ellos, podrías quedarte fuera del sistema.' 
                  : 'Note: Master Admins should not accidentally lose critical permissions. Disabling configuration access for them might lock you out.'}
              </p>
          </div>
        </div>
      )}

      {/* Basic Modals for Creation */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-semibold text-white mb-4">{isEs ? 'Crear Nuevo Rol' : 'Create New Role'}</h3>
            <form onSubmit={handleCreateRole} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">{isEs ? 'Nombre del Rol' : 'Role Name'}</label>
                <input 
                  autoFocus
                  required
                  value={newRole.name} 
                  onChange={e => setNewRole({...newRole, name: e.target.value})}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder={isEs ? 'Ej: Recepcionista Jr' : 'Ex: Jr Receptionist'} 
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">{isEs ? 'Descripción' : 'Description'}</label>
                <textarea 
                  required
                  value={newRole.description} 
                  onChange={e => setNewRole({...newRole, description: e.target.value})}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-20" 
                  placeholder={isEs ? 'Atención al cliente...' : 'Customer support...'} 
                />
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button type="button" onClick={() => setIsRoleModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-slate-200">{isEs ? 'Cancelar' : 'Cancel'}</button>
                <button type="submit" disabled={isCreatingRole} className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-50">
                  {isCreatingRole ? <Loader2 className="w-4 h-4 animate-spin" /> : isEs ? 'Crear' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isPermModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-semibold text-white mb-4">{isEs ? 'Crear Nuevo Permiso' : 'Create New Permission'}</h3>
            <form onSubmit={handleCreatePerm} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">{isEs ? 'Acción (Clave)' : 'Action (Key)'}</label>
                <input 
                  autoFocus
                  required
                  value={newPerm.action} 
                  onChange={e => setNewPerm({...newPerm, action: e.target.value})}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="e.g manage_billing" 
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">{isEs ? 'Descripción' : 'Description'}</label>
                <textarea 
                  required
                  value={newPerm.description} 
                  onChange={e => setNewPerm({...newPerm, description: e.target.value})}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-20" 
                  placeholder={isEs ? 'Puede editar facturas' : 'Can edit bills'} 
                />
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button type="button" onClick={() => setIsPermModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-slate-200">{isEs ? 'Cancelar' : 'Cancel'}</button>
                <button type="submit" disabled={isCreatingPerm} className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-50">
                  {isCreatingPerm ? <Loader2 className="w-4 h-4 animate-spin" /> : isEs ? 'Crear' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
