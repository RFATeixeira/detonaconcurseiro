'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GlassBackground from './GlassBackground';

export default function LoginForm() {
  const [cpfOrEmail, setCpfOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await loginUser(cpfOrEmail, password);
      router.push('/dashboard');
    } catch {
      // Erro é tratado no contexto
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        backgroundImage:
          'linear-gradient(135deg, rgb(3, 7, 18) 0%, rgb(17, 24, 39) 50%, rgb(0, 0, 0) 100%)',
      }}
    >
      <GlassBackground />

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <img
            src="/logo.png"
            alt="Detona Concurseiro"
            className="h-16 w-16 mx-auto mb-4"
          />
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">
            Acesse sua conta
          </h2>
          <p className="mt-2 text-sm text-cyan-200">
            Ou{' '}
            <Link
              href="/register"
              className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              crie uma nova conta
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg backdrop-blur-sm bg-red-500/20 border border-red-400/30 p-4">
              <div className="text-sm font-medium text-red-200">{error}</div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="cpf-or-email" className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-2 block">
                CPF ou Email
              </label>
              <input
                id="cpf-or-email"
                name="cpf-or-email"
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-gray-900/40 backdrop-blur-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/50 transition-all"
                placeholder="CPF ou Email"
                value={cpfOrEmail}
                onChange={(e) => setCpfOrEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-2 block">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-gray-900/40 backdrop-blur-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/50 transition-all"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 rounded-xl font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed border border-cyan-400/30 hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/20"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, rgba(6, 182, 212, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%)',
              }}
            >
              {isLoading ? 'Conectando...' : 'Conectar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
