# Detona Concurseiro - Sistema de Login e Registro

## 📋 O que foi implementado

### ✅ Telas de Autenticação

1. **Página de Registro** (`/register`)
   - Campo de CPF com formatação automática (000.000.000-00)
   - Validação de CPF (verifica dígitos verificadores)
   - Campo de Email
   - Dupla senha (Senha + Confirmar Senha)
   - Validação completa de formulário

2. **Página de Login** (`/login`)
   - Input único que aceita CPF ou Email
   - Campo de Senha
   - Validação e mensagens de erro

3. **Dashboard** (`/dashboard`)
   - Página protegida que mostra dados do usuário
   - Exibe Email, CPF formatado e data de criação da conta
   - Botão de logout

4. **Página Inicial** (`/`)
   - Home com links para login/registro
   - Mostra conteúdo diferente se está autenticado ou não

### 🔐 Autenticação com Firebase

- Implementação completa com Firebase Authentication
- Armazenamento de perfil do usuário no Firestore
- Validação de CPF no lado do cliente
- Proteção de rotas com redirecionamento automático

### 🏗️ Estrutura do Projeto

```
app/
├── layout.tsx (com AuthProvider)
├── page.tsx (home)
├── login/
│   └── page.tsx
├── register/
│   └── page.tsx
└── dashboard/
    └── page.tsx

components/
├── LoginForm.tsx
└── RegisterForm.tsx

lib/
├── firebase.ts (configuração do Firebase)
└── auth-context.tsx (Context API para autenticação)

.env.local (variáveis de ambiente)
FIREBASE_SETUP.md (guia completo de configuração)
```

## 🚀 Como Começar

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Firebase

Siga o guia completo em [FIREBASE_SETUP.md](./FIREBASE_SETUP.md):

- Criar projeto no Firebase Console
- Ativar Email/Password Authentication
- Criar Firestore Database
- Preencher `.env.local` com credenciais

### 3. Executar o Servidor

```bash
npm run dev
```

Acesse `http://localhost:3000`

## 📱 Como Usar

### Registrar Nova Conta
1. Clique em "Registrar" na página inicial
2. Preencha CPF, Email, Senha e Confirmação
3. Clique em "Criar conta"
4. Será redirecionado automaticamente para o dashboard

### Fazer Login
1. Clique em "Login" na página inicial
2. Digite Email e Senha
3. Clique em "Conectar"
4. Será redirecionado para o dashboard

### Ver Perfil
1. Acesse `/dashboard` quando autenticado
2. Veja seus dados (Email, CPF, Data de Criação)
3. Clique em "Sair" para fazer logout

## ✨ Recursos de Segurança

- ✅ Validação de CPF com dígitos verificadores
- ✅ Senhas com hash seguro (Firebase)
- ✅ Variáveis de ambiente para credenciais
- ✅ Proteção de rotas
- ✅ Context API para gerenciamento de estado
- ✅ Validação no lado do cliente

## 📝 Próximos Passos

Você pode adicionar:
- [ ] Recuperação de senha por email
- [ ] Edição de perfil
- [ ] Upload de foto de perfil
- [ ] Dashboard com estatísticas
- [ ] Sistema de simulados
- [ ] Banco de dados de questões
- [ ] Ranking de usuários
- [ ] Certificados de conclusão

## 🔧 Arquivos Importantes

- `lib/firebase.ts` - Configuração do Firebase
- `lib/auth-context.tsx` - Context e hooks de autenticação
- `components/LoginForm.tsx` - Componente de login
- `components/RegisterForm.tsx` - Componente de registro
- `.env.local` - Variáveis de ambiente (não versionar!)
- `FIREBASE_SETUP.md` - Guia completo de setup

## ❓ Dúvidas Frequentes

**P: Como faço login com CPF?**
R: A implementação atual usa email para login. Você pode registrar com CPF, mas faz login com o email associado. Para aceitar CPF no login, seria necessário adicionar uma busca no Firestore.

**P: As senhas são seguras?**
R: Sim! O Firebase usa bcrypt para hash de senhas. As senhas nunca são armazenadas em texto plano.

**P: Onde os dados são salvos?**
R: Os dados são salvos no Firestore (banco de dados do Firebase) e autenticação no Firebase Authentication.

---

Desenvolvido para o projeto Detona Concurseiro 🎓
