'use client';

import { useState } from 'react';
import { useImportExcel } from '@/lib/use-import-excel';
import { useSalvarCandidatos } from '@/lib/use-salvar-candidatos';

interface ImportarPlanilhaProps {
  nomeConcurso: string;
  onSuccess?: () => void;
}

export default function ImportarPlanilha({ nomeConcurso, onSuccess }: ImportarPlanilhaProps) {
  const { candidatos, loading, error, importarPlanilha, limparDados } = useImportExcel();
  const { loading: savingLoading, error: savingError, salvarCandidatos } = useSalvarCandidatos();
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [nomeArquivo, setNomeArquivo] = useState('');
  const [mostraPreview, setMostraPreview] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArquivo(file);
      setNomeArquivo(file.name);
    }
  };

  const handleImportar = async () => {
    if (!arquivo) {
      alert('Selecione um arquivo primeiro');
      return;
    }

    try {
      await importarPlanilha(arquivo);
      setMostraPreview(true);
    } catch {
      alert('Erro ao importar planilha');
    }
  };

  const removerArquivo = () => {
    setArquivo(null);
    setNomeArquivo('');
    setMostraPreview(false);
    setMensagemSucesso(null);
    limparDados();
  };

  const handleSalvarCandidatos = async () => {
    try {
      const mensagem = await salvarCandidatos(nomeConcurso, candidatos);
      setMensagemSucesso(mensagem);
      
      // Aguarda um tempo e depois retorna ao upload
      setTimeout(() => {
        removerArquivo();
        onSuccess?.();
      }, 2000);
    } catch (err) {
      console.error('Erro ao salvar:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      {!mostraPreview && (
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold text-gray-100 mb-4">
            Importar Planilha de Candidatos - {nomeConcurso}
          </h3>

          <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-cyan-500 transition-colors">
            {!nomeArquivo ? (
              <>
                <input
                  type="file"
                  id="planilha"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".xlsx,.xls,.csv"
                />
                <label htmlFor="planilha" className="cursor-pointer">
                  <div className="text-4xl mb-2">📊</div>
                  <p className="text-gray-300 font-semibold">
                    Clique para selecionar ou arraste a planilha
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Formatos aceitos: Excel (.xlsx, .xls), CSV
                  </p>
                </label>
              </>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📄</span>
                  <div className="text-left">
                    <p className="font-semibold text-gray-300">{nomeArquivo}</p>
                    <p className="text-xs text-gray-400">
                      {(arquivo?.size || 0) / 1024 < 1024
                        ? `${((arquivo?.size || 0) / 1024).toFixed(1)} KB`
                        : `${((arquivo?.size || 0) / 1024 / 1024).toFixed(1)} MB`}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removerArquivo}
                  disabled={loading}
                  className="px-3 py-1 text-sm bg-red-900 bg-opacity-30 text-red-400 hover:bg-red-900 hover:bg-opacity-50 rounded transition-colors disabled:bg-gray-800 disabled:text-gray-500 border border-red-700"
                >
                  Remover
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 bg-red-900 bg-opacity-30 border border-red-700 text-red-300 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {nomeArquivo && (
            <button
              onClick={handleImportar}
              disabled={loading}
              className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-md disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              {loading ? 'Importando...' : 'Importar e Visualizar'}
            </button>
          )}
        </div>
      )}

      {/* Preview Section */}
      {mostraPreview && candidatos.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-100">
              Preview - {candidatos.length} candidato(s) importado(s)
            </h3>
            <button
              onClick={removerArquivo}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded text-sm transition-colors"
            >
              ← Voltar
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-800 border-b border-gray-700">
                  <th className="border border-gray-700 p-2 text-left text-gray-300">Inscrição</th>
                  <th className="border border-gray-700 p-2 text-left text-gray-300">Nome</th>
                  <th className="border border-gray-700 p-2 text-left text-gray-300">Região</th>
                  <th className="border border-gray-700 p-2 text-center text-gray-300">Objetiva</th>
                  <th className="border border-gray-700 p-2 text-center text-gray-300">Discursiva</th>
                  <th className="border p-2 text-center text-gray-900">Total (Antes TAF)</th>
                  <th className="border p-2 text-center text-gray-900">TAF</th>
                  <th className="border p-2 text-center text-gray-900">Final (Pós TAF)</th>
                  <th className="border p-2 text-center text-gray-900">Classificação</th>
                </tr>
              </thead>
              <tbody>
                {candidatos.slice(0, 10).map((candidato, idx) => (
                  <tr key={idx} className="hover:bg-gray-800 border-b border-gray-700">
                    <td className="border border-gray-700 p-2 text-gray-300">{candidato.inscricao}</td>
                    <td className="border border-gray-700 p-2 font-medium text-gray-300">{candidato.nomeCandidato}</td>
                    <td className="border border-gray-700 p-2 text-gray-300">{candidato.regiao}</td>
                    <td className="border border-gray-700 p-2 text-center text-gray-300">
                      {candidato.notaObjetiva.toFixed(2)}
                    </td>
                    <td className="border border-gray-700 p-2 text-center text-gray-300">
                      {candidato.notaDiscursiva.toFixed(2)}
                    </td>
                    <td className="border border-gray-700 p-2 text-center text-gray-300">
                      {candidato.notaTotalAntesTAF.toFixed(2)}
                    </td>
                    <td className="border border-gray-700 p-2 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          candidato.resultadoTAF === 'Aprovado'
                            ? 'bg-green-900 bg-opacity-30 text-green-300 border border-green-700'
                            : candidato.resultadoTAF === 'Reprovado'
                            ? 'bg-red-900 bg-opacity-30 text-red-300 border border-red-700'
                            : 'bg-gray-800 text-gray-400 border border-gray-700'
                        }`}
                      >
                        {candidato.resultadoTAF}
                      </span>
                    </td>
                    <td className="border border-gray-700 p-2 text-center text-gray-300">
                      {candidato.notaFinalPosTAF.toFixed(2)}
                    </td>
                    <td className="border border-gray-700 p-2 text-center font-bold text-gray-300">
                      {candidato.novaClassificacao}º
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {candidatos.length > 10 && (
            <p className="mt-4 text-gray-400 text-center">
              Mostrando 10 de {candidatos.length} candidatos. Total de registros na planilha: {candidatos.length}
            </p>
          )}

          {savingError && (
            <div className="mt-4 bg-red-900 bg-opacity-30 border border-red-700 text-red-300 px-4 py-3 rounded">
              ❌ Erro: {savingError}
            </div>
          )}

          {mensagemSucesso && (
            <div className="mt-4 bg-green-900 bg-opacity-30 border border-green-700 text-green-300 px-4 py-3 rounded">
              {mensagemSucesso}
            </div>
          )}

          <div className="mt-6 p-4 bg-cyan-900 bg-opacity-30 border border-cyan-700 rounded">
            <p className="text-sm text-gray-300">
              <strong>ℹ️ Próximo passo:</strong> Verifique os dados acima e clique em "Salvar Candidatos" para armazenar no banco de dados.
            </p>
          </div>

          <button
            onClick={handleSalvarCandidatos}
            disabled={savingLoading}
            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {savingLoading ? '⏳ Salvando candidatos...' : '✓ Salvar Candidatos no Banco de Dados'}
          </button>
        </div>
      )}
    </div>
  );
}
