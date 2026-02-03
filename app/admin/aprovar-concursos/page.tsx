'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useConcursosExternos } from '@/lib/use-concursos-externos';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GlassBackground from '@/components/GlassBackground';

interface ConcursoEditavel {
  id: string;
  nome: string;
  orgao: string;
  edital?: string;
  salario?: string;
  vagas?: number | string;
  status?: 'open' | 'closed' | 'expected';
  dataFinalInscricao?: string;
  dataProva?: string;
  dataEncerramento?: string;
  dataFechamento?: string;
  dataAbertura?: string;
  uf?: string;
   descricao?: string;
  raw?: any;
}

export default function AprovarConcursosPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const { concursos: concursosAPI, loading, error, sincronizado } = useConcursosExternos();
  
  const [editando, setEditando] = useState<string | null>(null);
  const [concursoEditado, setConcursoEditado] = useState<ConcursoEditavel | null>(null);
  const [concursosEditados, setConcursosEditados] = useState<Record<string, ConcursoEditavel>>({});
  const [aprovando, setAprovando] = useState<string | null>(null);
  const [ignorados, setIgnorados] = useState<Set<string>>(new Set());
  const [aprovados, setAprovados] = useState<Set<string>>(new Set());
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

   // Converter data DD/MM/YYYY para YYYY-MM-DD
   const converterDataParaISO = (data: string): string => {
     if (!data) return '';
     // Se já está em formato ISO (YYYY-MM-DD)
     if (/^\d{4}-\d{2}-\d{2}$/.test(data)) return data;
     // Se está em formato DD/MM/YYYY
     const match = data.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
     if (match) {
       const [, dia, mes, ano] = match;
       return `${ano}-${mes}-${dia}`;
     }
     return '';
   };

   // Converter data YYYY-MM-DD para DD/MM/YYYY
   const converterDataParaBR = (data: string): string => {
     if (!data) return '';
     const match = data.match(/^(\d{4})-(\d{2})-(\d{2})$/);
     if (match) {
       const [, ano, mes, dia] = match;
       return `${dia}/${mes}/${ano}`;
     }
     return data;
   };

  // Verificar se é admin
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    if (!userProfile?.isAdmin) {
      router.push('/');
      return;
    }
  }, [user, userProfile, authLoading, router]);

  const handleEditar = (concurso: any) => {
    setEditando(concurso.id);
    const concursoParaEditar = concursosEditados[concurso.id] || concurso;
    setConcursoEditado({
      ...concursoParaEditar,
      dataFinalInscricao: concursoParaEditar.dataFinalInscricao || concursoParaEditar.dataFechamento || '',
    });
  };

  const handleCancelarEdicao = () => {
    setEditando(null);
    setConcursoEditado(null);
  };

  const handleSalvarEdicao = () => {
    if (!concursoEditado || !editando) return;
    
    setConcursosEditados({
      ...concursosEditados,
      [editando]: concursoEditado
    });
    setEditando(null);
    setConcursoEditado(null);
    setMensagem({ tipo: 'sucesso', texto: 'Alterações salvas. Aprove para salvar no Firebase.' });
    setTimeout(() => setMensagem(null), 3000);
  };

  const handleAprovar = async (concurso: any) => {
    try {
      setAprovando(concurso.id);

      const token = await user?.getIdToken();
      if (!token) {
        throw new Error('Usuário não autenticado');
      }
      
      const concursoParaAprovar = concursosEditados[concurso.id] || concurso;
      
      const response = await fetch('/api/aprovar-concurso-externo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: concursoParaAprovar.nome,
          orgao: concursoParaAprovar.orgao,
          edital: concursoParaAprovar.edital || '',
          salario: concursoParaAprovar.salario || '',
          vagas: concursoParaAprovar.vagas || 0,
          status: concursoParaAprovar.status || 'open',
          dataFinalInscricao: converterDataParaBR(
            concursoParaAprovar.dataFinalInscricao || concursoParaAprovar.dataFechamento || ''
          ),
          dataProva: converterDataParaBR(concursoParaAprovar.dataProva || ''),
          dataEncerramento: converterDataParaBR(concursoParaAprovar.dataEncerramento || ''),
          dataAbertura: concursoParaAprovar.dataAbertura || '',
          descricao: concursoParaAprovar.descricao || '',
        }),
      });

      if (response.ok) {
        const novosEditados = { ...concursosEditados };
        delete novosEditados[concurso.id];
        setConcursosEditados(novosEditados);

        const novosAprovados = new Set(aprovados);
        novosAprovados.add(concurso.id);
        setAprovados(novosAprovados);
        
        setMensagem({ tipo: 'sucesso', texto: 'Concurso aprovado e salvo no Firebase!' });
        setTimeout(() => setMensagem(null), 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao aprovar concurso');
      }
    } catch (err) {
      const texto = err instanceof Error ? err.message : 'Erro ao aprovar concurso';
      setMensagem({ tipo: 'erro', texto });
    } finally {
      setAprovando(null);
    }
  };

  const handleIgnorar = (id: string) => {
    if (!confirm('Ignorar este concurso? Ele irá para o final da lista nesta sessão.')) {
      return;
    }

    const novosIgnorados = new Set(ignorados);
    novosIgnorados.add(id);
    setIgnorados(novosIgnorados);
    
    setMensagem({ tipo: 'sucesso', texto: 'Concurso ignorado' });
    setTimeout(() => setMensagem(null), 3000);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!user || !userProfile?.isAdmin) {
    return null;
  }

  // Filtrar concursos aprovados e ordenar ignorados para o final
  const concursosFiltrados = concursosAPI
    .filter((c) => !aprovados.has(c.id))
    .sort((a, b) => {
      const aIgnorado = ignorados.has(a.id);
      const bIgnorado = ignorados.has(b.id);
      if (aIgnorado === bIgnorado) return 0;
      return aIgnorado ? 1 : -1;
    });

  return (
    <div 
      className="min-h-screen relative overflow-hidden p-6"
      style={{
        backgroundImage:
          'linear-gradient(135deg, rgb(3, 7, 18) 0%, rgb(17, 24, 39) 50%, rgb(0, 0, 0) 100%)',
      }}
    >
      <GlassBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Cabeçalho */}
        <div className="mb-8">
          <Link href="/admin" className="text-cyan-400 hover:text-cyan-300 text-sm mb-4 inline-block">
            ← Voltar ao Admin
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Aprovar Concursos Externos</h1>
              <p className="text-cyan-200/70">Revise, edite e aprove concursos do PCI Concursos</p>
            </div>
          </div>
        </div>

        {/* Status da API */}
        <div className="mb-6 flex items-center gap-4 backdrop-blur-md bg-gray-900/40 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2">
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-500"></div>
            ) : sincronizado ? (
              <span className="text-cyan-400">✓</span>
            ) : null}
            <span className="text-cyan-100/90">
              {loading ? 'Buscando da API...' : sincronizado ? 'API carregada' : 'Aguardando...'}
            </span>
          </div>
          {concursosFiltrados.length > 0 && (
            <span className="text-sm text-cyan-200/60">
              {concursosFiltrados.length} concurso(s) para revisar
            </span>
          )}
        </div>

        {/* Mensagem */}
        {mensagem && (
          <div className={`mb-6 p-4 rounded-xl backdrop-blur-md border ${
            mensagem.tipo === 'sucesso' 
              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200' 
              : 'bg-red-500/10 border-red-500/30 text-red-200'
          }`}>
            <p className="font-semibold">{mensagem.texto}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl backdrop-blur-md border bg-red-500/10 border-red-500/30 text-red-200">
            <p className="font-semibold">⚠️ {error}</p>
          </div>
        )}

        {/* Lista de concursos */}
        {loading ? (
          <div className="text-center py-12 backdrop-blur-md bg-gray-900/40 border border-white/10 rounded-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-cyan-200/70 text-lg">Carregando concursos da API...</p>
          </div>
        ) : concursosFiltrados.length === 0 ? (
          <div className="text-center py-12 backdrop-blur-md bg-gray-900/40 border border-white/10 rounded-xl">
            <p className="text-cyan-200/70 text-lg">
              {concursosAPI.length === 0 ? 'Nenhum concurso encontrado na API' : 'Todos os concursos foram processados!'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {concursosFiltrados.map((concurso) => {
              const concursoExibido = concursosEditados[concurso.id] || concurso;
              return (
                <div
                  key={concurso.id}
                  className="backdrop-blur-md bg-gray-900/40 border border-white/10 rounded-xl hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/10 transition-all p-6"
                >
                  {editando === concurso.id && concursoEditado ? (
                    // Modo edição
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-400 block mb-2">Nome do Concurso</label>
                          <input
                            type="text"
                            value={concursoEditado.nome}
                            onChange={(e) => setConcursoEditado({ ...concursoEditado, nome: e.target.value })}
                            className="w-full px-3 py-2 backdrop-blur-sm bg-gray-800/60 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/50"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400 block mb-2">Órgão</label>
                          <input
                            type="text"
                            value={concursoEditado.orgao}
                            onChange={(e) => setConcursoEditado({ ...concursoEditado, orgao: e.target.value })}
                            className="w-full px-3 py-2 backdrop-blur-sm bg-gray-800/60 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/50"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400 block mb-2">Salário</label>
                          <input
                            type="text"
                            value={concursoEditado.salario || ''}
                            onChange={(e) => setConcursoEditado({ ...concursoEditado, salario: e.target.value })}
                            className="w-full px-3 py-2 backdrop-blur-sm bg-gray-800/60 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/50"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400 block mb-2">Vagas</label>
                          <input
                            type="number"
                            value={concursoEditado.vagas || 0}
                            onChange={(e) => setConcursoEditado({ ...concursoEditado, vagas: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 backdrop-blur-sm bg-gray-800/60 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/50"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm text-gray-400 block mb-2">Edital (URL)</label>
                          <input
                            type="url"
                            value={concursoEditado.edital || ''}
                            onChange={(e) => setConcursoEditado({ ...concursoEditado, edital: e.target.value })}
                            className="w-full px-3 py-2 backdrop-blur-sm bg-gray-800/60 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/50"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400 block mb-2">Data Final Inscrição</label>
                          <input
                            type="date"
                             value={converterDataParaISO(concursoEditado.dataFinalInscricao || '')}
                             onChange={(e) => setConcursoEditado({ ...concursoEditado, dataFinalInscricao: converterDataParaBR(e.target.value) })}
                            className="w-full px-3 py-2 backdrop-blur-sm bg-gray-800/60 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/50"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400 block mb-2">Data da Prova</label>
                          <input
                            type="date"
                            value={converterDataParaISO(concursoEditado.dataProva || '')}
                            onChange={(e) => setConcursoEditado({ ...concursoEditado, dataProva: converterDataParaBR(e.target.value) })}
                            className="w-full px-3 py-2 backdrop-blur-sm bg-gray-800/60 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/50"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400 block mb-2">Data de Encerramento</label>
                          <input
                            type="date"
                            value={converterDataParaISO(concursoEditado.dataEncerramento || '')}
                            onChange={(e) => setConcursoEditado({ ...concursoEditado, dataEncerramento: converterDataParaBR(e.target.value) })}
                            className="w-full px-3 py-2 backdrop-blur-sm bg-gray-800/60 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/50"
                          />
                        </div>
                         <div>
                           <label className="text-sm text-gray-400 block mb-2">UF</label>
                           <input
                             type="text"
                             value={concursoEditado.uf || ''}
                             onChange={(e) => setConcursoEditado({ ...concursoEditado, uf: e.target.value })}
                             className="w-full px-3 py-2 backdrop-blur-sm bg-gray-800/60 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/50"
                             placeholder="Ex: SP, RJ, MG"
                           />
                         </div>
                         <div className="md:col-span-2">
                           <label className="text-sm text-gray-400 block mb-2">Descrição (opcional)</label>
                           <textarea
                             value={concursoEditado.descricao || ''}
                             onChange={(e) => setConcursoEditado({ ...concursoEditado, descricao: e.target.value })}
                             rows={3}
                             className="w-full px-3 py-2 backdrop-blur-sm bg-gray-800/60 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/50"
                             placeholder="Informações adicionais sobre o concurso..."
                           />
                         </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <button
                          onClick={handleSalvarEdicao}
                          className="flex-1 backdrop-blur-sm bg-cyan-500/10 border border-cyan-400/30 hover:bg-cyan-500/20 text-cyan-100 py-2 px-4 rounded-xl transition-all font-semibold shadow-lg hover:shadow-cyan-500/20"
                        >
                          ✓ Salvar Alterações
                        </button>
                        <button
                          onClick={handleCancelarEdicao}
                          className="flex-1 backdrop-blur-sm bg-gray-500/10 border border-gray-400/30 hover:bg-gray-500/20 text-gray-100 py-2 px-4 rounded-xl transition-all font-semibold"
                        >
                          ✕ Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Modo visualização
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">{concursoExibido.nome}</h3>
                          <p className="text-gray-400">
                            <span className="font-semibold">Órgão:</span> {concursoExibido.orgao}
                          </p>
                          {concursoExibido.edital && (
                            <a
                              href={concursoExibido.edital}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-400 hover:text-cyan-300 text-sm"
                            >
                              Ver edital →
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {ignorados.has(concurso.id) && (
                            <span className="text-xs bg-gray-700 text-gray-200 px-2 py-1 rounded">
                              Ignorado
                            </span>
                          )}
                          {concursosEditados[concurso.id] && (
                            <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded">
                              Editado
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {concursoExibido.salario && (
                          <div>
                            <p className="text-gray-500 text-sm">Salário</p>
                            <p className="text-white">{concursoExibido.salario}</p>
                          </div>
                        )}
                        {concursoExibido.vagas !== undefined && (
                          <div>
                            <p className="text-gray-500 text-sm">Vagas</p>
                            <p className="text-white">{concursoExibido.vagas}</p>
                          </div>
                        )}
                        {concursoExibido.status && (
                          <div>
                            <p className="text-gray-500 text-sm">Status</p>
                            <p className="text-white capitalize">
                              {concursoExibido.status === 'open' ? 'Aberto' : 'Previsto'}
                            </p>
                          </div>
                        )}
                        {(concursoExibido.dataFinalInscricao || concursoExibido.dataFechamento) && (
                          <div>
                            <p className="text-gray-500 text-sm">Data Final Inscrição</p>
                            <p className="text-white">
                              {concursoExibido.dataFinalInscricao || concursoExibido.dataFechamento}
                            </p>
                          </div>
                        )}
                      </div>

                      {concursoExibido.raw && (
                        <details className="mt-4">
                          <summary className="text-cyan-400 text-sm cursor-pointer">
                            Ver dados brutos da API
                          </summary>
                          <pre className="mt-2 p-3 bg-black/40 border border-gray-800 rounded text-xs text-gray-300 overflow-auto">
                            {JSON.stringify(concursoExibido.raw, null, 2)}
                          </pre>
                        </details>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditar(concurso)}
                          className="px-4 py-2 backdrop-blur-sm bg-blue-500/10 border border-blue-400/30 hover:bg-blue-500/20 text-blue-100 rounded-xl transition-all font-semibold shadow-lg hover:shadow-blue-500/20"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleAprovar(concurso)}
                          disabled={aprovando === concurso.id}
                          className="px-4 py-2 backdrop-blur-sm bg-emerald-500/10 border border-emerald-400/30 hover:bg-emerald-500/20 text-emerald-100 rounded-xl transition-all font-semibold shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {aprovando === concurso.id ? 'Aprovando...' : '✓ Aprovar'}
                        </button>
                        <button
                          onClick={() => handleIgnorar(concurso.id)}
                          className="px-4 py-2 backdrop-blur-sm bg-red-500/10 border border-red-400/30 hover:bg-red-500/20 text-red-100 rounded-xl transition-all font-semibold shadow-lg hover:shadow-red-500/20"
                        >
                          ✕ Ignorar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
