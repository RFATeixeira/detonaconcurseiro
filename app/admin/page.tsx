'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AddConcursoDataForm from '@/components/AddConcursoDataForm';
import ImportarPlanilha from '@/components/ImportarPlanilha';
import { useConcursosData } from '@/lib/use-concursos-data';
import Link from 'next/link';

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
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-black">
      {/* Header */}
      <div className="bg-linear-to-r from-cyan-900/30 to-blue-900/30 border-b border-cyan-500/20 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                🛡️ Painel Administrativo
              </h1>
              <p className="text-gray-400 text-sm mt-1">Gerenciar concursos e aprovações</p>
            </div>
            <Link
              href="/"
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              ← Voltar
            </Link>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Botão de Aprovar Concursos Externos */}
        <div className="bg-linear-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-lg p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Concursos Externos Pendentes</h3>
              <p className="text-gray-400 text-sm">Revise e aprove concursos importados da API</p>
            </div>
            <Link
              href="/admin/aprovar-concursos"
              className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-purple-500/30 whitespace-nowrap"
            >
              📋 Gerenciar Aprovações
            </Link>
          </div>
        </div>

        {/* Formulário de Adicionar */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 shadow-xl hover:border-cyan-500/30 transition-colors">
          <h2 className="text-2xl font-bold text-white mb-1">Novo Concurso</h2>
          <p className="text-gray-400 text-sm mb-6">Adicione um novo concurso manualmente ao sistema</p>
          <AddConcursoDataForm />
        </div>

        {/* Importar Planilha */}
        <div>
          {concursosData.length === 0 ? (
            <div className="bg-yellow-900/20 border border-yellow-600/30 backdrop-blur-sm p-6 rounded-lg">
              <p className="text-yellow-400 font-semibold">⚠️ Crie um concurso primeiro antes de importar candidatos.</p>
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 shadow-xl hover:border-cyan-500/30 transition-colors">
              <h2 className="text-2xl font-bold text-white mb-1">Importar Candidatos</h2>
              <p className="text-gray-400 text-sm mb-6">Importe candidatos para um concurso existente via planilha</p>
              <select
                value={concursoSelecionado}
                onChange={(e) => setConcursoSelecionado(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-100 mb-6 font-semibold"
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
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 shadow-xl hover:border-cyan-500/30 transition-colors">
          <h2 className="text-2xl font-bold text-white mb-6">Concursos Cadastrados</h2>

          {concursosData.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Nenhum concurso cadastrado ainda.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800/50 border-b border-gray-700">
                    <th className="p-4 text-left text-gray-300 font-semibold">Nome</th>
                    <th className="p-4 text-left text-gray-300 font-semibold">Banca</th>
                    <th className="p-4 text-left text-gray-300 font-semibold">Cargo</th>
                    <th className="p-4 text-left text-gray-300 font-semibold">Data Prova</th>
                    <th className="p-4 text-center text-gray-300 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {concursosData.map((concurso, idx) => (
                    <tr 
                      key={concurso.id} 
                      className={`${idx % 2 === 0 ? 'bg-gray-900/50' : 'bg-gray-800/30'} border-b border-gray-700 hover:bg-gray-800/50 transition-colors`}
                    >
                      <td className="p-4 text-gray-300 font-medium">{concurso.nomeConcurso}</td>
                      <td className="p-4 text-gray-300">{concurso.banca}</td>
                      <td className="p-4 text-gray-300">{concurso.cargo}</td>
                      <td className="p-4 text-gray-300">
                        {new Date(concurso.dataProva).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {concurso.documentoURL && (
                            <a
                              href={concurso.documentoURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
                            >
                              📥 Ver
                            </a>
                          )}
                          <button
                            onClick={() => handleDelete(concurso.id)}
                            disabled={isDeleting === concurso.id}
                            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:text-gray-400 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
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
