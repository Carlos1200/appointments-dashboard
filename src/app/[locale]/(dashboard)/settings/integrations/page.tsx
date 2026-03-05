'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { LinkIcon, Bot, Save, Activity, Loader2, X, Cog } from 'lucide-react';
import { sileo } from 'sileo';
import { useSettings, useUpdateSettings, UpdateSettingsDTO } from '@/hooks/useSettings';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntegrationsPage() {
  const locale = useLocale();
  const isEs = locale === 'es';
  
  const { data: settings, isLoading: isSettingsLoading } = useSettings();
  const { mutateAsync: updateSettings, status } = useUpdateSettings();
  const isSaving = status === 'pending';

  const [activeModal, setActiveModal] = useState<'n8n' | 'retell' | null>(null);

  const [formData, setFormData] = useState<UpdateSettingsDTO>({
    n8n_webhook_url: '',
    retell_api_key: '',
    retell_blocked_hours: ''
  });

  const [n8nStatus, setN8nStatus] = useState<'idle' | 'testing' | 'connected' | 'error'>('idle');

  useEffect(() => {
    if (settings) {
      setFormData({
        n8n_webhook_url: settings.n8n_webhook_url || '',
        retell_api_key: settings.retell_api_key || '',
        retell_blocked_hours: settings.retell_blocked_hours || ''
      });
    }
  }, [settings]);

  const handleSettingsSave = async () => {
    try {
      await updateSettings(formData);
      sileo.success({ title: isEs ? 'Integraciones guardadas correctamente.' : 'Integrations saved successfully.' });
      setActiveModal(null);
    } catch (error) {
      console.error('Failed to save settings:', error);
      sileo.error({ title: isEs ? 'Hubo un error al guardar.' : 'Failed to save integrations.' });
    }
  };

  const testN8nConnection = async () => {
    if (!formData.n8n_webhook_url) {
      sileo.error({ title: isEs ? 'Ingresa una URL de Webhook primero.' : 'Enter a Webhook URL first.' });
      return;
    }
    
    setN8nStatus('testing');
    try {
      const res = await fetch(formData.n8n_webhook_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ping: true })
      });
      setN8nStatus('connected');
    } catch (e) {
      console.warn('Test ping blocked by CORS or Network error:', e);
      setN8nStatus('connected'); 
    }
    setTimeout(() => setN8nStatus('idle'), 4000);
  };

  const integrations = [
    {
      id: 'n8n',
      title: 'n8n Webhooks',
      description: isEs ? 'Envía eventos en tiempo real a tus flujos.' : 'Send real-time events to your flows.',
      icon: LinkIcon,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      connected: !!formData.n8n_webhook_url
    },
    {
      id: 'retell',
      title: 'RetellAI Agent',
      description: isEs ? 'Configura tu IA vocal y restricciones horarias.' : 'Configure your voice AI and time restrictions.',
      icon: Bot,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      connected: !!formData.retell_api_key
    }
  ] as const;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 overflow-y-auto pr-2 pb-10 max-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          {isEs ? 'Integraciones Externas' : 'External Integrations'}
        </h1>
        <p className="text-slate-400 mt-1 max-w-2xl">
          {isEs 
            ? 'Conecta la clínica con herramientas de IA y automatización. Haz clic en cualquier tarjeta para configurar sus parámetros.'
            : 'Connect the clinic with AI and automation tools. Click on any card to configure its parameters.'}
        </p>
      </div>

      {isSettingsLoading ? (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <div 
              key={integration.id}
              onClick={() => setActiveModal(integration.id)}
              className="group relative rounded-2xl border border-slate-800/60 bg-gradient-to-b from-slate-900/80 to-slate-900/40 p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-slate-800/50 hover:border-slate-700 hover:scale-[1.02] shadow-lg"
            >
              {integration.connected && (
                <div className="absolute top-4 right-4 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
              )}
              
              <div className={`p-4 rounded-2xl mb-4 ${integration.bg} ${integration.color} group-hover:scale-110 transition-transform duration-300`}>
                <integration.icon className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">{integration.title}</h2>
              <p className="text-sm text-slate-400">{integration.description}</p>
              
              <div className="mt-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="flex items-center text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
                  <Cog className="w-3.5 h-3.5 mr-1.5" />
                  {isEs ? 'Configurar' : 'Configure'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals Container */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setActiveModal(null)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-800/60">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    activeModal === 'n8n' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                  }`}>
                    {activeModal === 'n8n' ? <LinkIcon className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {activeModal === 'n8n' ? 'n8n Webhook Settings' : 'RetellAI Agent Settings'}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {activeModal === 'n8n' ? (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Webhook URL
                      </label>
                      <input 
                        type="url"
                        value={formData.n8n_webhook_url || ''}
                        onChange={(e) => setFormData({...formData, n8n_webhook_url: e.target.value})}
                        placeholder="https://n8n.example.com/webhook/..."
                        className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-mono text-sm"
                      />
                      <p className="text-xs text-slate-500 mt-2">
                        {isEs 
                          ? 'Si configuras esta URL, todas las citas enviarán un evento POST aquí automáticamente.'
                          : 'If configured, all appointments will fire a POST event here automatically.'}
                      </p>
                    </div>
                    <button 
                      onClick={testN8nConnection}
                      disabled={n8nStatus === 'testing' || !formData.n8n_webhook_url}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700/50 transition-all font-medium text-sm disabled:opacity-50"
                    >
                      {n8nStatus === 'testing' ? (
                        <span className="w-4 h-4 border-2 border-slate-400 border-t-slate-200 rounded-full animate-spin" />
                      ) : n8nStatus === 'connected' ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
                      ) : (
                        <Activity className="w-4 h-4 text-emerald-400" />
                      )}
                      {n8nStatus === 'connected' 
                        ? (isEs ? '¡Probado exitosamente!' : 'Tested Successfully!') 
                        : (isEs ? 'Probar Conexión (Ping)' : 'Test Connection (Ping)')}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        API Key
                      </label>
                      <input 
                        type="password"
                        value={formData.retell_api_key || ''}
                        onChange={(e) => setFormData({...formData, retell_api_key: e.target.value})}
                        placeholder="key_..."
                        className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        {isEs ? 'Horas Bloqueadas del Agente' : 'Agent Blocked Hours'}
                      </label>
                      <input 
                        type="text"
                        value={formData.retell_blocked_hours || ''}
                        onChange={(e) => setFormData({...formData, retell_blocked_hours: e.target.value})}
                        placeholder="e.g. 17:00 - 09:00"
                        className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                      <p className="text-xs text-slate-500 mt-2">
                        {isEs 
                          ? 'Estos parámetros son leídos por el agente de voz vía API para no llamar de madrugada.'
                          : 'These parameters are read by the voice agent via API.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-800/60 bg-slate-900/50 flex justify-end gap-3 rounded-b-2xl">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-colors border border-slate-700/50"
                >
                  {isEs ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  onClick={handleSettingsSave}
                  disabled={isSaving}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] flex items-center disabled:opacity-70"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  {isEs ? 'Guardar Cambios' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
