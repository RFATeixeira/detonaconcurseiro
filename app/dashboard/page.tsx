'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useConcursos } from '@/lib/use-concursos';
import { useConcursosData } from '@/lib/use-concursos-data';
import { useCandidatoDetalhes } from '@/lib/use-candidato-detalhes';
import GlassBackground from '@/components/GlassBackground';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, userProfile, loading } = useAuth();
  const { concursos } = useConcursos();
  const { concursosData } = useConcursosData();
  const router = useRouter();

  // Buscar dados do primeiro candidato para pegar o nome
  const primeiroConcurso = concursos[0];
  const { candidato } = useCandidatoDetalhes(
    primeiroConcurso?.nomeConcurso || '',
    primeiroConcurso?.numeroInscricao || ''
  );

  // Calcular estatísticas
  const totalConcursos = concursos.length;
  const totalDisponiveis = concursosData.length;
  const melhorClassificacao = concursos.reduce((melhor, concurso) => {
    // Aqui podemos adicionar lógica futura para pegar a melhor classificação
    return melhor;
  }, '-');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 relative overflow-hidden" style={{ backgroundImage: 'linear-gradient(135deg, rgb(3, 7, 18) 0%, rgb(17, 24, 39) 50%, rgb(0, 0, 0) 100%)' }}>
        <GlassBackground />
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden" style={{ backgroundImage: 'linear-gradient(135deg, rgb(3, 7, 18) 0%, rgb(17, 24, 39) 50%, rgb(0, 0, 0) 100%)' }}>
      <GlassBackground />
      
      <main className="relative z-10 max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Card Lateral Esquerdo - Dados do Concurseiro */}
          <div className="lg:col-span-1">
            <div className="backdrop-blur-sm bg-white/5 rounded-xl shadow-2xl border border-white/10 overflow-hidden hover:border-cyan-500/30 transition-all duration-300 p-6">
              <h2 className="text-lg font-bold text-white mb-6 pb-3 border-b border-white/10">
                Dados do Concurseiro
              </h2>
              
              <div className="space-y-5">
                {/* Nome */}
                <div>
                  <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-1.5">Nome</h3>
                  <p className="text-sm text-gray-100 font-medium break">
                    {candidato?.nomeCandidato || userProfile?.displayName || 'Não informado'}
                  </p>
                </div>

                {/* Email */}
                <div>
                  <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-1.5">Email</h3>
                  <p className="text-sm text-gray-100 font-medium break">{user.email}</p>
                </div>

                {/* CPF Semi-escondido */}
                {userProfile && (
                  <div>
                    <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-1.5">CPF</h3>
                    <p className="text-sm text-gray-100 font-medium font-mono">
                      {userProfile.cpf.replace(
                        /(\d{3})(\d{3})(\d{3})(\d{2})/,
                        '***.$2.***-**'
                      )}
                    </p>
                  </div>
                )}

                {/* Data de Nascimento */}
                {userProfile?.dateOfBirth && (
                  <div>
                    <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-1.5">Data de Nascimento</h3>
                    <p className="text-sm text-gray-100 font-medium">
                      {userProfile.dateOfBirth.split('-').reverse().join('/')}
                    </p>
                  </div>
                )}

                {/* Membro desde */}
                <div>
                  <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-1.5">Membro desde</h3>
                  <p className="text-sm text-gray-100 font-medium">
                    {userProfile
                      ? new Date(userProfile.createdAt).toLocaleDateString('pt-BR')
                      : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Área Principal Direita */}
          <div className="lg:col-span-3 space-y-6">
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/meus-concursos"
                className="flex-1 group relative overflow-hidden px-6 py-4 backdrop-blur-sm text-white rounded-xl font-semibold text-center transition-all shadow-lg border border-cyan-400/30 hover:border-cyan-400/60 hover:shadow-cyan-500/50 hover:scale-105"
                style={{ backgroundImage: 'linear-gradient(90deg, rgba(6, 182, 212, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%)' }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  📚 Ver meus concursos
                </span>
              </Link>
              <Link
                href="/concursos-disponiveis"
                className="flex-1 group relative overflow-hidden px-6 py-4 backdrop-blur-sm bg-white/5 hover:bg-white/10 text-gray-100 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/50 rounded-xl font-semibold text-center transition-all shadow-lg hover:scale-105"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  🔍 Explorar concursos
                </span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/10 hover:border-cyan-400/50 hover:bg-white/10 transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyan-300 text-sm font-medium">Meus Concursos</p>
                    <p className="text-3xl font-bold text-white mt-2 drop-shadow-lg">{totalConcursos}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {totalConcursos === 1 ? 'concurso inscrito' : 'concursos inscritos'}
                    </p>
                  </div>
                  <div className="text-4xl group-hover:scale-110 transition-transform">🎯</div>
                </div>
              </div>

              <div className="backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/10 hover:border-cyan-400/50 hover:bg-white/10 transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyan-300 text-sm font-medium">Disponíveis</p>
                    <p className="text-3xl font-bold text-white mt-2 drop-shadow-lg">{totalDisponiveis}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {totalDisponiveis === 1 ? 'concurso disponível' : 'concursos disponíveis'}
                    </p>
                  </div>
                  <div className="text-4xl group-hover:scale-110 transition-transform">📋</div>
                </div>
              </div>

              <div className="backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/10 hover:border-cyan-400/50 hover:bg-white/10 transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyan-300 text-sm font-medium">Melhor Classificação</p>
                    <p className="text-3xl font-bold text-white mt-2 drop-shadow-lg">
                      {candidato?.novaClassificacao ? `${candidato.novaClassificacao}º` : '-'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {primeiroConcurso?.nomeConcurso || 'sem dados'}
                    </p>
                  </div>
                  <div className="text-4xl group-hover:scale-110 transition-transform">🏆</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
