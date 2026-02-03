# 🚀 DEPLOY RÁPIDO NO VERCEL

## ✅ TUDO JÁ ESTÁ PRONTO!

Não precisa criar nada no Vercel. Tudo está configurado aqui no projeto.

---

## 🎯 O QUE VOCÊ TEM:

### 📁 Arquivos de Configuração
- ✅ **`.env.production`** - Variáveis públicas (Firebase Client)
- ✅ **`.env.production.local`** - Variáveis privadas (Firebase Admin)
- ✅ **`vercel.json`** - Configuração do Vercel pronta
- ✅ **`next.config.ts`** - Next.js configurado
- ✅ **`package.json`** - Dependências OK

### 🔐 Credenciais Firebase
Todas as credenciais estão em:
- Público (`.env.production`): API Key, Auth Domain, Project ID, etc
- Privado (`.env.production.local`): Admin SDK, Client Email, Private Key

---

## 🚀 COMO FAZER DEPLOY EM 3 PASSOS:

### 1️⃣ Login no Vercel
```bash
npm i -g vercel
vercel login
```

### 2️⃣ Deploy com um comando
```bash
vercel --prod
```

**Pronto!** Vercel vai:
- ✅ Detectar Next.js automaticamente
- ✅ Usar `.env.production` para build
- ✅ Usar `.env.production.local` para ambiente de produção
- ✅ Fazer o deploy automático

---

## 📋 ALTERNATIVA: Deploy via GitHub

Se preferir fazer deploy automaticamente:

1. Faça **push** para seu repositório GitHub
2. Vá para [vercel.com](https://vercel.com)
3. Clique **"New Project"**
4. Selecione seu repositório
5. Vercel **automaticamente**:
   - ✅ Detecta Next.js
   - ✅ Lê `.env.production`
   - ✅ Pede para adicionar `.env.production.local`
   - ✅ Faz deploy

---

## 🔑 VARIÁVEIS NO VERCEL

Se o Vercel pedir, adicione exatamente estas:

**Do `.env.production` (públicas):**
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

**Do `.env.production.local` (privadas):**
```
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_PRIVATE_KEY
```

---

## ✨ PRONTO PARA DEPLOY!

Escolha um:

**Opção A - CLI (mais rápido):**
```bash
npm i -g vercel
vercel login
vercel --prod
```

**Opção B - GitHub (automático):**
1. Push para GitHub
2. Conectar repositório no Vercel
3. Deploy automático a cada push

---

## 🆘 Troubleshooting

**Build falha?**
- Verifique: `npm run build` localmente
- Veja erros de TypeScript: `npm run lint`

**Variáveis não funcionam?**
- Confirme que estão em: Vercel → Settings → Environment Variables
- As `NEXT_PUBLIC_*` devem estar presentes no build
- As `FIREBASE_ADMIN_*` precisam estar no runtime

**Erro de autenticação Firebase?**
- Verifique `.env.production.local`
- A `FIREBASE_ADMIN_PRIVATE_KEY` precisa estar com quebras de linha corretas

---

## 📞 Suporte

Documentação completa em:
- [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) - Guia detalhado
- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Setup Firebase
- [README.md](./README.md) - Documentação geral
