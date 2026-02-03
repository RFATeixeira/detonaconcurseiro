'use client';

import { useState } from 'react';
import { useConcursosData } from '@/lib/use-concursos-data';

interface AddConcursoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (nomeConcurso: string, numeroInscricao: string) => Promise<void>;
  isLoading: boolean;
}

export default function AddConcursoModal({
  isOpen,
  onClose,
  onAdd,
  isLoading,
}: AddConcursoModalProps) {
  const { concursosData } = useConcursosData();
  const [nomeConcurso, setNomeConcurso] = useState('');
  const [numeroInscricao, setNumeroInscricao] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validações
    if (!nomeConcurso.trim()) {
      setError('Nome do concurso é obrigatório');
      return;
    }

    if (!numeroInscricao.trim()) {
      setError('Número de inscrição é obrigatório');
      return;
    }

    try {
      await onAdd(nomeConcurso, numeroInscricao);
      setNomeConcurso('');
      setNumeroInscricao('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar concurso');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-2xl p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-gray-100 mb-4">
          Adicionar Novo Concurso
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-900 bg-opacity-30 p-3 border border-red-700">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-300">
              Nome do Concurso
            </label>
            {concursosData.length === 0 ? (
              <div className="mt-1 p-3 bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded-md text-sm text-yellow-300">
                ⚠️ Nenhum concurso cadastrado. Crie um concurso primeiro na aba Admin.
              </div>
            ) : (
              <select
                id="nome"
                value={nomeConcurso}
                onChange={(e) => setNomeConcurso(e.target.value)}
                className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-gray-100"
                disabled={isLoading}
              >
                <option value="" className="bg-gray-900 text-gray-100">-- Selecione um concurso --</option>
                {concursosData.map((concurso) => (
                  <option key={concurso.id} value={concurso.nomeConcurso} className="bg-gray-900 text-gray-100">
                    {concurso.nomeConcurso} - {concurso.banca}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label htmlFor="inscricao" className="block text-sm font-medium text-gray-300">
              Número de Inscrição
            </label>
            <input
              id="inscricao"
              type="text"
              value={numeroInscricao}
              onChange={(e) => setNumeroInscricao(e.target.value)}
              placeholder="Ex: 123456789"
              className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-gray-100 placeholder-gray-500"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-800 disabled:bg-gray-700 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Adicionando...' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
