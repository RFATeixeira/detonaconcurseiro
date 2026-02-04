'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ConcursosList from '@/components/ConcursosList';
import GlassBackground from '@/components/GlassBackground';

export default function MeusConcursosPage() {
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
      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8" style={{ paddingTop: 'max(3rem, calc(var(--safe-area-inset-top, 0px) + 3rem))', paddingBottom: '6rem' }}>
        <ConcursosList />
      </main>
    </div>
  );
}
