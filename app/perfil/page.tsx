'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useProfile } from '@/lib/use-profile';
import { useRouter } from 'next/navigation';
import GlassBackground from '@/components/GlassBackground';

export default function PerfilPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const { updateProfile, loading, error, success } = useProfile();
  const router = useRouter();

  const [formData, setFormData] = useState({
    displayName: '',
    cpf: '',
    email: '',
    dateOfBirth: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || '',
        cpf: userProfile.cpf || '',
        email: userProfile.email || '',
        dateOfBirth: userProfile.dateOfBirth || '',
      });
    }
  }, [userProfile]);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return value;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setFormData({ ...formData, cpf: formatted });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await updateProfile(formData);
    
    if (result) {
      // Recarregar a página após 2 segundos para atualizar os dados
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-950 relative overflow-hidden flex items-center justify-center" style={{ backgroundImage: 'linear-gradient(135deg, rgb(3, 7, 18) 0%, rgb(17, 24, 39) 50%, rgb(0, 0, 0) 100%)' }}>
        <GlassBackground />
        <div className="text-cyan-400 text-xl relative z-10">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden py-12 px-4" style={{ backgroundImage: 'linear-gradient(135deg, rgb(3, 7, 18) 0%, rgb(17, 24, 39) 50%, rgb(0, 0, 0) 100%)' }}>
      <GlassBackground />
      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">Meu Perfil</h1>
          <p className="text-cyan-200">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>

        {/* Mensagens de feedback */}
        {error && (
          <div className="mb-6 p-4 backdrop-blur-sm bg-red-500/10 border border-red-400/30 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 backdrop-blur-sm bg-green-500/10 border border-green-400/30 rounded-lg text-green-300">
            Perfil atualizado com sucesso!
          </div>
        )}

        {/* Formulário */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-8 shadow-xl hover:border-cyan-500/30 transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome de Usuário */}
            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Nome de Usuário
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                placeholder="Digite seu nome de usuário"
              />
              <p className="mt-1 text-sm text-gray-500">
                Este nome será exibido no cabeçalho do sistema
              </p>
            </div>

            {/* CPF */}
            <div>
              <label
                htmlFor="cpf"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                CPF
              </label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleCPFChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                placeholder="000.000.000-00"
                maxLength={14}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                placeholder="seu@email.com"
              />
              <p className="mt-1 text-sm text-gray-500">
                Alterar o email requer reautenticação
              </p>
            </div>

            {/* Data de Nascimento */}
            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Data de Nascimento
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
              />
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 backdrop-blur-sm bg-linear-to-r from-cyan-500/30 to-blue-500/30 hover:from-cyan-500/40 hover:to-blue-500/40 disabled:from-gray-500/20 disabled:to-gray-500/20 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all border border-cyan-400/30 hover:border-cyan-400/60"
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
              
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="flex-1 backdrop-blur-sm bg-white/5 hover:bg-white/10 text-white font-semibold py-3 px-6 rounded-lg transition-all border border-white/10 hover:border-cyan-400/50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>

        {/* Informações adicionais */}
        <div className="mt-8 backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-6 hover:border-cyan-500/30 transition-all duration-300">
          <h2 className="text-xl font-semibold text-cyan-300 mb-4">
            Informações da Conta
          </h2>
          <div className="space-y-2 text-cyan-100/70">
            <p>
              <span className="font-medium text-white">UID:</span>{' '}
              {user?.uid}
            </p>
            <p>
              <span className="font-medium text-white">Email verificado:</span>{' '}
              {user?.emailVerified ? '✅ Sim' : '❌ Não'}
            </p>
            {userProfile?.createdAt && (
              <p>
                <span className="font-medium text-white">Conta criada em:</span>{' '}
                {new Date(userProfile.createdAt).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
