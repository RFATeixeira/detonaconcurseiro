'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';

interface Concurso {
  id: string;
  nomeConcurso: string;
  numeroInscricao: string;
  status: 'com_dados' | 'sem_dados';
  dataCriacao: Date;
  dadosConcurso?: any;
}

export const useConcursos = () => {
  const [concursos, setConcursos] = useState<Concurso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    
    if (!auth.currentUser) {
      setLoading(false);
      setConcursos([]);
      return;
    }

    const concursosRef = collection(db, 'users', auth.currentUser.uid, 'concursos');
    
    const unsubscribe = onSnapshot(concursosRef, async (snapshot) => {
      const concursosList = snapshot.docs.map((doc) => ({
        id: doc.id,
        nomeConcurso: doc.data().nomeConcurso,
        numeroInscricao: doc.data().numeroInscricao,
        status: doc.data().status,
        dataCriacao: doc.data().dataCriacao?.toDate() || new Date(),
        dadosConcurso: doc.data().dadosConcurso,
      }));

      // Verificar se há concursos sem dados e tentar encontrar dados para eles
      for (const concurso of concursosList) {
        if (concurso.status === 'sem_dados') {
          try {
            // Buscar dados na coleção concursosData
            const concursosDataRef = collection(db, 'concursosData');
            const q = query(concursosDataRef, where('nomeConcurso', '==', concurso.nomeConcurso));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
              // Encontrou dados! Atualizar o documento do usuário
              const concursoData = querySnapshot.docs[0].data();
              const concursoUserRef = doc(db, 'users', auth.currentUser!.uid, 'concursos', concurso.id);
              
              await updateDoc(concursoUserRef, {
                status: 'com_dados',
                dadosConcurso: {
                  orgao: concursoData.banca,
                  cargo: concursoData.cargo,
                  dataProva: concursoData.dataProva,
                  status: 'Cadastrado',
                  salario: concursoData.salario,
                  edital: concursoData.edital,
                  descricao: concursoData.descricao,
                  documentoURL: concursoData.documentoURL,
                },
              });
            }
          } catch (err) {
            console.error('Erro ao verificar dados do concurso:', err);
          }
        }
      }

      setConcursos(concursosList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth.currentUser?.uid]);

  const adicionarConcurso = async (nomeConcurso: string, numeroInscricao: string) => {
    if (!auth.currentUser) {
      setError('Usuário não autenticado');
      return;
    }

    try {
      setError(null);

      // Verificar se o usuário já tem este concurso cadastrado
      const concursosRef = collection(db, 'users', auth.currentUser.uid, 'concursos');
      const qUsuario = query(concursosRef, where('nomeConcurso', '==', nomeConcurso));
      const querySnapshotUsuario = await getDocs(qUsuario);

      if (!querySnapshotUsuario.empty) {
        throw new Error(`Você já está cadastrado nesse concurso: ${nomeConcurso}`);
      }

      // Buscar dados do concurso na coleção concursosData
      const concursosDataRef = collection(db, 'concursosData');
      const q = query(concursosDataRef, where('nomeConcurso', '==', nomeConcurso));
      const querySnapshot = await getDocs(q);

      let status = 'sem_dados';
      let dadosConcurso = null;

      if (!querySnapshot.empty) {
        const concursoData = querySnapshot.docs[0].data();
        status = 'com_dados';
        dadosConcurso = {
          orgao: concursoData.banca,
          cargo: concursoData.cargo,
          dataProva: concursoData.dataProva,
          status: 'Cadastrado',
          salario: concursoData.salario,
          edital: concursoData.edital,
          descricao: concursoData.descricao,
          documentoURL: concursoData.documentoURL,
        };
      }

      // Adicionar concurso do usuário
      await addDoc(concursosRef, {
        nomeConcurso,
        numeroInscricao,
        status,
        dataCriacao: Timestamp.now(),
        dadosConcurso,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar concurso';
      setError(errorMessage);
      throw err;
    }
  };

  const deletarConcurso = async (concursoId: string) => {
    if (!auth.currentUser) {
      setError('Usuário não autenticado');
      return;
    }

    try {
      setError(null);
      const concursoRef = doc(db, 'users', auth.currentUser.uid, 'concursos', concursoId);
      await deleteDoc(concursoRef);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar concurso';
      setError(errorMessage);
      throw err;
    }
  };

  const atualizarStatusConcurso = async (concursoId: string, dados: any) => {
    if (!auth.currentUser) {
      setError('Usuário não autenticado');
      return;
    }

    try {
      setError(null);
      const concursoRef = doc(db, 'users', auth.currentUser.uid, 'concursos', concursoId);
      await updateDoc(concursoRef, {
        status: 'com_dados',
        dadosConcurso: dados,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar concurso';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    concursos,
    loading,
    error,
    adicionarConcurso,
    deletarConcurso,
  };
};
