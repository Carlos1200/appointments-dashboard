'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Globe, Check, Save } from 'lucide-react';

export default function SettingsGeneralPage() {
  const t = useTranslations('Settings');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  
  const [selectedLang, setSelectedLang] = useState(locale);
  const [isSavedLangs, setIsSavedLangs] = useState(false);

  const handleLanguageSave = () => {
    setIsSavedLangs(true);
    // Preserves the rest of the path /settings while swapping the prefix
    router.replace(pathname, {locale: selectedLang});
    setTimeout(() => setIsSavedLangs(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">{t('title')}</h1>
        <p className="text-slate-400 mt-1">
          {locale === 'es' 
            ? 'Administra tus configuraciones de cuenta generales.'
            : 'Manage your general account settings.'}
        </p>
      </div>

      {/* Language Card */}
      <div className="rounded-2xl border border-slate-800/60 bg-gradient-to-b from-slate-900/80 to-slate-900/40 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400">
            <Globe className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-white">Language & Region</h2>
        </div>
        
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {t('language')}
            </label>
            <select 
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="es">Español (Default)</option>
              <option value="en">English (Secondary)</option>
            </select>
          </div>
          <div className="pt-2">
            <button 
              onClick={handleLanguageSave}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.2)] hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all font-medium text-sm"
            >
              {isSavedLangs ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {isSavedLangs ? (locale === 'es' ? 'Guardado!' : 'Saved!') : t('save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
