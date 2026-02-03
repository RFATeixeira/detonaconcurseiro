# ⚡ Quick Start - Sistema de Login e Registro

## 🚀 Começar em 5 Minutos

### Pré-requisitos
- Node.js instalado
- Conta no [Firebase Console](https://console.firebase.google.com)

### Passo 1: Clone/Atualize o Projeto
```bash
npm install
```

### Passo 2: Configure Firebase (⭐ CRUCIAL)

#### 2.1 - Criar Projeto no Firebase
1. Vá para [Firebase Console](https://console.firebase.google.com)
2. Clique "Criar Projeto"
3. Nome: `detonaconcurseiro`
4. Clique "Criar Projeto"

#### 2.2 - Ativar Autenticação
1. Menu lateral → **Authentication**
2. Clique "Começar"
3. **Email/Password** → Ativar → Salvar

#### 2.3 - Criar Firestore Database
1. Menu lateral → **Firestore Database**
2. Clique "Criar banco de dados"
3. Escolha "Modo de teste" → Próximo
4. Região: `us-central1` → Criar

#### 2.4 - Copiar Credenciais
1. Engrenagem ⚙️ no canto superior
2. **Project Settings**
3. Role até seu app (`</> icon`)
4. Copie o `firebaseConfig`

### Passo 3: Preencher .env.local
```bash
# Abra o arquivo .env.local e preencha:
NEXT_PUBLIC_FIREBASE_API_KEY=cole_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cole_aqui
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cole_aqui
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cole_aqui
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=cole_aqui
NEXT_PUBLIC_FIREBASE_APP_ID=cole_aqui
```

### Passo 4: Executar
```bash
npm run dev
```

Acesse: **http://localhost:3000**

## 📱 Testar o Sistema

### ✅ Teste 1: Criar Conta
1. Clique "Registrar"
2. CPF: `123.456.789-09` (válido)
3. Email: `teste@example.com`
4. Senha: `senha123`
5. Clique "Criar conta"
6. ✅ Redirecionado para Dashboard

### ✅ Teste 2: Login com Email
1. Clique "Sair"
2. Clique "Login"
3. Email: `teste@example.com`
4. Senha: `senha123`
5. Clique "Conectar"
6. ✅ Redirecionado para Dashboard

### ✅ Teste 3: Login com CPF
1. Clique "Sair"
2. Clique "Login"
3. CPF: `123.456.789-09`
4. Senha: `senha123`
5. Clique "Conectar"
6. ✅ Redirecionado para Dashboard

## 🗂️ Arquivos Importantes

| Arquivo | O quê | Por quê |
|---------|-------|--------|
| `.env.local` | Credenciais | Configuração do Firebase |
| `lib/firebase.ts` | Inicialização | Conexão com Firebase |
| `lib/auth-context.tsx` | Hooks de autenticação | Gerenciamento de estado |
| `components/LoginForm.tsx` | Tela de login | Interface do usuário |
| `components/RegisterForm.tsx` | Tela de registro | Interface do usuário |
| `app/page.tsx` | Home | Página inicial |
| `app/login/page.tsx` | Rota /login | Página de login |
| `app/register/page.tsx` | Rota /register | Página de registro |
| `app/dashboard/page.tsx` | Rota /dashboard | Página protegida |

## 🔑 APIs Utilizadas

```typescript
// Registrar usuário
registerUser(cpf: string, email: string, password: string)

// Fazer login
loginUser(cpfOrEmail: string, password: string)

// Fazer logout
logoutUser()

// Hook para usar em componentes
useAuth() → { user, userProfile, loading, error, ... }
```

## 💡 Exemplo de Uso

```typescript
'use client';

import { useAuth } from '@/lib/auth-context';

export default function Minhapágina() {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;
  if (!user) return <div>Não autenticado</div>;

  return <div>Bem-vindo, {user.email}!</div>;
}
```

## 🎯 Funcionalidades

✅ **Registro**
- CPF com validação real
- Email
- Dupla senha
- Validações completas

✅ **Login**
- CPF ou Email no mesmo input
- Senha
- Redirecionamento automático

✅ **Dashboard**
- Dados do usuário
- Logout
- Proteção de rota

## ⚠️ Erros Comuns

### "Firebase is not initialized"
```
Solução: Verifique .env.local
Reinicie: npm run dev
```

### "Email already in use"
```
Solução: Use outro email ou já está registrado
```

### "Invalid CPF"
```
Solução: CPF inválido, verifique os dígitos
Teste: 123.456.789-09
```

## 📚 Documentação Completa

Para mais detalhes, leia:

- **Setup**: `FIREBASE_SETUP.md`
- **API**: `SISTEMA_LOGIN_README.md`
- **Exemplos**: `TEST_EXAMPLES.tsx`
- **Mapa**: `NAVIGATION_MAP.md`
- **Checklist**: `IMPLEMENTATION_CHECKLIST.md`

## 🔐 Segurança Verificada

- ✅ Senhas com hash (Firebase)
- ✅ CPF validado
- ✅ Email validado
- ✅ Variáveis de ambiente
- ✅ Proteção de rotas
- ✅ Context seguro

## 🎨 Preview

```
HOME (/)
├─ Navbar com Login/Registrar
├─ Hero section
└─ Cards informativos

LOGIN (/login)
├─ Input CPF ou Email
├─ Input Senha
└─ Botão Conectar

REGISTER (/register)
├─ Input CPF (formatado)
├─ Input Email
├─ Input Senha
├─ Input Confirmar Senha
└─ Botão Criar Conta

DASHBOARD (/dashboard) ✅ Protegido
├─ Navbar com Sair
└─ Perfil do usuário
```

## 🚀 Próximos Passos

Depois de testado, você pode adicionar:

1. **Recuperação de Senha**
   - Formulário de "Esqueci a Senha"
   - Email de reset

2. **Editar Perfil**
   - Tela de edição
   - Upload de foto

3. **Dashboard com Conteúdo**
   - Cursos do usuário
   - Progresso
   - Simulados

4. **Sistema de Questões**
   - CRUD de questões
   - Simulados
   - Relatórios

## ✨ Dicas

1. **Testes**: Use o `TEST_EXAMPLES.tsx` como referência
2. **Debug**: Abra DevTools (F12) para ver console
3. **Firestore**: Acesse Firebase Console para ver dados salvos
4. **Erros**: Mensagens aparecem em vermelho no formulário

## 📊 Stack Tecnológico

```
Frontend:
- Next.js 16.1.6 (React 19)
- TypeScript
- Tailwind CSS

Backend/Auth:
- Firebase Auth
- Firestore Database

Validações:
- CPF com dígitos verificadores
- Email
- Senhas
```

---

**Pronto para começar?** 🚀

1. Configure Firebase → ⭐ CRUCIAL
2. Preencha .env.local
3. `npm install` e `npm run dev`
4. Registre e teste!

Qualquer dúvida, consulte a documentação completa.
