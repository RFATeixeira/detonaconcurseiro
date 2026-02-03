'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';

export interface ConcursoExternoPendente {
  id: string;
  nome: string;
  orgao: string;
  edital?: string;
  salario?: string;
  vagas?: number;
  status?: 'open' | 'closed' | 'expected';
  dataAbertura?: string;
  dataFechamento?: string;
  dataFonte?: string;
}

export const useConcursosExternosPendentes = () => {
  const [concursos, setConcursos] = useState<ConcursoExternoPendente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Verificar se Firebase está inicializado
      if (!db) {
        setLoading(false);
        return;
      }

      console.log('🔄 useConcursosExternosPendentes: Iniciando listener...');
      const pendentesRef = collection(db, 'concursosExternosPendentes');
      // Removendo orderBy temporariamente para não exigir índice
      const q = query(pendentesRef);
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        console.log('📦 Snapshot recebido:', snapshot.docs.length, 'documentos');
        const lista = snapshot.docs.map((doc) => {
          const data = doc.data();
          console.log('📄 Documento:', doc.id, data);
          return {
            id: doc.id,
            nome: data.nome || '',
            orgao: data.orgao || '',
            edital: data.edital || '',
            salario: data.salario || '',
            vagas: data.vagas || '',
            status: data.status || '',
            dataAbertura: data.dataAbertura || '',
            dataFechamento: data.dataFechamento || '',
            dataFonte: data.dataFonte || new Date().toISOString(),
          };
        });
        console.log('✅ Lista de concursos pendentes:', lista.length, 'itens');
        // Ordena no frontend se necessário
        lista.sort((a, b) => {
          const dateA = new Date(a.dataFonte || 0);
          const dateB = new Date(b.dataFonte || 0);
          return dateB.getTime() - dateA.getTime();
        });
        setConcursos(lista);
        setLoading(false);
      }, (err) => {
        console.error('❌ Erro no snapshot:', err);
        console.error('❌ Detalhes do erro:', err.code, err.message);
        setError(err.message);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('❌ Erro ao configurar listener:', err);
      const message = err instanceof Error ? err.message : 'Erro ao carregar concursos pendentes';
      setError(message);
      setLoading(false);
    }
  }, []);

  const deletarPendente = async (id: string) => {
    try {
      const docRef = doc(db, 'concursosExternosPendentes', id);
      await deleteDoc(docRef);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deletar concurso';
      throw new Error(message);
    }
  };

  const atualizarPendente = async (id: string, dados: Partial<ConcursoExternoPendente>) => {
    try {
      const docRef = doc(db, 'concursosExternosPendentes', id);
      await updateDoc(docRef, dados);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar concurso';
      throw new Error(message);
    }
  };

  return {
    concursos,
    loading,
    error,
    deletarPendente,
    atualizarPendente,
  };
};
