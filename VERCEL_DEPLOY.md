# 🚀 DEPLOY VERCEL - GUIA RÁPIDO

## ✅ Tudo já está configurado para deploy direto!

Você só precisa fazer **3 passos simples** no Vercel:

### Passo 1: Conecte seu repositório no Vercel

1. Vá para [vercel.com](https://vercel.com)
2. Clique em **"New Project"**
3. Conecte seu repositório GitHub/GitLab/Bitbucket
4. Selecione este projeto

### Passo 2: Configure as Variáveis de Ambiente no Vercel

Na dashboard do Vercel, vá para **Settings > Environment Variables** e adicione EXATAMENTE estas variáveis:

#### Variáveis Públicas (já estão no `.env.production`):
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDyOLV_5IpKP0VB2OumYYRt74vecGUZGZc
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=detonaconcurseiro.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=detonaconcurseiro
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=detonaconcurseiro.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=675336961690
NEXT_PUBLIC_FIREBASE_APP_ID=1:675336961690:web:843e62cd9b64f4f8c06923
```

#### Variáveis Privadas (COPIADAS do `.env.production.local`):
```
FIREBASE_ADMIN_PROJECT_ID=detonaconcurseiro
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@detonaconcurseiro.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY=(copie a chave privada do .env.production.local)
```

### Passo 3: Deploy!

1. Clique em **"Deploy"** no Vercel
2. Pronto! Seu site estará online em minutos

---

## 📁 Arquivos Importantes

- **`.env.production`** - Variáveis públicas (já no repositório)
- **`.env.production.local`** - Suas credenciais privadas (NÃO vai para git)
- **`vercel.json`** - Configuração do deploy (pronto para usar)
- **`next.config.ts`** - Configuração do Next.js (tudo ok)
- **`package.json`** - Dependências (tudo instalado)

---

## ❓ FAQ

**P: Preciso fazer algo no Vercel antes do deploy?**
R: Não! Só adicionar as variáveis de ambiente e clicar "Deploy".

**P: Pode colocar as chaves privadas no `.env.production`?**
R: NÃO! As chaves privadas ficam no `.env.production.local` (não é versionado) e você copia manualmente para o Vercel.

**P: E se eu quiser usar variáveis diferentes em desenvolvimento e produção?**
R: Já está tudo separado:
- Desenvolvimento: `.env.local`
- Produção: `.env.production` + Vercel

---

## 🔍 Verificação Rápida

Antes de fazer deploy, confirme que tem tudo:

```bash
# 1. Variáveis públicas estão no .env.production
cat .env.production

# 2. Variáveis privadas estão no .env.production.local (não é versionado)
cat .env.production.local

# 3. vercel.json está correto
cat vercel.json

# 4. Build está funcionando
npm run build

# 5. Pode rodar em produção
npm run start
```

---

## 🎯 Resumo do Setup

| Arquivo | Tipo | No Git? | Vercel |
|---------|------|---------|--------|
| `.env.production` | Público | ✅ SIM | Automático |
| `.env.production.local` | Privado | ❌ NÃO | Manual (copiar) |
| `vercel.json` | Config | ✅ SIM | Automático |

---

## 💡 Dica Pro

Se quiser fazer deploy automático toda vez que fizer push:

1. No Vercel, vá para **Settings > Git**
2. Ative **"Automatic Deployments"**
3. Pronto! Cada push já faz deploy automaticamente

---

**Dúvidas?** Veja os arquivos:
- [README.md](../README.md) - Documentação geral
- [.env.example](.env.example) - Template das variáveis
- [FIREBASE_SETUP.md](../FIREBASE_SETUP.md) - Setup Firebase
