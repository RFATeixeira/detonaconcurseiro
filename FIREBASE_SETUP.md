# Guia de Configuração do Firebase

## Passo 1: Criar um Projeto no Firebase Console

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Clique em "Criar Projeto"
3. Digite o nome: `detonaconcurseiro`
4. Clique em "Criar Projeto" e aguarde a conclusão

## Passo 2: Configurar Autenticação

1. No painel do Firebase, vá para **Authentication** no menu lateral
2. Clique na aba **Sign-in method**
3. Clique em **Email/Password**
4. Ative a opção **Email/Password** e clique **Save**

## Passo 3: Criar Banco de Dados Firestore

1. No painel do Firebase, vá para **Firestore Database** no menu lateral
2. Clique em **Criar banco de dados**
3. Escolha **Iniciar no modo de teste** (ou modo seguro - você configurará as regras)
4. Selecione a região (recomendado: `us-central1`)
5. Clique em **Criar**

## Passo 4: Obter Credenciais

1. Vá para **Project Settings** (ícone de engrenagem no canto superior)
2. Clique na aba **General**
3. Role para baixo até encontrar sua aplicação web (ícone `</>``)
4. Copie o objeto `firebaseConfig`

## Passo 5: Configurar Variáveis de Ambiente

1. Abra o arquivo `.env.local` no seu projeto
2. Preencha as variáveis com os dados do seu `firebaseConfig`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

## Passo 6: Instalar Dependências

Execute no terminal:

```bash
npm install
```

## Passo 7: Configurar Regras do Firestore (Segurança)

Para modo de desenvolvimento (abra para testes), vá em **Firestore Database** > **Rules**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários só podem ler/escrever seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Outras coleções conforme necessário
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Passo 8: Testar o Sistema

1. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Acesse `http://localhost:3000/register` para criar uma conta

3. Acesse `http://localhost:3000/login` para fazer login

## Funcionalidades Implementadas

### Registro
- Campo de CPF com validação (verifica dígitos verificadores)
- Campo de Email
- Campo de Senha com confirmação
- Validação de força da senha (mínimo 6 caracteres)

### Login
- Aceita Email ou CPF no mesmo input
- Validação de credenciais
- Redirecionamento automático para dashboard

### Dashboard
- Exibição de dados do usuário (Email e CPF)
- Data de criação da conta
- Botão de logout

### Segurança
- Senhas armazenadas com hash seguro pelo Firebase
- Validação de CPF no lado do cliente
- Context API para gerenciamento de estado de autenticação
- Proteção de rotas com redirecionamento automático

## Troubleshooting

### Erro: "Firebase is not initialized"
- Verifique se as variáveis de ambiente estão preenchidas no `.env.local`
- Reinicie o servidor de desenvolvimento (`npm run dev`)

### Erro ao registrar: "Email already in use"
- O email já está registrado, tente outro

### Erro: "Invalid CPF"
- Verifique o CPF e seus dígitos verificadores

## Próximas Melhorias

- Recuperação de senha por email
- Edição de perfil do usuário
- Upload de foto de perfil
- Integração com banco de dados de concursos
- Sistema de simulados
- Ranking de usuários
