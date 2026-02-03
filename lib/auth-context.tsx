'use client';

import { auth, db } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, getDocs, query, where, collection } from 'firebase/firestore';
import { useState, useEffect, useContext, createContext, ReactNode } from 'react';

interface UserProfile {
  cpf: string;
  email: string;
  createdAt: string;
  isAdmin?: boolean;
  displayName?: string;
  dateOfBirth?: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  registerUser: (cpf: string, email: string, password: string) => Promise<void>;
  loginUser: (cpfOrEmail: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para validar CPF
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

  // Função para registrar novo usuário
  const registerUser = async (
    cpf: string,
    email: string,
    password: string
  ) => {
    try {
      setError(null);

      // Verificar se Firebase está inicializado
      if (!auth || !db) {
        throw new Error('Firebase não inicializado. Aguarde um momento.');
      }

      // Validar CPF
      if (!validateCPF(cpf)) {
        throw new Error('CPF inválido');
      }

      // Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Salvar perfil do usuário no Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        cpf: cpf.replace(/\D/g, ''),
        email: email,
        createdAt: new Date().toISOString(),
      });

      setUser(userCredential.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao registrar';
      setError(errorMessage);
      throw err;
    }
  };

  // Função para fazer login
  const loginUser = async (cpfOrEmail: string, password: string) => {
    try {
      setError(null);

      // Verificar se Firebase está inicializado
      if (!auth || !db) {
        throw new Error('Firebase não inicializado. Aguarde um momento.');
      }

      let email = cpfOrEmail;

      // Se parecer um CPF, buscar o email correspondente
      if (cpfOrEmail.replace(/\D/g, '').length === 11) {
        // Buscar email pelo CPF no Firestore
        const usersSnapshot = await getDocs(
          query(
            collection(db, 'users'),
            where('cpf', '==', cpfOrEmail.replace(/\D/g, ''))
          )
        );

        if (usersSnapshot.empty) {
          throw new Error('CPF não encontrado. Verifique os dados ou registre-se.');
        }

        email = usersSnapshot.docs[0].data().email;
      }

      // Fazer login com email e senha
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Buscar perfil do usuário
      const docRef = doc(db, 'users', userCredential.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserProfile(docSnap.data() as UserProfile);
      }

      setUser(userCredential.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(errorMessage);
      throw err;
    }
  };

  // Função para fazer logout
  const logoutUser = async () => {
    try {
      setError(null);
      
      // Verificar se Firebase está inicializado
      if (!auth) {
        throw new Error('Firebase não inicializado. Aguarde um momento.');
      }
      
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer logout';
      setError(errorMessage);
      throw err;
    }
  };

  // Verificar estado de autenticação
  useEffect(() => {
    // Aguardar inicialização do Firebase
    if (!auth || !db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Buscar perfil do usuário
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as UserProfile);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        registerUser,
        loginUser,
        logoutUser,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
