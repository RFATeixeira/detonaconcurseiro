'use client';

import { useConcursosData, ConcursoData } from '@/lib/use-concursos-data';
import { useState, useMemo } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useConcursos } from '@/lib/use-concursos';
import Link from 'next/link';
import GlassBackground from './GlassBackground';

export default function ConcursosDisponivelsList() {
  const { concursosData, loading: loadingInternos, atualizarConcursoData } = useConcursosData();
  const { user, userProfile } = useAuth();
  const { adicionarConcurso, concursos, error } = useConcursos();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBanca, setFilterBanca] = useState('');
  const [filterStatus, setFilterStatus] = useState('open');
  const [addingId, setAddingId] = useState<string | null>(null);
  const [addingError, setAddingError] = useState<string | null>(null);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [concursoEditado, setConcursoEditado] = useState<ConcursoData | null>(null);
  const [salvandoId, setSalvandoId] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<string[]>(
    concursos.map(c => c.nomeConcurso)
  );

  // Usar apenas concursos internos aprovados
  const parseDate = (value?: string) => {
    if (!value) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split('-').map(Number);
      return new Date(y, m - 1, d);
    }
    const brMatch = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (brMatch) {
      const [, dia, mes, ano] = brMatch;
      return new Date(Number(ano), Number(mes) - 1, Number(dia));
    }
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const getStatusByDates = (c: ConcursoData): 'open' | 'expected' | 'closed' => {
    const today = new Date();
    const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dataEncerramento = parseDate(c.dataEncerramento);
    const dataFinal = parseDate(c.dataFinalInscricao);

    if (dataEncerramento && todayMid > dataEncerramento) return 'closed';
    if (dataFinal && todayMid > dataFinal) return 'expected';
    return 'open';
  };

  const todosConcursos = useMemo(() => {
    return concursosData.map(c => ({
      id: c.id,
      nome: c.nomeConcurso,
      orgao: c.banca || 'Banca desconhecida',
      salario: c.salario || 'A definir',
      vagas: 0,
      status: getStatusByDates(c),
      original: c,
    }));
  }, [concursosData]);

  // Filtrar concursos
  const filteredConcursos = useMemo(() => {
    return todosConcursos.filter((concurso) => {
      const nome = (concurso.nome || '').toLowerCase();
      const orgao = (concurso.orgao || '').toLowerCase();
      const search = searchTerm.toLowerCase();
      const matchesSearch = nome.includes(search) || orgao.includes(search);
      const matchesBanca = !filterBanca || concurso.orgao === filterBanca;
      const matchesStatus = !filterStatus || concurso.status === filterStatus;
      return matchesSearch && matchesBanca && matchesStatus;
    });
  }, [todosConcursos, searchTerm, filterBanca, filterStatus]);

  const statusLabel = (status: 'open' | 'closed' | 'expected') => {
    if (status === 'closed') return 'Encerrado';
    if (status === 'expected') return 'Em andamento';
    return 'Edital Aberto';
  };

  const statusBadgeClass = (status: 'open' | 'closed' | 'expected') => {
    if (status === 'closed') return 'bg-red-600/20 text-red-300 border border-red-500/40';
    if (status === 'expected') return 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/40';
    return 'bg-green-600/20 text-green-300 border border-green-500/40';
  };

  const formatDateBR = (value?: string) => {
    if (!value) return 'A definir';
    const parsed = parseDate(value);
    if (!parsed) return 'A definir';
    return parsed.toLocaleDateString('pt-BR');
  };

  // Bancos/Órgãos únicos para filtro
  const bancos = useMemo(() => {
    return Array.from(new Set(todosConcursos.map((c) => c.orgao))).sort();
  }, [todosConcursos]);

  // Adicionar concurso aos "meus concursos"
  const handleAddConcurso = async (concurso: any) => {
    if (!user) {
      alert('Você precisa estar logado para adicionar concursos');
      return;
    }

    try {
      setAddingError(null);
      setAddingId(concurso.id);
      await adicionarConcurso(concurso.nome, 'inscricao-pendente');
      setAddedIds([...addedIds, concurso.nome]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao adicionar concurso';
      setAddingError(errorMsg);
    } finally {
      setAddingId(null);
    }
  };

  const toInputDate = (value: string) => {
    if (!value) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const brMatch = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (brMatch) {
      const [, dia, mes, ano] = brMatch;
      return `${ano}-${mes}-${dia}`;
    }
    const parsed = new Date(value);
    if (isNaN(parsed.getTime())) return '';
    return parsed.toISOString().slice(0, 10);
  };

  const toFirestoreDate = (value: string) => {
    if (!value) return '';
    return new Date(`${value}T12:00:00.000Z`).toISOString();
  };

  const handleEditarConcurso = (concurso: any) => {
    if (!concurso.original) return;
    setEditError(null);
    setEditandoId(concurso.id);
    setConcursoEditado({ ...concurso.original });
  };

  const handleCancelarEdicao = () => {
    setEditandoId(null);
    setConcursoEditado(null);
    setEditError(null);
  };

  const handleSalvarEdicao = async () => {
    if (!concursoEditado) return;
    try {
      setEditError(null);
      setSalvandoId(concursoEditado.id);
      await atualizarConcursoData(
        concursoEditado.id,
        concursoEditado.nomeConcurso,
        concursoEditado.banca,
        concursoEditado.cargo,
        concursoEditado.salario,
        toFirestoreDate(toInputDate(concursoEditado.dataProva)),
        toFirestoreDate(toInputDate(concursoEditado.dataFinalInscricao || '')),
        toFirestoreDate(toInputDate(concursoEditado.dataEncerramento || '')),
        concursoEditado.edital,
        concursoEditado.descricao || ''
      );
      setEditandoId(null);
      setConcursoEditado(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar concurso';
      setEditError(message);
    } finally {
      setSalvandoId(null);
    }
  };

  const isAdded = (nome: string) => addedIds.includes(nome);
  const isLoading = loadingInternos;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-[rgb(3,7,18)] via-[rgb(17,24,39)] to-[rgb(0,0,0)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[rgb(3,7,18)] via-[rgb(17,24,39)] to-[rgb(0,0,0)] relative">
      <GlassBackground />
      
      <div className="relative z-10 space-y-6 px-4 py-8">
      {editError && (
        <div className="bg-red-900 bg-opacity-30 border border-red-700 text-red-300 px-4 py-3 rounded">
          <p className="font-semibold">⚠️ {editError}</p>
          <button
            onClick={() => setEditError(null)}
            className="mt-2 text-sm underline hover:no-underline transition-colors"
          >
            Descartar
          </button>
        </div>
      )}
      {/* Mensagem de erro */}
      {addingError && (
        <div className="bg-red-900 bg-opacity-30 border border-red-700 text-red-300 px-4 py-3 rounded">
          <p className="font-semibold">⚠️ {addingError}</p>
          <button
            onClick={() => setAddingError(null)}
            className="mt-2 text-sm underline hover:no-underline transition-colors"
          >
            Descartar
          </button>
        </div>
      )}

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Buscar por nome ou órgão..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-100 placeholder-gray-500"
        />

        <select
          value={filterBanca}
          onChange={(e) => setFilterBanca(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-100"
        >
          <option value="">Todas as Bancas/Órgãos</option>
          {bancos.map((banca) => (
            <option key={banca} value={banca}>
              {banca}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-100"
        >
          <option value="">Todos os Status</option>
          <option value="open">Edital Aberto</option>
          <option value="expected">Em andamento</option>
          <option value="closed">Encerrado</option>
        </select>

        <div className="text-sm text-gray-400 flex items-center">
          {filteredConcursos.length} concurso(s) encontrado(s)
        </div>
      </div>

      {/* Lista de Concursos */}
      {filteredConcursos.length === 0 ? (
        <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-lg">
          <p className="text-gray-400 text-lg">Nenhum concurso encontrado com esses filtros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConcursos.map((concurso) => (
            <div
              key={concurso.id}
              className="bg-gray-900 border border-gray-800 rounded-lg hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 transition-all overflow-hidden"
            >
              {/* Cabeçalho */}
              <div className="bg-linear-to-r from-cyan-600 to-cyan-700 text-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold truncate">{concurso.nome}</h3>
                    <p className="text-cyan-100 text-sm truncate">{concurso.orgao}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded whitespace-nowrap ${statusBadgeClass(concurso.status)}`}
                  >
                    {statusLabel(concurso.status)}
                  </span>
                </div>
              </div>

              {/* Corpo */}
              <div className="p-4 space-y-3">
                {concurso.vagas > 0 && (
                  <div>
                    <p className="text-sm text-gray-400">Vagas</p>
                    <p className="font-semibold text-gray-100">{concurso.vagas}</p>
                  </div>
                )}

                {concurso.salario && concurso.salario !== 'A definir' && (
                  <div>
                    <p className="text-sm text-gray-400">Salário</p>
                    <p className="font-semibold text-cyan-300">{concurso.salario}</p>
                  </div>
                )}

                {concurso.original?.cargo && (
                  <div>
                    <p className="text-sm text-gray-400">Cargo</p>
                    <p className="font-semibold text-gray-100">{concurso.original.cargo}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-400">
                    {concurso.status === 'open'
                      ? 'Data Final Inscrição'
                      : concurso.status === 'expected'
                      ? 'Data da Prova'
                      : 'Data de Encerramento'}
                  </p>
                  <p className="font-semibold text-gray-100">
                    {concurso.status === 'open'
                      ? formatDateBR(concurso.original?.dataFinalInscricao)
                      : concurso.status === 'expected'
                      ? formatDateBR(concurso.original?.dataProva)
                      : formatDateBR(concurso.original?.dataEncerramento)}
                  </p>
                </div>

                {concurso.original?.descricao && (
                  <div>
                    <p className="text-sm text-gray-400">Descrição</p>
                    <p className="text-gray-300 text-sm line-clamp-2">{concurso.original.descricao}</p>
                  </div>
                )}
              </div>

              {userProfile?.isAdmin && editandoId === concurso.id && concursoEditado && (
                <div className="p-4 border-t border-gray-800 bg-gray-900/80 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-400">Nome</label>
                      <input
                        value={concursoEditado.nomeConcurso}
                        onChange={(e) => setConcursoEditado({ ...concursoEditado, nomeConcurso: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Banca</label>
                      <input
                        value={concursoEditado.banca}
                        onChange={(e) => setConcursoEditado({ ...concursoEditado, banca: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Cargo</label>
                      <input
                        value={concursoEditado.cargo}
                        onChange={(e) => setConcursoEditado({ ...concursoEditado, cargo: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Salário até</label>
                      <input
                        value={concursoEditado.salario}
                        onChange={(e) => setConcursoEditado({ ...concursoEditado, salario: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Data da Prova</label>
                      <input
                        type="date"
                        value={toInputDate(concursoEditado.dataProva)}
                        onChange={(e) => setConcursoEditado({ ...concursoEditado, dataProva: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Data Final Inscrição</label>
                      <input
                        type="date"
                        value={toInputDate(concursoEditado.dataFinalInscricao || '')}
                        onChange={(e) => setConcursoEditado({ ...concursoEditado, dataFinalInscricao: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Data de Encerramento</label>
                      <input
                        type="date"
                        value={toInputDate(concursoEditado.dataEncerramento || '')}
                        onChange={(e) => setConcursoEditado({ ...concursoEditado, dataEncerramento: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Edital (URL)</label>
                      <input
                        value={concursoEditado.edital}
                        onChange={(e) => setConcursoEditado({ ...concursoEditado, edital: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs text-gray-400">Descrição</label>
                      <textarea
                        rows={2}
                        value={concursoEditado.descricao || ''}
                        onChange={(e) => setConcursoEditado({ ...concursoEditado, descricao: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleSalvarEdicao}
                      disabled={salvandoId === concurso.id}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded disabled:opacity-50"
                    >
                      {salvandoId === concurso.id ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button
                      onClick={handleCancelarEdicao}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Rodapé */}
              <div className="bg-gray-800 p-4 border-t border-gray-700 space-y-2 h-full">
                {concurso.original?.edital && (
                  <a
                    href={concurso.original.edital}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center text-cyan-400 hover:text-cyan-300 text-sm font-semibold py-2 hover:bg-gray-700 rounded transition-colors"
                  >
                    Ver Edital →
                  </a>
                )}

                {!user ? (
                  <Link
                    href="/login"
                    className="block w-full text-center bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded transition-colors font-semibold"
                  >
                    Login para Adicionar
                  </Link>
                ) : isAdded(concurso.nome) ? (
                  <button
                    disabled
                    className="w-full bg-gray-700 text-gray-400 py-2 px-4 rounded cursor-not-allowed font-semibold"
                  >
                    ✓ Adicionado
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddConcurso(concurso)}
                    disabled={addingId === concurso.id}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded disabled:bg-gray-700 disabled:text-gray-400 transition-colors font-semibold"
                  >
                    {addingId === concurso.id ? 'Adicionando...' : 'Adicionar aos Meus'}
                  </button>
                )}

                {userProfile?.isAdmin && (
                  <button
                    onClick={() => handleEditarConcurso(concurso)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors font-semibold"
                  >
                    ✏️ Editar (Admin)
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
