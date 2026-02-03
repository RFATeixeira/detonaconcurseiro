'use client';

import { useState } from 'react';
import { db, auth } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { CandidatoData } from './use-import-excel';

export const useSalvarCandidatos = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const salvarCandidatos = async (
    nomeConcurso: string,
    candidatos: CandidatoData[]
  ): Promise<string> => {
    try {
      setLoading(true);
      setError(null);

      // Verificar se Firebase está inicializado
      if (!db) {
        throw new Error('Firebase não inicializado');
      }

      if (!candidatos || candidatos.length === 0) {
        throw new Error('Nenhum candidato para salvar');
      }

      // Cria referência para a sub-coleção de candidatos
      const concursosRef = collection(db, 'concursosData');
      
      // Busca o concurso pelo nome
      const q = query(concursosRef, where('nomeConcurso', '==', nomeConcurso));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error(`Concurso "${nomeConcurso}" não encontrado`);
      }

      const concursoDoc = querySnapshot.docs[0];
      const concursoId = concursoDoc.id;

      // Cria sub-coleção de candidatos
      const candidatosRef = collection(db, 'concursosData', concursoId, 'candidatos');

      // Usa batch para salvar vários candidatos de uma vez
      const batch = writeBatch(db);
      let contador = 0;

      candidatos.forEach((candidato) => {
        const novoDoc = doc(candidatosRef);
        batch.set(novoDoc, {
          inscricao: candidato.inscricao,
          nomeCandidato: candidato.nomeCandidato,
          regiao: candidato.regiao,
          notaObjetiva: candidato.notaObjetiva,
          notaDiscursiva: candidato.notaDiscursiva,
          notaTotalAntesTAF: candidato.notaTotalAntesTAF,
          resultadoTAF: candidato.resultadoTAF,
          notaFinalPosTAF: candidato.notaFinalPosTAF,
          novaClassificacao: candidato.novaClassificacao,
          dataCriacao: Timestamp.now(),
        });
        contador++;
      });

      // Executa o batch
      await batch.commit();

      return `✓ ${contador} candidato(s) salvo(s) com sucesso!`;
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao salvar candidatos';
      setError(mensagem);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletarCandidatos = async (
    nomeConcurso: string
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const concursosRef = collection(db, 'concursosData');
      const q = query(concursosRef, where('nomeConcurso', '==', nomeConcurso));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error(`Concurso "${nomeConcurso}" não encontrado`);
      }

      const concursoId = querySnapshot.docs[0].id;
      const candidatosRef = collection(db, 'concursosData', concursoId, 'candidatos');
      
      const candidatosSnapshot = await getDocs(candidatosRef);
      
      const batch = writeBatch(db);
      candidatosSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao deletar candidatos';
      setError(mensagem);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const obterCandidatos = async (nomeConcurso: string): Promise<CandidatoData[]> => {
    try {
      setLoading(true);
      setError(null);

      const concursosRef = collection(db, 'concursosData');
      const q = query(concursosRef, where('nomeConcurso', '==', nomeConcurso));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return [];
      }

      const concursoId = querySnapshot.docs[0].id;
      const candidatosRef = collection(db, 'concursosData', concursoId, 'candidatos');
      
      const candidatosSnapshot = await getDocs(candidatosRef);
      
      const candidatos = candidatosSnapshot.docs.map((doc) => ({
        inscricao: doc.data().inscricao,
        nomeCandidato: doc.data().nomeCandidato,
        regiao: doc.data().regiao,
        notaObjetiva: doc.data().notaObjetiva,
        notaDiscursiva: doc.data().notaDiscursiva,
        notaTotalAntesTAF: doc.data().notaTotalAntesTAF,
        resultadoTAF: doc.data().resultadoTAF,
        notaFinalPosTAF: doc.data().notaFinalPosTAF,
        novaClassificacao: doc.data().novaClassificacao,
      })) as CandidatoData[];

      return candidatos;
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao obter candidatos';
      setError(mensagem);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    salvarCandidatos,
    deletarCandidatos,
    obterCandidatos,
  };
};
