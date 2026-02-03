# 📚 Página de Concursos - Guia de Uso

## 🎯 Funcionalidades Criadas

### ✅ Nova Página: `/concursos`

A página de concursos permite que o usuário gerencie todos os concursos que participa ou pretende participar.

---

## 🚀 Como Usar

### 1️⃣ Acessar a Página

```
http://localhost:3000/concursos
(ou clique em "Concursos" no menu do dashboard)
```

### 2️⃣ Adicionar Novo Concurso

1. Clique no botão **"+ Adicionar"** no canto superior direito
2. Preencha:
   - **Nome do Concurso** (ex: "INSS 2024", "Polícia Federal 2025")
   - **Número de Inscrição** (ex: "123456789")
3. Clique **"Adicionar"**

### 3️⃣ Visualizar Concursos

Cada concurso aparece em um card com:
- ✅ **Nome do concurso**
- 📋 **Número de inscrição**
- 🔔 **Status**: "Concurso ainda sem dados" ou "Informações do Concurso"
- 📅 **Data de adição**
- ❌ **Botão para remover** (canto superior direito do card)

### 4️⃣ Status dos Concursos

#### 🟡 "Concurso ainda sem dados"
- Significa que o concurso foi adicionado mas ainda não encontrou informações no banco de dados
- Aparece com fundo amarelo
- O sistema está buscando informações

#### 🟢 "Informações do Concurso"
- Significa que o concurso foi encontrado no banco de dados
- Mostra informações como:
  - Órgão
  - Cargo
  - Data da Prova
  - Status da candidatura

---

## 🗂️ Estrutura de Dados (Firestore)

### Coleção: `users/{userId}/concursos/{concursoId}`

```json
{
  "nomeConcurso": "INSS 2024",
  "numeroInscricao": "123456789",
  "status": "sem_dados" | "com_dados",
  "dataCriacao": "2025-01-30T10:30:00.000Z",
  "dadosConcurso": {
    "orgao": "Instituto Nacional do Seguro Social",
    "cargo": "Técnico em Seguro Social",
    "dataProva": "15/03/2025",
    "status": "Inscrição confirmada"
  }
}
```

---

## 💻 Arquivos Criados

### Componentes
- **`components/ConcursosList.tsx`** - Lista de concursos com cards
- **`components/AddConcursoModal.tsx`** - Modal para adicionar novo concurso

### Hooks
- **`lib/use-concursos.ts`** - Hook com lógica de CRUD dos concursos

### Páginas
- **`app/concursos/page.tsx`** - Página principal de concursos

### Atualizações
- **`app/dashboard/page.tsx`** - Adicionado menu e link para concursos

---

## 🔧 Funcionalidades Técnicas

### Operações Disponíveis

```typescript
// Hook: useConcursos()

// Adicionar concurso
await adicionarConcurso(nomeConcurso, numeroInscricao)

// Deletar concurso
await deletarConcurso(concursoId)

// Atualizar status do concurso (quando encontra dados)
await atualizarStatusConcurso(concursoId, dados)

// Listar todos os concursos do usuário
concursos // array de concursos
```

---

## 📝 Exemplos de Teste

### Registre com:
- **CPF**: `123.456.789-09`
- **Email**: `seu_email@example.com`
- **Senha**: `senha123`

### Depois adicione concursos como:
- **Nome**: "INSS 2024"
- **Inscrição**: "123456789"

---

## 🔄 Próximos Passos (Opcional)

Você pode expandir essa funcionalidade adicionando:

1. **Busca de dados reais** - Integrar com API de concursos
2. **Editar concurso** - Formulário para atualizar informações
3. **Filtros** - Filtrar por status, órgão, etc
4. **Buscador** - Pesquisar concursos por nome
5. **Relatórios** - Ver quantos concursos está participando
6. **Calendário** - Datas das provas em um calendário
7. **Notificações** - Avisos sobre datas importantes

---

## 🧪 Testes Manual

1. **Adicionar 3 concursos diferentes**
2. **Remover um deles**
3. **Atualizar a página** - Dados devem persistir
4. **Fazer logout e login novamente** - Concursos devem aparecer
5. **Abrir no Firebase Console** e verificar dados em `users/{userId}/concursos`

---

## ⚠️ Notas Importantes

- Os concursos são salvos por usuário (cada usuário vê apenas seus concursos)
- Os dados são salvos em tempo real no Firebase
- Deletar um concurso é irreversível
- O status "sem_dados" é temporário enquanto você não configura a busca de dados

---

## 📚 Arquivo de Referência

Estrutura da página:

```
/concursos
├── Navbar (Dashboard | Concursos)
├── Header (Meus Concursos | + Adicionar)
├── Lista de Concursos
│   ├── Card 1
│   │   ├── Nome
│   │   ├── Inscrição
│   │   ├── Status
│   │   └── Botão deletar
│   ├── Card 2
│   └── Card 3
└── Modal (Adicionar novo concurso)
    ├── Nome do Concurso
    ├── Número de Inscrição
    └── Botões (Cancelar | Adicionar)
```

---

**Tudo pronto! A página de concursos está funcional.** ✨

Quando precisar de ajuda com expansões, é só chamar!
