'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AddConcursoModal from './AddConcursoModal';
import { useConcursos } from '@/lib/use-concursos';

export default function ConcursosList() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingAdd, setIsLoadingAdd] = useState(false);
  const { concursos, loading, error, adicionarConcurso, deletarConcurso } = useConcursos();

  const handleAddConcurso = async (nomeConcurso: string, numeroInscricao: string) => {
    setIsLoadingAdd(true);
    try {
      await adicionarConcurso(nomeConcurso, numeroInscricao);
    } catch {
      // Erro é tratado no hook
    } finally {
      setIsLoadingAdd(false);
    }
  };

  const handleDeleteConcurso = async (concursoId: string) => {
    if (confirm('Tem certeza que deseja remover este concurso?')) {
      try {
        await deletarConcurso(concursoId);
      } catch {
        // Erro é tratado no hook
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header com botão de adicionar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-100">Meus Concursos</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
        >
          <span className="text-2xl">+</span>
          Adicionar
        </button>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="rounded-md bg-red-900 bg-opacity-30 p-4 mb-4 border border-red-700">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Lista de concursos */}
      {concursos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            Você ainda não adicionou nenhum concurso.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            Adicionar seu primeiro concurso
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {concursos.map((concurso) => (
            <div
              key={concurso.id}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 transition-all cursor-pointer"
              onClick={() => router.push(`/meus-concursos/${concurso.id}`)}
            >
              {/* Header do card */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-100">
                    {concurso.nomeConcurso}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Inscrição: {concurso.numeroInscricao}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteConcurso(concurso.id);
                  }}
                  className="text-red-500 hover:text-red-400 text-xl transition-colors"
                  title="Remover concurso"
                >
                  ×
                </button>
              </div>

              {/* Status */}
              {concurso.status === 'sem_dados' ? (
                <div className="rounded-md bg-yellow-900 bg-opacity-30 p-3 border border-yellow-700">
                  <p className="text-sm text-yellow-300">
                    📋 Concurso ainda sem dados
                  </p>
                  <p className="text-xs text-yellow-400 mt-1">
                    Estamos buscando informações sobre este concurso...
                  </p>
                </div>
              ) : (
                <div className="rounded-md bg-green-900 bg-opacity-30 p-3 border border-green-700">
                  <p className="text-sm text-green-300 font-medium mb-2">
                    ✓ Informações do Concurso
                  </p>
                  <div className="space-y-1 text-sm text-green-400">
                    {concurso.dadosConcurso?.orgao && (
                      <p><strong>Órgão:</strong> {concurso.dadosConcurso.orgao}</p>
                    )}
                    {concurso.dadosConcurso?.cargo && (
                      <p><strong>Cargo:</strong> {concurso.dadosConcurso.cargo}</p>
                    )}
                    {concurso.dadosConcurso?.dataProva && (
                      <p><strong>Data da Prova:</strong> {concurso.dadosConcurso.dataProva}</p>
                    )}
                    {concurso.dadosConcurso?.status && (
                      <p><strong>Status:</strong> {concurso.dadosConcurso.status}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="mt-4 pt-4 border-t border-gray-800">
                <p className="text-xs text-gray-500">
                  Adicionado em {concurso.dataCriacao.toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para adicionar */}
      <AddConcursoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddConcurso}
        isLoading={isLoadingAdd}
      />
    </div>
  );
}
