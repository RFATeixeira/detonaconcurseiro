# 🗺️ Mapa de Navegação - Sistema de Login e Registro

## URLs do Sistema

```
┌─────────────────────────────────────────────────────┐
│              DETONA CONCURSEIRO                      │
│         Sistema de Login e Registro                  │
└─────────────────────────────────────────────────────┘

/
├─── Home Page
│    ├─ Não autenticado: Mostra links para Login/Registro
│    └─ Autenticado: Mostra link para Dashboard
│
├─── /login
│    └─ Formulário de Login
│        ├─ Input: CPF ou Email
│        ├─ Input: Senha
│        ├─ Links: Criar Conta / Página Inicial
│        └─ Ação: Conectar
│
├─── /register
│    └─ Formulário de Registro
│        ├─ Input: CPF (com validação e formatação)
│        ├─ Input: Email
│        ├─ Input: Senha
│        ├─ Input: Confirmar Senha
│        ├─ Links: Já tem conta? / Fazer Login
│        └─ Ação: Criar Conta
│
└─── /dashboard (Protegido)
     └─ Perfil do Usuário
         ├─ Informações: Email, CPF, Data de Criação
         ├─ Links: Página Inicial
         └─ Ação: Sair (Logout)
```

## Fluxos de Navegação

### 📝 Fluxo de Novo Usuário
```
1. / (Home)
   ↓
2. /register (Clica em "Registrar")
   ↓ (Preenche formulário e clica "Criar conta")
3. /dashboard (Redirecionado automaticamente)
   ↓ (Clica em "Sair")
4. /login (Redirecionado para login)
```

### 🔐 Fluxo de Login Existente
```
1. / (Home)
   ↓
2. /login (Clica em "Login")
   ↓ (Preenche email/CPF e senha, clica "Conectar")
3. /dashboard (Redirecionado automaticamente)
   ↓ (Clica em "Sair")
4. /login (Redirecionado para login)
```

### 🔄 Fluxo de Redirecionamento Automático
```
Não Autenticado:
├─ Tenta acessar /dashboard
│  └─ Redirecionado para /login
│
├─ Tenta acessar /login
│  └─ Permite acessar
│
└─ Acessa /register
   └─ Permite acessar

Autenticado:
├─ Tenta acessar /dashboard
│  └─ Permite acessar
│
├─ Acessa /login
│  └─ Permite acessar
│
└─ Acessa /register
   └─ Permite acessar
```

## Estrutura de Componentes

```
RootLayout (app/layout.tsx)
├─ AuthProvider (lib/auth-context.tsx)
│  └─ Fornece contexto de autenticação para toda a app
│
├─ / (app/page.tsx)
│  └─ Home Page
│     ├─ Navbar com links condicionais
│     └─ Cards informativos
│
├─ /login (app/login/page.tsx)
│  └─ LoginForm (components/LoginForm.tsx)
│     ├─ Input CPF/Email
│     ├─ Input Senha
│     └─ Validação e tratamento de erros
│
├─ /register (app/register/page.tsx)
│  └─ RegisterForm (components/RegisterForm.tsx)
│     ├─ Input CPF (com formatação)
│     ├─ Input Email
│     ├─ Input Senha
│     ├─ Input Confirmar Senha
│     └─ Validação e tratamento de erros
│
└─ /dashboard (app/dashboard/page.tsx)
   ├─ Proteção de rota
   ├─ Navbar com botão Sair
   └─ Exibição de dados do usuário
```

## Estados de Autenticação

### 🔄 Loading
```
Quando: Ao carregar a página (verificando autenticação)
Mostra: Spinner com mensagem "Carregando..."
Duração: Poucos milissegundos
```

### 🟢 Autenticado
```
Quando: Usuário fez login com sucesso
Acesso: /dashboard, /login, /register, /
Dados: user (Email, UID), userProfile (CPF, createdAt)
```

### 🔴 Não Autenticado
```
Quando: Usuário não fez login ou fez logout
Acesso: /login, /register, / (restrito: /dashboard redireciona)
Dados: user = null, userProfile = null
```

## Modelos de Dados

### User (Firebase Auth)
```typescript
{
  uid: string           // ID único do usuário
  email: string         // Email do usuário
  emailVerified: boolean // Email verificado?
  displayName: string|null // Nome (não usado atualmente)
  photoURL: string|null // Foto (não usada atualmente)
  createdAt: timestamp  // Data de criação da conta
}
```

### UserProfile (Firestore)
```typescript
{
  cpf: string           // CPF (sem formatação: 11 dígitos)
  email: string         // Email (duplicado de Auth)
  createdAt: string     // Data de criação (ISO 8601)
}
```

## Validações

### CPF
- [x] Exatamente 11 dígitos
- [x] Não pode ser sequência igual (000.000.000-00, etc)
- [x] Dígito verificador 1 validado
- [x] Dígito verificador 2 validado
- [x] Formatação automática no input

### Email
- [x] Deve conter @
- [x] Deve ter domínio válido

### Senha
- [x] Mínimo 6 caracteres
- [x] Confirmação deve ser igual
- [x] Hash seguro (Firebase)

## Mensagens de Erro

| Erro | Causa | Solução |
|------|-------|---------|
| "CPF inválido" | CPF não passou validação | Verifique o CPF digitado |
| "Email inválido" | Email sem formato correto | Use formato: nome@dominio.com |
| "As senhas não conferem" | Senhas diferentes | Verifique a confirmação de senha |
| "Senha deve ter no mínimo 6 caracteres" | Senha muito curta | Digite uma senha maior |
| "Email already in use" | Email já registrado | Use outro email |
| "user-not-found" | Email não existe | Registre-se ou verifique o email |
| "wrong-password" | Senha incorreta | Verifique a senha digitada |
| "CPF não encontrado" | CPF não existe (login) | Registre-se com esse CPF |

## Estilos e Design

- **Framework CSS:** Tailwind CSS v4
- **Tema de cores:**
  - Primária: Azul (#3b82f6)
  - Secundária: Cinza (#6b7280)
  - Erro: Vermelho (#dc2626)
  - Sucesso: Verde (#16a34a)

- **Layout:**
  - Mobile First (responsivo)
  - Máx-width: 7xl para conteúdo
  - Padding: 4px a 8px

- **Componentes:**
  - Formulários: Input com border cinza
  - Botões: Fundo azul, hover mais escuro
  - Cards: Fundo branco com sombra
  - Navbar: Fundo branco com sombra

## Próximas Páginas (Para Adicionar)

```
/
├─── /dashboard
│    ├─── /meus-cursos (Lista de cursos do usuário)
│    ├─── /minhas-questoes (Questões respondidas)
│    └─── /perfil (Edição de perfil)
│
├─── /simulados (Lista de simulados)
│    └─── /simulados/:id (Tela do simulado)
│
├─── /cursos (Catálogo de cursos)
│    └─── /cursos/:id (Detalhes do curso)
│
└─── /admin (Painel administrativo) - Opcional
     ├─── /admin/questoes
     ├─── /admin/simulados
     └─── /admin/usuarios
```

---

**Última atualização:** 30/01/2025
**Status:** ✅ Implementação Completa
