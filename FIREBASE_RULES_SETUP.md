# 🔒 CONFIGURAR REGRAS DO FIREBASE - URGENTE!

## ⚠️ Erro: "Missing or insufficient permissions"

Esse erro acontece porque as **regras do Firestore** estão muito restritivas. Vamos corrigir!

---

## 🚀 SOLUÇÃO RÁPIDA (5 minutos)

### Passo 1: Acesse o Firebase Console

1. Vá para: https://console.firebase.google.com
2. Selecione seu projeto: **detonaconcurseiro**

---

### Passo 2: Configure Regras do Firestore

1. No menu lateral, clique em **"Firestore Database"**
2. Clique na aba **"Rules"** (Regras)
3. **COPIE E COLE** este código:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isOwner(userId);
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isOwner(userId);
      allow delete: if isAdmin();
      
      match /concursos/{concursoId} {
        allow read, write: if isOwner(userId);
      }
    }
    
    // Global concursos data
    match /concursosData/{concursoId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAdmin();
      
      match /candidatos/{candidatoId} {
        allow read: if isAuthenticated();
        allow create, update, delete: if isAdmin();
      }
    }
    
    // Concursos externos pendentes
    match /concursosExternosPendentes/{concursoId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAdmin();
    }
    
    // Chat messages
    match /chats/{chatId} {
      allow read, write: if isAuthenticated();
      
      match /messages/{messageId} {
        allow read, write: if isAuthenticated();
      }
    }
    
    // Block everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

4. Clique em **"Publish"** (Publicar)

---

### Passo 3: Configure Regras do Storage

1. No menu lateral, clique em **"Storage"**
2. Clique na aba **"Rules"** (Regras)
3. **COPIE E COLE** este código:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // User documents
    match /users/{userId}/documents/{document=**} {
      allow read, write, delete: if isAuthenticated() && isOwner(userId);
    }
    
    // Profile photos
    match /users/{userId}/profile/{fileName} {
      allow read, write, delete: if isAuthenticated() && isOwner(userId);
      allow write: if request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
    
    // Concurso attachments
    match /concursos/{concursoId}/anexos/{fileName} {
      allow read: if isAuthenticated();
      allow write, delete: if isAuthenticated();
    }
    
    // Block everything else
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

4. Clique em **"Publish"** (Publicar)

---

### Passo 4: Configure Authentication

1. No menu lateral, clique em **"Authentication"**
2. Clique na aba **"Sign-in method"**
3. Certifique-se que **"Email/Password"** está **ENABLED** (Ativado)

---

### Passo 5: Adicione seu primeiro Admin

1. No menu lateral, clique em **"Firestore Database"**
2. Clique em **"Start collection"**
3. Collection ID: `users`
4. Document ID: (seu UID do Firebase Auth - você vai precisar fazer login primeiro)
5. Adicione os campos:
   ```
   role: "admin"
   nome: "Seu Nome"
   email: "seu@email.com"
   cpf: "12345678900"
   ```
6. Clique em **"Save"**

---

## ✅ Pronto!

Agora seu app no Vercel vai funcionar corretamente! 🎉

---

## 🧪 Como Testar

1. Acesse seu app no Vercel
2. Faça login com email/senha
3. Se ainda der erro:
   - Abra o Console do navegador (F12)
   - Veja o erro específico
   - Copie e me envie

---

## 📋 Checklist

- ✅ Regras do Firestore publicadas
- ✅ Regras do Storage publicadas
- ✅ Email/Password autenticação ativada
- ✅ Primeiro usuário admin criado
- ✅ Testado o login

---

## ⚠️ IMPORTANTE

Essas regras permitem que:
- ✅ Usuários autenticados leiam concursos
- ✅ Usuários gerenciem seus próprios dados
- ✅ Apenas admins criem/editem concursos globais
- ✅ Chat funcione para todos autenticados
- ❌ Usuários não autenticados NÃO têm acesso

---

## 🔍 Troubleshooting

**Ainda dá erro?**

1. Verifique se as regras foram publicadas (deve ter timestamp recente)
2. Limpe o cache do navegador (Ctrl + Shift + Del)
3. Faça logout e login novamente
4. Verifique no Console do navegador (F12) qual o erro exato

**Erro "Permission denied"?**

- Verifique se o usuário está realmente autenticado
- Verifique se o documento `users/{uid}` foi criado com `role: "admin"`

---

## 📞 Arquivos Criados

Os arquivos de regras estão em:
- `firestore.rules` - Regras do Firestore
- `storage.rules` - Regras do Storage

Você pode usar estes arquivos com Firebase CLI no futuro:
```bash
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

---

**Agora sim vai funcionar! 🚀**
