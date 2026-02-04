'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ConcursosDisponivelsList from '@/components/ConcursosDisponivelsList';
import GlassBackground from '@/components/GlassBackground';

export default function ConcursosDisponiveisPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 relative overflow-hidden" style={{ backgroundImage: 'linear-gradient(135deg, rgb(3, 7, 18) 0%, rgb(17, 24, 39) 50%, rgb(0, 0, 0) 100%)' }}>
        <GlassBackground />
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 relative z-10"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden" style={{ backgroundImage: 'linear-gradient(135deg, rgb(3, 7, 18) 0%, rgb(17, 24, 39) 50%, rgb(0, 0, 0) 100%)' }}>
      <GlassBackground />
      {/* Conteúdo Principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ paddingTop: 'max(3rem, calc(var(--safe-area-inset-top, 0px) + 3rem))', paddingBottom: '6rem' }}>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">Concursos Disponíveis</h1>
          <p className="text-cyan-200">Encontre e adicione concursos aos seus favoritos</p>
        </div>

        <ConcursosDisponivelsList />
      </div>
    </div>
  );
}
