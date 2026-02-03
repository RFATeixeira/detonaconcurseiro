'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

export interface CandidatoDetalhado {
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

export const useCandidatoDetalhes = (nomeConcurso: string, numeroInscricao: string) => {
  const [candidato, setCandidato] = useState<CandidatoDetalhado | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const buscarCandidato = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar o concurso para pegar o ID
        const concursosDataRef = collection(db, 'concursosData');
        const q = query(concursosDataRef, where('nomeConcurso', '==', nomeConcurso));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError('Concurso não encontrado');
          setCandidato(null);
          return;
        }

        const concursoId = querySnapshot.docs[0].id;

        // Buscar o candidato na subcoleção
        const candidatosRef = collection(db, 'concursosData', concursoId, 'candidatos');
        const qCandidato = query(candidatosRef, where('inscricao', '==', numeroInscricao));
        const candidatoSnapshot = await getDocs(qCandidato);

        if (candidatoSnapshot.empty) {
          setError('Candidato não encontrado com essa inscrição');
          setCandidato(null);
          return;
        }

        const dados = candidatoSnapshot.docs[0].data() as CandidatoDetalhado;
        setCandidato(dados);
      } catch (err) {
        const mensagem = err instanceof Error ? err.message : 'Erro ao buscar dados do candidato';
        setError(mensagem);
        setCandidato(null);
      } finally {
        setLoading(false);
      }
    };

    if (nomeConcurso && numeroInscricao) {
      buscarCandidato();
    }
  }, [nomeConcurso, numeroInscricao]);

  return { candidato, loading, error };
};
