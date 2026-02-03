'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GlassBackground from './GlassBackground';

export default function RegisterForm() {
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const { registerUser, error } = useAuth();
  const router = useRouter();

  const formatCPF = (value: string) => {
    const cpfNumbers = value.replace(/\D/g, '');
    if (cpfNumbers.length <= 11) {
      return cpfNumbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2');
    }
    return value;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCPF(e.target.value));
    setValidationError('');
  };

  const validateForm = () => {
    // Validar CPF vazio
    if (!cpf.replace(/\D/g, '')) {
      setValidationError('CPF é obrigatório');
      return false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Email inválido');
      return false;
    }

    // Validar senhas
    if (password.length < 6) {
      setValidationError('Senha deve ter no mínimo 6 caracteres');
      return false;
    }

    if (password !== confirmPassword) {
      setValidationError('As senhas não conferem');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await registerUser(cpf, email, password);
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
            Crie sua conta
          </h2>
          <p className="mt-2 text-sm text-cyan-200">
            Ou{' '}
            <Link
              href="/login"
              className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              acesse sua conta existente
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {(error || validationError) && (
            <div className="rounded-lg backdrop-blur-sm bg-red-500/20 border border-red-400/30 p-4">
              <div className="text-sm font-medium text-red-200">
                {validationError || error}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="cpf" className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-2 block">
                CPF
              </label>
              <input
                id="cpf"
                name="cpf"
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-gray-900/40 backdrop-blur-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/50 transition-all"
                placeholder="CPF (000.000.000-00)"
                value={cpf}
                onChange={handleCPFChange}
                maxLength={14}
              />
            </div>

            <div>
              <label htmlFor="email" className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-2 block">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-gray-900/40 backdrop-blur-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/50 transition-all"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setValidationError('');
                }}
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  setValidationError('');
                }}
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-2 block">
                Confirmar Senha
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-gray-900/40 backdrop-blur-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/50 transition-all"
                placeholder="Confirmar Senha"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setValidationError('');
                }}
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
              {isLoading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
