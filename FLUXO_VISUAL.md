# 📊 Fluxo do Sistema Admin - Diagrama Visual

## 1. Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────┐
│                     Detona Concurseiro                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Firebase Authentication                    │  │
│  │  (Email/CPF + Senha + isAdmin flag)                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          React Context (AuthProvider)                │  │
│  │  - user: User                                        │  │
│  │  - userProfile: UserProfile (com isAdmin)           │  │
│  │  - loading, error, loginUser, registerUser, etc     │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Firestore Database                         │  │
│  │                                                      │  │
│  │  ├─ collections/                                    │  │
│  │  │  ├─ users/{uid}                                 │  │
│  │  │  │  ├─ cpf, email, createdAt                    │  │
│  │  │  │  ├─ isAdmin: boolean                         │  │
│  │  │  │  └─ concursos/{id}                           │  │
│  │  │  │     └─ nomeConcurso, numeroInscricao, status │  │
│  │  │  │                                              │  │
│  │  │  └─ concursosData/{id}                         │  │
│  │  │     ├─ nomeConcurso, banca, cargo              │  │
│  │  │     ├─ salario, dataProva, edital              │  │
│  │  │     └─ descricao, dataCriacao                  │  │
│  │                                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 2. Fluxo de Usuário

### 👥 Visitante (Não Logado)

```
        [Home]
          ↓
    [Sem Acesso]
       ↙    ↘
   [Login]  [Register]
       ↘    ↙
   [Usuário Comum]
```

### 👤 Usuário Comum (Logado, isAdmin=false)

```
                    [Dashboard]
                        ↓
            ┌───────────┴───────────┐
            ↓                       ↓
    [Meus Concursos]    [Concursos Disponíveis]
    (seus favoritos)     (lista completa com busca)
            ↓                       ↑
    - Deletar                  - Buscar
    - Ver status           - Filtrar por banca
                           - Adicionar aos Meus →
                                   ↓
                         [Aparecem em Meus Concursos]
```

### 👨‍💼 Admin (Logado, isAdmin=true)

```
                    [Dashboard]
                        ↓
        ┌───────────────┼───────────────┐
        ↓               ↓               ↓
    [Meus Concursos]  [Concursos Disponíveis]  [Admin Panel]
    (seus favoritos)   (lista completa)        (gerenciar)
                                                   ↓
                                    ┌──────────────┴──────────────┐
                                    ↓                             ↓
                            [Adicionar Concurso]        [Deletar Concurso]
                            (formulário com validação)   (confirmação)
                                    ↓                             ↓
                            [Firestore: concursosData]
                                    ↓
                            [Aparecem em Concursos Disponíveis]
                                    ↓
                            [Usuários podem adicionar aos favoritos]
```

## 3. Fluxo de Dados

### Admin Adicionando Concurso

```
Admin Page (/admin)
    ↓
FormComponent: AddConcursoDataForm
    ↓
Input Fields:
  - Nome ⭐
  - Banca ⭐
  - Cargo ⭐
  - Salário
  - Data Prova ⭐
  - Edital URL
  - Descrição
    ↓
useConcursosData Hook
    ↓
adicionarConcursoData()
    ↓
Firestore: collection('concursosData').add({...})
    ↓
Real-time Listener (onSnapshot)
    ↓
Tabela Atualizada
    ↓
✓ Sucesso ou ✗ Erro
```

### Usuário Adicionando aos Favoritos

```
Concursos Disponíveis Page (/concursos-disponiveis)
    ↓
ConcursosDisponivelsList Component
    ↓
useConcursosData Hook (read all)
    ↓
Display Grid com Cards
    ↓
Busca/Filtro (em memória, sem delay)
    ↓
Card com Botão "Adicionar aos Meus"
    ↓
useConcursos Hook
    ↓
adicionarConcurso(nomeConcurso, numeroInscricao)
    ↓
Firestore: collection('users/{uid}/concursos').add({...})
    ↓
Real-time Listener
    ↓
Meus Concursos Page (/meus-concursos) Atualiza
    ↓
✓ Concurso Adicionado
```

## 4. Fluxo de Renderização

### Estrutura de Componentes

```
AuthProvider (layout.tsx)
    ↓
Protected Route Check
    ↓
├─ Home
│  └─ Navbar com links (login/register ou dashboard)
│
├─ Login Page
│  └─ LoginForm
│
├─ Register Page
│  └─ RegisterForm
│
├─ Dashboard
│  ├─ Navbar com todos os links
│  ├─ User Profile Info
│  └─ Navigation Buttons
│
├─ Meus Concursos (/meus-concursos)
│  ├─ Navbar
│  └─ ConcursosList (useConcursos Hook)
│     └─ Grid de Cards
│
├─ Concursos Disponíveis (/concursos-disponiveis)
│  ├─ Navbar
│  └─ ConcursosDisponivelsList (useConcursosData Hook)
│     ├─ Search Input
│     ├─ Banca Filter
│     └─ Grid de Cards
│        └─ Botão "Adicionar aos Meus"
│
└─ Admin (/admin) - Protegido por isAdmin check
   ├─ Navbar (com link Admin destacado)
   ├─ AddConcursoDataForm
   │  └─ Formulário + Tabela de Concursos
   └─ useConcursosData Hook
```

## 5. Estados e Transições

### Estados da Aplicação

```
User State Machine:
┌──────────────┐
│   NO_AUTH    │  (visitante, sem conta)
└──────┬───────┘
       │ [login/register]
       ↓
┌──────────────────────────┐
│   AUTHENTICATED_USER      │  (logado, isAdmin=false)
└──────┬───────────────────┘
       │ [marcar como admin no Firestore]
       ↓
┌──────────────────────────┐
│   AUTHENTICATED_ADMIN     │  (logado, isAdmin=true)
└──────┬───────────────────┘
       │ [logout]
       ↓
       [NO_AUTH]
```

### Estados de Página

```
Page States:
[Loading] ─→ [Ready] ─→ [Error]
            ↓  ↑
        [Submitting]
            ↓  ↑
       [Success/Error Message]
```

## 6. Fluxo de Busca e Filtro

### Busca em Tempo Real

```
Input Field
    ↓
onChange Event
    ↓
setSearchTerm(value)
    ↓
useMemo(() => {
  return concursosData.filter(...)
})
    ↓
Componentes Filtrando no Cliente
    ↓
Display Atualizado Instantaneamente
    
[SEM delay de rede - tudo em memória!]
```

## 7. Fluxo de Validação

### Validação de Formulário

```
Input Field
    ↓
handleChange()
    ↓
setFormData
    ↓
onChange Feedback (Opcional)
    ↓
Form Submit
    ↓
Validação Local:
├─ Campo vazio? ✗
├─ Email válido? ✓
├─ CPF válido? ✓
└─ Senha match? ✓
    ↓
✓ Tudo OK → Enviar para Firebase
✗ Erro → Mostrar mensagem
```

## 8. Integração com Firebase

### Real-time Listeners

```
Component Mount
    ↓
useEffect(() => {
  const unsubscribe = onSnapshot(
    query(collection(...)),
    (snapshot) => {
      setConcursos([...])
    }
  )
  return () => unsubscribe()
})
    ↓
Firestore Emite Mudanças
    ↓
Componente Atualiza Automaticamente
    ↓
Component Unmount
    ↓
Unsubscribe (cleanup)
```

## 9. Sequência de Operações - Happy Path

### Admin Adicionando Concurso

```
1. Admin faz login
   └─ isAdmin=true no Firestore
2. Acessa /admin
   └─ Autorização checada
3. Preenche formulário
   ├─ Nome: "INSS 2024"
   ├─ Banca: "CEBRASPE"
   ├─ Cargo: "Analista"
   ├─ Data: "2024-06-15"
   └─ ...
4. Clica "Adicionar Concurso"
   └─ Validação local passa ✓
5. adicionarConcursoData() chamado
   └─ Envia para Firestore
6. Firestore salva em concursosData
   └─ Timestamp adicionado
7. onSnapshot dispara
   └─ Tabela atualiza
8. Usuário vê novo concurso na tabela
9. Usuário comum vê em /concursos-disponiveis
```

## 10. Sequence Diagram - Fluxo Completo

```
Admin          App         Firebase       User
 │              │              │           │
 ├─Login────────→│              │           │
 │              │─Auth Check───→│           │
 │              │←──isAdmin──────│           │
 │              │              │           │
 │ Access /admin              │           │
 ├──────────────→│              │           │
 │              │─Check Auth───→│           │
 │              │←──True────────│           │
 │              │              │           │
 │ Fill Form    │              │           │
 ├──────────────→│              │           │
 │              │              │           │
 │ Submit       │              │           │
 ├──────────────→│              │           │
 │              │─Validate─────X (no erro)│
 │              │              │           │
 │              │─Save─────────→│           │
 │              │←──Saved───────│           │
 │              │              │           │
 │              │─Listen Changes           │
 │              │←──Snapshot────│           │
 │              │──Update Table─           │
 │ Show Success │              │           │
 │←─────────────│              │           │
 │              │              │           │
 │              │              │    User Logs In
 │              │              │    ↓
 │              │              │    /concursos-disponiveis
 │              │              │    ↓
 │              │───Read All───→│
 │              │←──Concursos───│
 │              │    Grid       │
 │              │    + Busca    │
 │              │    + Filtro   │
 │              │              │
 │              │              │    User Adds
 │              │              │    ↓
 │              │              │    Click "Adicionar"
 │              │              │    ↓
 │              │    Save to    │
 │              │    users/{uid}/concursos
 │              │←──Added───────│
 │              │              │
 │              │              │    /meus-concursos
 │              │              │    ↓
 │              │              │    Ver Concurso!
 │              │              │    ✓
```

---

## Resumo Rápido

1. **Admin** → Adiciona dados em `/admin` → Firestore `concursosData`
2. **Firestore** → Real-time listeners atualizam tudo
3. **Concursos Disponíveis** → Mostra dados do admin com busca/filtro
4. **Usuários** → Clicam "Adicionar" → Salvam em seu próprio subcollection
5. **Meus Concursos** → Mostra favoritos pessoais
6. **Dashboard** → Hub central com links para tudo

🎉 **Fluxo Completo, Intuitivo e Eficiente!**
