'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCandidatoDetalhes } from '@/lib/use-candidato-detalhes';
import { useConcursos } from '@/lib/use-concursos';
import Navbar from '@/components/Navbar';

export default function DetalheConcursoPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const concursoId = params.concursoId as string;
  const { concursos } = useConcursos();
  const [concursoAtual, setConcursoAtual] = useState<any>(null);

  // Buscar dados do concurso do usuário
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    const concurso = concursos.find((c) => c.id === concursoId);
    setConcursoAtual(concurso);
  }, [concursos, concursoId, user, authLoading, router]);

  const { candidato, loading: candidatoLoading, error } = useCandidatoDetalhes(
    concursoAtual?.nomeConcurso || '',
    concursoAtual?.numeroInscricao || ''
  );

  if (authLoading || !concursoAtual) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Botão Voltar */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
        >
          ← Voltar
        </button>

        {/* Cabeçalho */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-6">
          <h1 className="text-4xl font-bold text-gray-100 mb-2">
            {concursoAtual.nomeConcurso}
          </h1>
          <p className="text-lg text-gray-300">{concursoAtual.dadosConcurso?.orgao}</p>
          <p className="text-sm text-gray-400 mt-2">
            Cargo: <span className="font-semibold text-gray-200">{concursoAtual.dadosConcurso?.cargo}</span>
          </p>
        </div>

        {/* Dados do Candidato */}
        {candidatoLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Carregando dados do candidato...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900 bg-opacity-30 border border-red-700 rounded-lg p-6">
            <p className="text-red-300 font-semibold">Erro ao carregar candidato</p>
            <p className="text-red-200">{error}</p>
          </div>
        ) : !candidato ? (
          <div className="bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded-lg p-6">
            <p className="text-yellow-300">
              ℹ️ Nenhum candidato encontrado com a inscrição {concursoAtual.numeroInscricao}
            </p>
          </div>
        ) : (
          <>
            {/* Informações do Candidato */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-100 mb-6">Informações do Candidato</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome Completo */}
                <div>
                  <p className="text-sm text-gray-400 font-medium">Nome Completo</p>
                  <p className="text-lg text-gray-100 font-semibold mt-1">
                    {candidato.nomeCandidato}
                  </p>
                </div>

                {/* Número de Inscrição */}
                <div>
                  <p className="text-sm text-gray-400 font-medium">Número de Inscrição</p>
                  <p className="text-lg text-gray-100 font-semibold mt-1">
                    {candidato.inscricao}
                  </p>
                </div>

                {/* Região */}
                <div>
                  <p className="text-sm text-gray-400 font-medium">Região</p>
                  <p className="text-lg text-gray-100 font-semibold mt-1">
                    {candidato.regiao}
                  </p>
                </div>

                {/* Afrodescendente */}
                <div>
                  <p className="text-sm text-gray-400 font-medium">Afrodescendente</p>
                  <p className="text-lg text-gray-100 font-semibold mt-1">
                    {candidato.afrodescendente || 'Não informado'}
                  </p>
                </div>
              </div>
            </div>

            {/* Notas e Desempenho */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-100 mb-6">Desempenho</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Nota Objetiva */}
                <div className="bg-gray-800 border border-cyan-500 border-opacity-30 rounded-lg p-6 hover:border-cyan-500 transition-colors">
                  <p className="text-sm text-cyan-400 font-medium">Nota Objetiva</p>
                  <p className="text-3xl font-bold text-cyan-300 mt-2">
                    {candidato.notaObjetiva.toFixed(2)}
                  </p>
                </div>

                {/* Nota Discursiva */}
                {candidato.notaDiscursiva !== undefined && (
                  <div className="bg-gray-800 border border-purple-500 border-opacity-30 rounded-lg p-6 hover:border-purple-500 transition-colors">
                    <p className="text-sm text-purple-400 font-medium">Nota Discursiva</p>
                    <p className="text-3xl font-bold text-purple-300 mt-2">
                      {candidato.notaDiscursiva.toFixed(2)}
                    </p>
                  </div>
                )}

                {/* Total Antes TAF */}
                <div className="bg-gray-800 border border-indigo-500 border-opacity-30 rounded-lg p-6 hover:border-indigo-500 transition-colors">
                  <p className="text-sm text-indigo-400 font-medium">Total (Antes TAF)</p>
                  <p className="text-3xl font-bold text-indigo-300 mt-2">
                    {candidato.notaTotalAntesTAF.toFixed(2)}
                  </p>
                </div>

                {/* Resultado TAF */}
                <div
                  className={`rounded-lg p-6 border transition-colors ${
                    candidato.resultadoTAF === 'Aprovado'
                      ? 'bg-green-900 bg-opacity-30 border-green-500 border-opacity-30 hover:border-green-500'
                      : candidato.resultadoTAF === 'Reprovado'
                      ? 'bg-red-900 bg-opacity-30 border-red-500 border-opacity-30 hover:border-red-500'
                      : 'bg-gray-800 border-gray-700'
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${
                      candidato.resultadoTAF === 'Aprovado'
                        ? 'text-green-400'
                        : candidato.resultadoTAF === 'Reprovado'
                        ? 'text-red-400'
                        : 'text-gray-400'
                    }`}
                  >
                    Resultado TAF
                  </p>
                  <p
                    className={`text-3xl font-bold mt-2 ${
                      candidato.resultadoTAF === 'Aprovado'
                        ? 'text-green-300'
                        : candidato.resultadoTAF === 'Reprovado'
                        ? 'text-red-300'
                        : 'text-gray-300'
                    }`}
                  >
                    {candidato.resultadoTAF}
                  </p>
                </div>

                {/* Nota Final Pós TAF */}
                <div className="bg-gray-800 border border-green-500 border-opacity-30 rounded-lg p-6 hover:border-green-500 transition-colors">
                  <p className="text-sm text-green-400 font-medium">Nota Final (Pós TAF)</p>
                  <p className="text-3xl font-bold text-green-300 mt-2">
                    {candidato.notaFinalPosTAF.toFixed(2)}
                  </p>
                </div>

                {/* Classificação */}
                <div className="bg-gray-800 border border-yellow-500 border-opacity-30 rounded-lg p-6 hover:border-yellow-500 transition-colors">
                  <p className="text-sm text-yellow-400 font-medium">Classificação</p>
                  <p className="text-3xl font-bold text-yellow-300 mt-2">
                    {candidato.novaClassificacao}º lugar
                  </p>
                </div>
              </div>
            </div>

            {/* Informações Adicionais do Concurso */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-100 mb-6">Informações do Concurso</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {concursoAtual.dadosConcurso?.dataProva && (
                  <div>
                    <p className="text-sm text-gray-400 font-medium">Data da Prova</p>
                    <p className="text-lg text-gray-100 font-semibold mt-1">
                      {new Date(concursoAtual.dadosConcurso.dataProva).toLocaleDateString(
                        'pt-BR'
                      )}
                    </p>
                  </div>
                )}

                {concursoAtual.dadosConcurso?.salario && (
                  <div>
                    <p className="text-sm text-gray-400 font-medium">Salário</p>
                    <p className="text-lg text-cyan-300 font-semibold mt-1">
                      {concursoAtual.dadosConcurso.salario}
                    </p>
                  </div>
                )}

                {concursoAtual.dadosConcurso?.edital && (
                  <div className="md:col-span-2">
                    <a
                      href={concursoAtual.dadosConcurso.edital}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-cyan-400 hover:text-cyan-300 font-semibold underline transition-colors"
                    >
                      Ver Edital →
                    </a>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
