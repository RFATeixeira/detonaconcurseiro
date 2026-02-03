'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AddConcursoDataForm from '@/components/AddConcursoDataForm';
import ImportarPlanilha from '@/components/ImportarPlanilha';
import { useConcursosData } from '@/lib/use-concursos-data';
import Link from 'next/link';
import GlassBackground from '@/components/GlassBackground';

export default function AdminPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const { concursosData, deletarConcursoData } = useConcursosData();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [concursoSelecionado, setConcursoSelecionado] = useState<string>('');

  useEffect(() => {
    if (!loading && (!user || !userProfile?.isAdmin)) {
      router.push('/login');
    }
  }, [user, userProfile, loading, router]);

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este concurso?')) {
      try {
        setIsDeleting(id);
        await deletarConcursoData(id);
      } catch (err) {
        alert('Erro ao deletar concurso');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!user || !userProfile?.isAdmin) {
    return null;
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage:
          'linear-gradient(135deg, rgb(3, 7, 18) 0%, rgb(17, 24, 39) 50%, rgb(0, 0, 0) 100%)',
      }}
    >
      <GlassBackground />

      {/* Header */}
      <div className="backdrop-blur-md bg-gray-900/40 border-b border-cyan-500/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                🛡️ Painel Administrativo
              </h1>
              <p className="text-cyan-200/70 text-sm mt-1">Gerenciar concursos e aprovações</p>
            </div>
            <Link
              href="/"
              className="text-cyan-200/70 hover:text-cyan-400 transition-colors"
            >
              ← Voltar
            </Link>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 relative z-10">
        {/* Botão de Aprovar Concursos Externos */}
        <div className="backdrop-blur-md bg-linear-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/40 transition-all shadow-lg shadow-cyan-500/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Concursos Externos Pendentes</h3>
              <p className="text-cyan-200/60 text-sm">Revise e aprove concursos importados da API</p>
            </div>
            <Link
              href="/admin/aprovar-concursos"
              className="backdrop-blur-sm bg-cyan-500/10 border border-cyan-400/30 hover:bg-cyan-500/20 hover:border-cyan-400/60 text-cyan-100 px-8 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-cyan-500/20 whitespace-nowrap"
            >
              📋 Gerenciar Aprovações
            </Link>
          </div>
        </div>

        {/* Formulário de Adicionar */}
        <div className="backdrop-blur-md bg-gray-900/40 border border-white/10 rounded-xl p-8 shadow-xl hover:border-cyan-400/40 transition-all hover:shadow-cyan-500/10">
          <h2 className="text-2xl font-bold text-white mb-1">Novo Concurso</h2>
          <p className="text-cyan-200/60 text-sm mb-6">Adicione um novo concurso manualmente ao sistema</p>
          <AddConcursoDataForm />
        </div>

        {/* Importar Planilha */}
        <div>
          {concursosData.length === 0 ? (
            <div className="backdrop-blur-md bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-xl">
              <p className="text-yellow-200 font-semibold">⚠️ Crie um concurso primeiro antes de importar candidatos.</p>
            </div>
          ) : (
            <div className="backdrop-blur-md bg-gray-900/40 border border-white/10 rounded-xl p-8 shadow-xl hover:border-cyan-400/40 transition-all hover:shadow-cyan-500/10">
              <h2 className="text-2xl font-bold text-white mb-1">Importar Candidatos</h2>
              <p className="text-cyan-200/60 text-sm mb-6">Importe candidatos para um concurso existente via planilha</p>
              <select
                value={concursoSelecionado}
                onChange={(e) => setConcursoSelecionado(e.target.value)}
                className="w-full px-4 py-3 backdrop-blur-sm bg-gray-800/60 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/50 text-gray-100 mb-6 font-semibold"
              >
                <option value="">-- Selecione um concurso --</option>
                {concursosData.map((concurso) => (
                  <option key={concurso.id} value={concurso.nomeConcurso}>
                    {concurso.nomeConcurso} ({concurso.banca})
                  </option>
                ))}
              </select>

              {concursoSelecionado && (
                <ImportarPlanilha 
                  nomeConcurso={concursoSelecionado}
                  onSuccess={() => setConcursoSelecionado('')}
                />
              )}
            </div>
          )}
        </div>

        {/* Lista de Concursos Adicionados */}
        <div className="backdrop-blur-md bg-gray-900/40 border border-white/10 rounded-xl p-8 shadow-xl hover:border-cyan-400/40 transition-all hover:shadow-cyan-500/10">
          <h2 className="text-2xl font-bold text-white mb-6">Concursos Cadastrados</h2>

          {concursosData.length === 0 ? (
            <p className="text-cyan-200/60 text-center py-8">Nenhum concurso cadastrado ainda.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="backdrop-blur-sm bg-gray-800/50 border-b border-cyan-500/20">
                    <th className="p-4 text-left text-cyan-100 font-semibold">Nome</th>
                    <th className="p-4 text-left text-cyan-100 font-semibold">Banca</th>
                    <th className="p-4 text-left text-cyan-100 font-semibold">Cargo</th>
                    <th className="p-4 text-left text-cyan-100 font-semibold">Data Prova</th>
                    <th className="p-4 text-center text-cyan-100 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {concursosData.map((concurso, idx) => (
                    <tr 
                      key={concurso.id} 
                      className={`${idx % 2 === 0 ? 'bg-gray-900/30' : 'bg-gray-800/20'} border-b border-white/5 hover:bg-cyan-500/5 transition-colors`}
                    >
                      <td className="p-4 text-white font-medium">{concurso.nomeConcurso}</td>
                      <td className="p-4 text-cyan-100/80">{concurso.banca}</td>
                      <td className="p-4 text-cyan-100/80">{concurso.cargo}</td>
                      <td className="p-4 text-cyan-100/80">
                        {new Date(concurso.dataProva).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {concurso.documentoURL && (
                            <a
                              href={concurso.documentoURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="backdrop-blur-sm bg-cyan-500/10 border border-cyan-400/30 hover:bg-cyan-500/20 text-cyan-100 px-3 py-1 rounded-lg text-sm font-semibold transition-all"
                            >
                              📥 Ver
                            </a>
                          )}
                          <button
                            onClick={() => handleDelete(concurso.id)}
                            disabled={isDeleting === concurso.id}
                            className="backdrop-blur-sm bg-red-500/10 border border-red-400/30 hover:bg-red-500/20 disabled:bg-gray-700/50 disabled:text-gray-400 disabled:border-gray-600/30 text-red-100 px-3 py-1 rounded-lg text-sm font-semibold transition-all"
                          >
                            {isDeleting === concurso.id ? '⏳' : '🗑️'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
