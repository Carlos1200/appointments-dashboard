'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Mail, Lock, LogIn, Loader2, Target } from 'lucide-react';
import { login } from './actions';

export default function LoginPage() {
  const t = useTranslations('Settings'); // Reusing some strings or define a new dictionary later
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    const formData = new FormData(e.currentTarget);
    const result = await login(formData, locale);
    
    // If we reach here, it means we got an error object back, otherwise redirect throws an Error that NextJS catches.
    if (result?.error) {
        setErrorMsg(locale === 'es' ? 'Credenciales incorrectas' : 'Invalid credentials');
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-950">
      
      {/* Dynamic Background Effects */}
      <div className="absolute top-1/4 -left-[10%] w-[40vw] h-[40vw] flex-shrink-0 bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse pointer-events-none" />
      <div className="absolute top-1/3 -right-[10%] w-[50vw] h-[50vw] flex-shrink-0 bg-indigo-600/20 rounded-full blur-[140px] mix-blend-screen animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

      <div className="z-10 w-full max-w-md p-6">
        
        {/* Brand Banner */}
        <div className="flex flex-col items-center justify-center mb-10 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 p-[2px] shadow-2xl shadow-blue-500/20 ring-1 ring-white/10">
                <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
                    <Target className="w-8 h-8 text-blue-400" />
                </div>
            </div>
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Staff Portal</h1>
                <p className="text-slate-400 text-sm">
                    {locale === 'es' ? 'Ingresa tus credenciales para continuar' : 'Enter your credentials to continue'}
                </p>
            </div>
        </div>

        {/* Glassmorphism Card */}
        <div className="relative rounded-3xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-2xl shadow-2xl p-8">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium">
                    {errorMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 relative">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            required
                            type="email"
                            name="email"
                            placeholder="doctor@clinica.com"
                            className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-2xl text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300 ml-1">
                        {locale === 'es' ? 'Contraseña' : 'Password'}
                    </label>
                    <div className="relative group">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            required
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-2xl text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                              <LogIn className="w-5 h-5" />
                              {locale === 'es' ? 'Iniciar Sesión' : 'Sign In'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>

      </div>
    </div>
  );
}
