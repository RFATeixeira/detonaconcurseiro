/**
 * TESTES E EXEMPLOS DE USO - SISTEMA DE LOGIN E REGISTRO
 * 
 * Este arquivo mostra como testar o sistema e exemplos de uso dos hooks.
 */

// ============================================
// EXEMPLO 1: USAR O HOOK useAuth EM UM COMPONENTE
// ============================================

/*
'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MyComponent() {
  const { user, userProfile, loading, logoutUser, error } = useAuth();
  const router = useRouter();

  // Proteger a rota - redirecionar se não autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1>Bem-vindo, {user.email}!</h1>
      {userProfile && (
        <p>CPF: {userProfile.cpf}</p>
      )}
      <button onClick={() => logoutUser()}>Sair</button>
    </div>
  );
}
*/

// ============================================
// EXEMPLO 2: CPF VÁLIDOS PARA TESTES
// ============================================

/*
Alguns CPFs válidos (gerados para teste):

1. 123.456.789-09
2. 111.444.777-35
3. 987.654.321-87

Nota: Esses são CPFs válidos na estrutura algorítmica,
mas não registrados no Brasil (são fictícios para testes).

Você pode usar qualquer email e qualquer senha (mínimo 6 caracteres).
*/

// ============================================
// EXEMPLO 3: ESTRUTURA DE DADOS NO FIRESTORE
// ============================================

/*
O banco de dados Firestore terá a seguinte estrutura:

firestore/
  users/
    {userId}/
      - cpf: "12345678909"
      - email: "usuario@example.com"
      - createdAt: "2025-01-30T10:30:00.000Z"

Onde {userId} é o UID gerado automaticamente pelo Firebase Auth.
*/

// ============================================
// EXEMPLO 4: FLUXO DE REGISTRO
// ============================================

/*
1. Usuário acessa /register
2. Preenche:
   - CPF: 123.456.789-09
   - Email: usuario@example.com
   - Senha: senha123
   - Confirmar Senha: senha123
3. Sistema valida:
   ✓ CPF válido (verifica dígitos verificadores)
   ✓ Email válido (formato correto)
   ✓ Senhas iguais
   ✓ Senha tem mínimo 6 caracteres
4. Dados são salvos:
   - Firebase Auth: email + senha (com hash)
   - Firestore: CPF + Email + Data de Criação
5. Usuário é redirecionado para /dashboard
*/

// ============================================
// EXEMPLO 5: FLUXO DE LOGIN
// ============================================

/*
OPÇÃO 1 - LOGIN COM EMAIL:
1. Usuário acessa /login
2. Preenche:
   - CPF ou Email: usuario@example.com
   - Senha: senha123
3. Sistema autentica e redireciona para /dashboard

OPÇÃO 2 - LOGIN COM CPF:
1. Usuário acessa /login
2. Preenche:
   - CPF ou Email: 123.456.789-09
   - Senha: senha123
3. Sistema busca email associado ao CPF no Firestore
4. Autentica com email encontrado
5. Redireciona para /dashboard
*/

// ============================================
// EXEMPLO 6: VALIDAÇÃO DE CPF
// ============================================

/*
A validação de CPF verificar:

1. Formato: exatamente 11 dígitos
2. Sequência: não pode ser 000.000.000-00, 111.111.111-11, etc.
3. Dígito verificador 1: validado com fórmula específica
4. Dígito verificador 2: validado com fórmula específica

Fórmula simplificada:
- Primeiros 9 dígitos são multiplicados por 10, 9, 8, 7, 6, 5, 4, 3, 2
- Soma todos os resultados
- O resto da divisão por 11 é o primeiro dígito verificador
- Repete o processo para validar o segundo dígito
*/

// ============================================
// EXEMPLO 7: TRATAMENTO DE ERROS
// ============================================

/*
Possíveis erros e mensagens:

1. "CPF inválido"
   - CPF não passou na validação

2. "Email inválido"
   - Email não tem formato correto (falta @, etc)

3. "As senhas não conferem"
   - Senha e confirmação são diferentes

4. "Senha deve ter no mínimo 6 caracteres"
   - Senha muito curta

5. "Email already in use"
   - Email já está registrado no Firebase

6. "user-not-found"
   - Email não está registrado (no login)

7. "wrong-password"
   - Senha incorreta

8. "CPF não encontrado. Verifique os dados ou registre-se."
   - CPF não existe no banco de dados (login com CPF)
*/

// ============================================
// EXEMPLO 8: TESTAR LOCALMENTE
// ============================================

/*
1. Após configurar Firebase:
   npm run dev

2. Registar um novo usuário:
   - Acesse http://localhost:3000/register
   - Preencha com dados válidos
   - Clique em "Criar conta"

3. Fazer login:
   - Acesse http://localhost:3000/login
   - Use o email e senha registrados
   - Clique em "Conectar"

4. Ver dashboard:
   - Você será redirecionado para /dashboard
   - Veja seus dados

5. Logout:
   - Clique em "Sair"
   - Será redirecionado para /login
*/

// ============================================
// EXEMPLO 9: INTEGRAR COM OUTRAS PÁGINAS
// ============================================

/*
Para proteger suas páginas, envolvê-las com verificação:

app/minhas-questoes/page.tsx:

'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MinhasQuestoes() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div>Carregando...</div>;
  if (!user) return null;

  return (
    <div>
      <h1>Minhas Questões</h1>
      // Seu conteúdo aqui
    </div>
  );
}
*/

// ============================================
// EXEMPLO 10: VARIÁVEIS DE AMBIENTE
// ============================================

/*
O arquivo .env.local deve conter:

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789000
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789000:web:abcdefghijklmnopqrs

Todos esses valores são encontrados no Firebase Console:
1. Project Settings (engrenagem)
2. Seu aplicativo (</> icon)
3. Copiar firebaseConfig
*/

export default function TestExamples() {
  return (
    <div>
      <h1>Sistema de Login e Registro - Exemplos e Testes</h1>
      <p>
        Veja o código-fonte deste arquivo para exemplos de uso completos.
      </p>
    </div>
  );
}
