'use client';

import { useEffect, useState } from 'react';
// Não salva em Firestore aqui; apenas busca da API

interface ConcursoExterno {
  id: string;
  nome: string;
  edital: string;
  orgao: string;
  salario: string;
  vagas: number;
  status: 'open' | 'closed' | 'expected';
  dataAbertura: string;
  dataFechamento: string;
  uf?: string;
  raw?: Record<string, any>;
}

interface ConcursosExternosState {
  concursos: ConcursoExterno[];
  loading: boolean;
  error: string | null;
  sincronizado: boolean;
}

// Hook para buscar concursos externos diretamente da API
export function useConcursosExternos(uf: string = ''): ConcursosExternosState {
  const [concursos, setConcursos] = useState<ConcursoExterno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sincronizado, setSincronizado] = useState(false);

  useEffect(() => {
    const fetchConcursos = async () => {
      try {
        setLoading(true);
        setError(null);

        // Não passa UF, busca todos os concursos
        const response = await fetch(`/api/concursos-externos`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Erro ao buscar concursos: ${response.statusText}`);
        }

        const data = await response.json();

        const normalizeKey = (key: string) =>
          key
            .toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .replace(/[^a-z0-9]/g, '');

        const getField = (obj: Record<string, any>, keys: string[]) => {
          const normalized = Object.entries(obj).reduce<Record<string, any>>((acc, [k, v]) => {
            acc[normalizeKey(k)] = v;
            return acc;
          }, {});
          for (const key of keys) {
            const value = normalized[normalizeKey(key)];
            if (value !== undefined && value !== null && value !== '') return value;
          }
          return '';
        };

        const mapConcurso = (concurso: Record<string, any>, status: 'open' | 'expected') => {
          const nome = getField(concurso, ['Concurso', 'Nome', 'Cargo', 'Descricao', 'Descrição']);
          const orgao = getField(concurso, ['Órgão', 'Orgao', 'Órgão/Entidade', 'Orgão', 'Concurso']);
          const edital = getField(concurso, ['Edital', 'Link', 'URL', 'Site']);
          const salario = getField(concurso, ['Salário Até', 'Salário', 'Salario', 'Remuneração', 'Remuneracao']);
          const vagasRaw = getField(concurso, ['Vagas', 'Qtde Vagas', 'Quantidade']);
          const dataInscricao = getField(concurso, ['Inscrição Até', 'Inscrições', 'Inscricoes', 'Período', 'Periodo']);
          const situacao = getField(concurso, ['Situação', 'Situacao', 'Status']);
          const nivel = getField(concurso, ['Nível', 'Nivel', 'Escolaridade']);
          const ufField = getField(concurso, ['UF', 'Estado', 'Localidade']);

          const vagas = typeof vagasRaw === 'number'
            ? vagasRaw
            : parseInt(String(vagasRaw).replace(/\D/g, ''), 10) || 0;

          return {
            id: crypto.randomUUID(),
            nome: String(nome || '').trim(),
            edital: String(edital || '').trim(),
            orgao: String(orgao || nome || '').trim(),
            salario: String(salario || 'A definir').trim(),
            vagas,
            status,
            dataAbertura: String(situacao || nivel || '').trim(),
            dataFechamento: String(dataInscricao || '').trim(),
            uf: String(ufField || '').trim(),
            raw: concurso,
          } as ConcursoExterno;
        };

        const concursosAbertos = (data.concursos_abertos || []).map((c: Record<string, any>) =>
          mapConcurso(c, 'open')
        );
        const concursosPrevistos = (data.concursos_previstos || []).map((c: Record<string, any>) =>
          mapConcurso(c, 'expected')
        );

        const todosConcursos = [...concursosAbertos, ...concursosPrevistos];
        setConcursos(todosConcursos);
        setSincronizado(true);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar concursos externos';
        setError(errorMessage);
        console.error('Erro:', errorMessage);
        setConcursos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConcursos();
  }, [uf]);

  return {
    concursos,
    loading,
    error,
    sincronizado,
  };
}
