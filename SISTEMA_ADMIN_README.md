# Sistema Admin - Detona Concurseiro

## Visão Geral

O sistema admin foi criado para permitir que usuários designados como administradores possam:
- Adicionar novos concursos com seus dados (banca, cargo, salário, data da prova, etc.)
- Gerenciar a base de dados de concursos disponíveis
- Visualizar todos os concursos cadastrados em uma tabela

## Estrutura de Dados

### Coleção: `concursosData`
Armazena informações sobre todos os concursos disponíveis na plataforma.

```typescript
{
  id: string;                    // Auto-gerado pelo Firestore
  nomeConcurso: string;          // Ex: "INSS 2024"
  banca: string;                 // Ex: "CEBRASPE"
  cargo: string;                 // Ex: "Analista do Seguro Social"
  salario: string;               // Ex: "R$ 2.500,00"
  dataProva: string;             // Data da prova (ISO format)
  edital: string;                // URL do edital (opcional)
  descricao: string;             // Descrição adicional (opcional)
  dataCriacao: Timestamp;        // Data/hora de criação
}
```

### Coleção: `users/{userId}/concursos`
Armazena os concursos que cada usuário adicionou aos seus favoritos.

```typescript
{
  id: string;                    // Auto-gerado
  nomeConcurso: string;          // Nome do concurso (referência)
  numeroInscricao: string;       // Número de inscrição do usuário
  status: 'com_dados' | 'sem_dados';
  dataCriacao: Timestamp;
  dadosConcurso?: any;           // Dados do concurso (quando linkado)
}
```

### UserProfile
Campo adicionado para identificar admins:

```typescript
{
  cpf: string;
  email: string;
  createdAt: string;
  isAdmin?: boolean;             // true para admins
}
```

## Como Tornar um Usuário Admin

### Método 1: Firebase Console (Recomendado)

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Selecione seu projeto
3. Vá para **Firestore Database**
4. Na coleção **users**, encontre o documento com o UID do usuário
5. Clique em **Editar documento** ou clique no documento para abrir
6. Adicione/edite o campo:
   - **Nome do campo**: `isAdmin`
   - **Tipo**: Boolean
   - **Valor**: `true`
7. Salve as mudanças

### Método 2: Encontrar o UID do Usuário

#### No Firebase Console:
1. Vá para **Authentication** > **Users**
2. Encontre o usuário desejado
3. O UID aparece na primeira coluna

#### Na aplicação (Console do Navegador):
1. Faça login
2. Abra o DevTools (F12)
3. Na aba **Console**, execute:
```javascript
console.log(auth.currentUser.uid);
```
4. Copie o UID exibido

## Páginas e Componentes

### `/admin`
- **Acesso**: Apenas usuários com `isAdmin: true`
- **Funcionalidades**:
  - Formulário para adicionar novos concursos
  - Tabela com todos os concursos cadastrados
  - Botão para deletar concursos
- **Componente**: `AddConcursoDataForm.tsx`
- **Arquivo**: `app/admin/page.tsx`

### `/concursos-disponiveis`
- **Acesso**: Usuários autenticados
- **Funcionalidades**:
  - Grid com todos os concursos cadastrados
  - Busca por nome e cargo
  - Filtro por banca
  - Botão para adicionar aos "Meus Concursos"
  - Links para edital (quando disponível)
- **Componente**: `ConcursosDisponivelsList.tsx`
- **Arquivo**: `app/concursos-disponiveis/page.tsx`

### `/meus-concursos`
- **Acesso**: Usuários autenticados
- **Funcionalidades**:
  - Grid com concursos adicionados pelo usuário
  - Opção para deletar concursos da lista pessoal
  - Status de cada concurso
- **Componente**: `ConcursosList.tsx`
- **Arquivo**: `app/meus-concursos/page.tsx`

## Fluxo de Navegação

### Para Usuários Comuns:
```
Home → Login/Register → Dashboard → Meus Concursos
                                  ↘ Concursos Disponíveis → Adicionar
```

### Para Admins:
```
Home → Login/Register → Dashboard → Meus Concursos
                                  ↘ Concursos Disponíveis
                                  ↘ Admin (Gerenciar concursos)
```

## Hooks Customizados

### `useConcursos()`
Gerencia concursos do usuário (usuários pessoais).

```typescript
const {
  concursos,           // Lista de concursos do usuário
  loading,             // Estado de carregamento
  error,               // Erros
  adicionarConcurso,   // (nome, numero) => Promise<void>
  deletarConcurso,     // (id) => Promise<void>
  atualizarStatusConcurso // (id, status) => Promise<void>
} = useConcursos();
```

### `useConcursosData()`
Gerencia dados de concursos (admin).

```typescript
const {
  concursosData,       // Lista completa de concursos
  loading,             // Estado de carregamento
  error,               // Erros
  adicionarConcursoData,   // (nome, banca, cargo, salario, data, edital, descricao) => Promise<void>
  deletarConcursoData,     // (id) => Promise<void>
  atualizarConcursoData    // (id, nome, banca, cargo, salario, data, edital, descricao) => Promise<void>
} = useConcursosData();
```

## Segurança (Firestore Rules - Recomendado)

As regras abaixo devem ser configuradas no Firebase Console (Firestore Database > Rules):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler seu próprio perfil
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow update: if request.auth.uid == userId && !request.resource.data.isAdmin;
      allow create: if request.auth.uid == userId;
      
      // Concursos pessoais do usuário
      match /concursos/{concursoId} {
        allow read, write: if request.auth.uid == userId;
      }
    }
    
    // Dados de concursos públicos (apenas admins podem escrever)
    match /concursosData/{concursoId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && 
                                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

## Campos Obrigatórios

### Adicionar Concurso (Admin):
- Nome do Concurso ✓
- Banca ✓
- Cargo ✓
- Data da Prova ✓
- Salário (opcional)
- Edital/URL (opcional)
- Descrição (opcional)

## Possíveis Melhorias Futuras

1. **Editar Concursos**: Permitir que admins editem informações de concursos já cadastrados
2. **Upload em Lote**: Importar concursos via CSV/Excel
3. **Histórico de Inscrições**: Rastrear inscrições do usuário em concursos
4. **Lembretes de Prova**: Notificações próximas à data da prova
5. **Estatísticas**: Dashboard com estatísticas de participação
6. **Avaliações**: Usuários avaliarem concursos e compartilhar experiências

## Troubleshooting

### "Acesso negado" ao acessar /admin
- Verifique se o campo `isAdmin` está definido como `true` no Firestore
- Confirme que você está na coleção correta: `users/{seu-uid}`
- Faça logout e login novamente para refrescar a sessão

### Concursos não aparecem em "Concursos Disponíveis"
- Verifique se foram adicionados através da página `/admin`
- Confirme que foram salvos na coleção `concursosData`
- Verifique a conexão com Firestore (console do navegador)

### Não consegue adicionar concursos aos "Meus Concursos"
- Verifique se está logado
- Confirme que a coleção `users/{uid}/concursos` existe (criada automaticamente no primeiro uso)
- Verifique as regras de segurança do Firestore
