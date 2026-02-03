# 🎯 Detona Concurseiro

Sistema completo de gestão de concursos públicos com integração de APIs externas, aprovação administrativa e acompanhamento de candidatos.

## 📋 Funcionalidades

### Para Candidatos
- ✅ Cadastro e autenticação por CPF
- 📚 Visualização de concursos disponíveis
- ⭐ Adicionar concursos aos favoritos
- 📊 Dashboard personalizado com progresso
- 💬 Chat em tempo real
- 📄 Upload de documentos
- 👤 Gerenciamento de perfil

### Para Administradores
- ➕ Cadastro manual de concursos
- 📥 Importação de candidatos via Excel
- 🔄 Integração com PCI Concursos (web scraping)
- ✅ Sistema de aprovação de concursos externos
- ✏️ Edição inline de concursos
- 🏷️ Tags de status (Edital Aberto, Em andamento, Encerrado)
- 🎯 Filtros avançados

## 🛠️ Tecnologias

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Firebase Admin SDK
- **Banco de Dados**: Firestore (Firebase)
- **Autenticação**: Firebase Auth
- **Storage**: Firebase Storage
- **Web Scraping**: Cheerio
- **Excel**: xlsx

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta Firebase

### Passo 1: Clone o repositório
```bash
git clone https://github.com/RFATeixeira/detonaconcurseiro.git
cd detonaconcurseiro
```

### Passo 2: Instale as dependências
```bash
npm install
```

### Passo 3: Configure o Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com)
2. Ative Authentication (Email/Password)
3. Crie o Firestore Database
4. Ative o Storage
5. Copie `.env.example` para `.env.local` e preencha com suas credenciais

```bash
cp .env.example .env.local
```

#### Obter credenciais do Firebase:
- **Client SDK**: Project Settings → General → Your apps
- **Admin SDK**: Project Settings → Service Accounts → Generate new private key

### Passo 4: Configure as regras do Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /concursosData/{docId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      match /concursos/{docId} {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
}
```

### Passo 5: Crie um usuário admin

1. Registre-se no sistema
2. No Firestore, vá em `users/{seu-uid}`
3. Adicione o campo: `isAdmin: true`

### Passo 6: Execute o projeto
```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
detonaconcurseiro/
├── app/
│   ├── admin/                    # Painel administrativo
│   │   └── aprovar-concursos/    # Aprovação de concursos externos
│   ├── api/                      # API Routes
│   │   ├── aprovar-concurso-externo/
│   │   └── concursos-externos/   # Web scraping PCI
│   ├── concursos-disponiveis/    # Lista pública de concursos
│   ├── meus-concursos/           # Concursos do candidato
│   ├── dashboard/                # Dashboard do candidato
│   └── perfil/                   # Perfil do usuário
├── components/                   # Componentes React
│   ├── AddConcursoDataForm.tsx
│   ├── ConcursosDisponivelsList.tsx
│   ├── ImportarPlanilha.tsx
│   └── ...
├── lib/                          # Hooks e utilitários
│   ├── firebase.ts               # Config Firebase Client
│   ├── firebase-admin.ts         # Config Firebase Admin
│   ├── auth-context.tsx          # Contexto de autenticação
│   ├── use-concursos-data.ts     # CRUD de concursos
│   └── use-concursos-externos.ts # Integração API externa
└── public/                       # Arquivos estáticos
```

## 🔑 Variáveis de Ambiente

Arquivo `.env.local`:

```env
# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin SDK
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

## 📖 Fluxo de Uso

### Candidato
1. Registra-se com CPF e email
2. Visualiza concursos disponíveis
3. Adiciona concursos aos favoritos
4. Acompanha progresso no dashboard
5. Faz upload de documentos
6. Usa chat para suporte

### Admin
1. Acessa painel administrativo
2. Cadastra concursos manualmente ou importa via API
3. Revisa e edita concursos da API externa
4. Aprova para publicação
5. Importa candidatos via Excel
6. Edita concursos publicados

## 🎨 Funcionalidades Especiais

### Status Automático de Concursos
- **Edital Aberto**: Até data final de inscrição
- **Em andamento**: Entre data final e data de encerramento
- **Encerrado**: Após data de encerramento

### Integração PCI Concursos
- Web scraping automático de 444+ concursos
- Extração de dados: nome, órgão, vagas, salário, datas
- Sistema de aprovação antes de publicar
- Edição inline de dados extraídos

### Upload de Documentos
- Firebase Storage integrado
- Documentos vinculados a concursos
- Download direto do painel admin

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

## 🐛 Problemas Conhecidos

- Web scraping depende da estrutura do site PCI Concursos
- Necessário configurar Firebase Admin SDK para aprovar concursos
- Upload de documentos grandes pode ser lento

## � Deploy

### Netlify

1. Crie uma conta no [Netlify](https://netlify.com)
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente:
   - Vá em **Site settings → Environment variables**
   - Adicione todas as variáveis do `.env.local`:
     - `NEXT_PUBLIC_FIREBASE_API_KEY`
     - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
     - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
     - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
     - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
     - `NEXT_PUBLIC_FIREBASE_APP_ID`
     - `FIREBASE_ADMIN_PROJECT_ID`
     - `FIREBASE_ADMIN_CLIENT_EMAIL`
     - `FIREBASE_ADMIN_PRIVATE_KEY`
4. Build settings (já configurado no `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Deploy!

**Importante**: No Firebase Console, adicione o domínio do Netlify em:
- Authentication → Settings → Authorized domains

### Vercel (alternativa)

1. Instale Vercel CLI: `npm i -g vercel`
2. Execute: `vercel`
3. Configure as variáveis de ambiente quando solicitado
4. Deploy automático a cada push no GitHub

## �📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no [GitHub](https://github.com/RFATeixeira/detonaconcurseiro/issues)

## 🎯 Roadmap

- [ ] Sistema de notificações por email
- [ ] Exportar relatórios em PDF
- [ ] Integração com mais APIs de concursos
- [ ] App mobile (React Native)
- [ ] Sistema de ranking/gamificação

---

Desenvolvido com ❤️ para concurseiros
