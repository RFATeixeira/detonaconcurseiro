'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import GlassBackground from '@/components/GlassBackground';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden" style={{ backgroundImage: 'linear-gradient(135deg, rgb(3, 7, 18) 0%, rgb(17, 24, 39) 50%, rgb(0, 0, 0) 100%)' }}>
      <GlassBackground />
      
      <nav className="backdrop-blur-sm bg-white/5 border-b border-white/10 shadow-lg relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="Detona Concurseiro" 
                width={40} 
                height={40}
                className="object-contain"
              />
              <h1 className="text-sm sm:text-2xl font-bold text-cyan-400 drop-shadow-lg">
                Detona Concurseiro
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-300 hover:text-cyan-400 transition-colors"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-300 hover:text-cyan-400 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-medium text-white backdrop-blur-sm rounded-md transition-all border border-cyan-400/30 hover:border-cyan-400/60"
                    style={{ backgroundImage: 'linear-gradient(90deg, rgba(6, 182, 212, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%)' }}
                  >
                    Registrar
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white drop-shadow-lg sm:text-5xl md:text-6xl">
            Bem-vindo ao Detona Concurseiro
          </h2>
          <p className="mt-6 text-lg text-cyan-200 max-w-2xl mx-auto">
            Prepare-se para seus concursos públicos com nosso sistema interativo
            de estudos e simulados.
          </p>

          {!user && (
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="px-8 py-3 text-base font-medium text-white backdrop-blur-sm rounded-md transition-all border border-cyan-400/30 hover:border-cyan-400/60 hover:scale-105"
                style={{ backgroundImage: 'linear-gradient(90deg, rgba(6, 182, 212, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%)' }}
              >
                Fazer Login
              </Link>
              <Link
                href="/register"
                className="px-8 py-3 text-base font-medium text-gray-100 backdrop-blur-sm bg-white/5 hover:bg-white/10 rounded-md border border-white/10 hover:border-cyan-400/50 transition-all hover:scale-105"
              >
                Criar Conta
              </Link>
            </div>
          )}

          {user && (
            <div className="mt-10">
              <Link
                href="/dashboard"
                className="inline-block px-8 py-3 text-base font-medium text-white backdrop-blur-sm rounded-md transition-all border border-cyan-400/30 hover:border-cyan-400/60 hover:scale-105"
                style={{ backgroundImage: 'linear-gradient(90deg, rgba(6, 182, 212, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%)' }}
              >
                Acessar Dashboard
              </Link>
            </div>
          )}
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg shadow-xl p-6 hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 group">
            <div className="w-12 h-12 backdrop-blur-sm bg-cyan-400/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-lg font-semibold text-cyan-300 mb-2">
              Editais Abertos
            </h3>
            <p className="text-cyan-100/70">
              Visualização de todos os editais de concursos públicos disponíveis
            </p>
          </div>

          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg shadow-xl p-6 hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 group">
            <div className="w-12 h-12 backdrop-blur-sm bg-cyan-400/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-lg font-semibold text-cyan-300 mb-2">
              Interação
            </h3>
            <p className="text-cyan-100/70">
              Interaja com outros concurseiros na nossa comunidade dedicada
            </p>
          </div>

          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg shadow-xl p-6 hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 group">
            <div className="w-12 h-12 backdrop-blur-sm bg-cyan-400/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-cyan-300 mb-2">
              Acompanhamento
            </h3>
            <p className="text-cyan-100/70">
              Veja seu progresso em todos concursos realizados de forma pratica e visual
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
