'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';

export interface CandidatoData {
  inscricao: string;
  nomeCandidato: string;
  regiao: string;
  notaObjetiva: number;
  notaDiscursiva: number;
  notaTotalAntesTAF: number;
  resultadoTAF: string;
  notaFinalPosTAF: number;
  novaClassificacao: number;
  afrodescendente?: string;
}

export const useImportExcel = () => {
  const [candidatos, setCandidatos] = useState<CandidatoData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const importarPlanilha = async (arquivo: File): Promise<CandidatoData[]> => {
    try {
      setLoading(true);
      setError(null);

      const arrayBuffer = await arquivo.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      // Pega a primeira planilha
      const planilha = workbook.Sheets[workbook.SheetNames[0]];
      const dados = XLSX.utils.sheet_to_json(planilha);

      // Converte os dados para o formato esperado
      const candidatosProcessados: CandidatoData[] = (dados as any[]).map((row: any) => {
        return {
          inscricao: String(row['Inscrição'] || row['inscricao'] || ''),
          nomeCandidato: String(row['Nome do Candidato'] || row['nome_candidato'] || ''),
          regiao: String(row['Região'] || row['regiao'] || ''),
          notaObjetiva: Number(row['Nota Objetiva'] || row['nota_objetiva'] || 0),
          notaDiscursiva: Number(row['Nota Discursiva'] || row['nota_discursiva'] || 0),
          notaTotalAntesTAF: Number(row['Nota Total (Antes TAF)'] || row['nota_total_antes_taf'] || 0),
          resultadoTAF: String(row['Resultado TAF'] || row['resultado_taf'] || ''),
          notaFinalPosTAF: Number(row['Nota Final Pós TAF'] || row['nota_final_pos_taf'] || 0),
          novaClassificacao: Number(row['Nova Classificação'] || row['nova_classificacao'] || 0),
          afrodescendente: String(row['Afrodescendente'] || row['afrodescendente'] || 'Não informado'),
        };
      });

      setCandidatos(candidatosProcessados);
      return candidatosProcessados;
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao importar planilha';
      setError(mensagem);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const limparDados = () => {
    setCandidatos([]);
    setError(null);
  };

  return {
    candidatos,
    loading,
    error,
    importarPlanilha,
    limparDados,
  };
};
