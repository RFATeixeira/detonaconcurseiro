'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  Timestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface ConcursoData {
  id: string;
  nomeConcurso: string;
  banca: string;
  cargo: string;
  salario: string;
  dataProva: string;
  dataFinalInscricao?: string;
  dataEncerramento?: string;
  edital: string;
  descricao?: string;
  documentoURL?: string;
  statusExterno?: string;
  dataCriacao: Date;
}

export const useConcursosData = () => {
  const [concursosData, setConcursosData] = useState<ConcursoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se Firebase está inicializado
    if (!db) {
      setLoading(false);
      return;
    }

    const concursosRef = collection(db, 'concursosData');
    const q = query(concursosRef, orderBy('dataCriacao', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        nomeConcurso: doc.data().nomeConcurso,
        banca: doc.data().banca,
        cargo: doc.data().cargo,
        salario: doc.data().salario,
        dataProva: doc.data().dataProva,
        dataFinalInscricao: doc.data().dataFinalInscricao,
        dataEncerramento: doc.data().dataEncerramento,
        edital: doc.data().edital,
        descricao: doc.data().descricao,
        documentoURL: doc.data().documentoURL,
        statusExterno: doc.data().statusExterno,
        dataCriacao: doc.data().dataCriacao?.toDate() || new Date(),
      }));
      setConcursosData(lista);
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const adicionarConcursoData = async (
    nomeConcurso: string,
    banca: string,
    cargo: string,
    salario: string,
    dataProva: string,
    dataFinalInscricao: string,
    dataEncerramento: string,
    edital: string,
    descricao?: string
  ) => {
    try {
      setError(null);

      // Verificar se Firebase está inicializado
      if (!db) {
        throw new Error('Firebase não inicializado');
      }

      const concursosRef = collection(db, 'concursosData');
      
      await addDoc(concursosRef, {
        nomeConcurso,
        banca,
        cargo,
        salario,
        dataProva,
        dataFinalInscricao,
        dataEncerramento,
        edital,
        descricao: descricao || '',
        documentoURL: '',
        dataCriacao: Timestamp.now(),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao adicionar concurso';
      setError(message);
      throw err;
    }
  };

  const deletarConcursoData = async (id: string) => {
    try {
      setError(null);
      if (!db) throw new Error('Firebase não inicializado');
      const docRef = doc(db, 'concursosData', id);
      await deleteDoc(docRef);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deletar concurso';
      setError(message);
      throw err;
    }
  };

  const atualizarConcursoData = async (
    id: string,
    nomeConcurso: string,
    banca: string,
    cargo: string,
    salario: string,
    dataProva: string,
    dataFinalInscricao: string,
    dataEncerramento: string,
    edital: string,
    descricao?: string
  ) => {
    try {
      setError(null);
      const docRef = doc(db, 'concursosData', id);
      
      await updateDoc(docRef, {
        nomeConcurso,
        banca,
        cargo,
        salario,
        dataProva,
        dataFinalInscricao,
        dataEncerramento,
        edital,
        descricao: descricao || '',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar concurso';
      setError(message);
      throw err;
    }
  };

  return {
    concursosData,
    loading,
    error,
    adicionarConcursoData,
    deletarConcursoData,
    atualizarConcursoData,
  };
};
