'use client';

import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { updateEmail, updatePassword } from 'firebase/auth';

interface UpdateProfileData {
  displayName?: string;
  cpf?: string;
  email?: string;
  dateOfBirth?: string;
}

export function useProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateCPF = (cpf: string): boolean => {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  };

  const updateProfile = async (data: UpdateProfileData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Validar CPF se fornecido
      if (data.cpf && !validateCPF(data.cpf)) {
        throw new Error('CPF inválido');
      }

      // Preparar dados para atualização
      const updateData: any = {};
      
      if (data.displayName !== undefined) {
        updateData.displayName = data.displayName;
      }
      
      if (data.cpf) {
        updateData.cpf = data.cpf.replace(/\D/g, '');
      }
      
      if (data.dateOfBirth) {
        updateData.dateOfBirth = data.dateOfBirth;
      }

      // Atualizar email no Firebase Auth se fornecido
      if (data.email && data.email !== user.email) {
        await updateEmail(user, data.email);
        updateData.email = data.email;
      }

      // Atualizar dados no Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, updateData);

      setSuccess(true);
      setLoading(false);
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar perfil';
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  };

  const updateUserPassword = async (newPassword: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      await updatePassword(user, newPassword);
      setSuccess(true);
      setLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar senha';
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  };

  return {
    updateProfile,
    updateUserPassword,
    loading,
    error,
    success,
  };
}
