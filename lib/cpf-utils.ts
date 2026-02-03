'use client';

import { db } from '@/lib/firebase';
import { query, where, collection, getDocs } from 'firebase/firestore';

/**
 * Busca o email associado a um CPF no Firestore
 * @param cpf CPF no formato 000.000.000-00 ou sem formatação
 * @returns Email do usuário ou null se não encontrado
 */
export async function findEmailByCPF(cpf: string): Promise<string | null> {
  try {
    // Verificar se Firebase está inicializado
    if (!db) {
      console.error('Firebase não inicializado');
      return null;
    }

    // Remove formatação do CPF
    const cleanCPF = cpf.replace(/\D/g, '');

    // Busca no Firestore
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('cpf', '==', cleanCPF));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      return userData.email || null;
    }

    return null;
  } catch (error) {
    console.error('Erro ao buscar email por CPF:', error);
    return null;
  }
}

/**
 * Determina se o input é CPF ou email
 * @param input Texto que pode ser CPF ou email
 * @returns 'cpf' ou 'email'
 */
export function identifyInput(input: string): 'cpf' | 'email' {
  // Se tem @ é email
  if (input.includes('@')) {
    return 'email';
  }

  // Se tem apenas números ou padrão CPF é CPF
  const cleanInput = input.replace(/\D/g, '');
  if (cleanInput.length === 11) {
    return 'cpf';
  }

  // Por padrão, assume email
  return 'email';
}
