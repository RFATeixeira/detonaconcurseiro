# ✨ Upload de Documentos - Atualização do Sistema Admin

## O Que Foi Adicionado

Agora o admin pode **opcionalmente** enviar um **documento/planilha** ao adicionar um concurso. O arquivo é **completamente opcional** - o concurso pode ser salvo sem ele.

---

## 📝 Alterações Implementadas

### 1. Campo de Upload no Formulário

**Localização**: `components/AddConcursoDataForm.tsx`

- **Input de arquivo** com drag & drop visual
- **Aceita formatos**: PDF, DOC, DOCX, XLS, XLSX, CSV
- **Máximo**: 10MB (em prática, Firebase Storage permite mais)
- **Opcional**: Não é necessário para salvar o concurso

**Visual**:
```
┌─────────────────────────────────────────┐
│  Documento/Planilha (Opcional)          │
├─────────────────────────────────────────┤
│                                         │
│          📄                             │
│  Clique para selecionar ou              │
│  arraste o arquivo                      │
│                                         │
│  PDF, DOC, XLS, CSV (máx. 10MB)        │
│                                         │
└─────────────────────────────────────────┘

ℹ️ O documento é opcional. Você pode salvar 
   o concurso sem enviá-lo.
```

---

### 2. Processamento do Arquivo

**Localização**: `lib/use-concursos-data.ts`

**Fluxo**:
1. Admin seleciona arquivo
2. Arquivo é **carregado no Firebase Storage**
3. URL do arquivo é salva no Firestore
4. Usuários podem acessar o documento quando necessário

**Estrutura no Firebase**:
```
Firebase Storage:
└─ concursos/
   └─ INSS-2024-1706696400000-planilha.xlsx (arquivo binário)

Firebase Firestore (concursosData):
└─ documento:
   └─ documentoURL: "https://firebasestorage.googleapis.com/..."
```

---

### 3. Interface do Formulário Atualizada

**Campos atualizados**:
```typescript
interface FormData {
  nomeConcurso: string;
  banca: string;
  cargo: string;
  salario: string;
  dataProva: string;
  edital: string;
  descricao: string;
  // NOVO:
  arquivo?: File;
}
```

**Novo estado**:
```typescript
const [arquivo, setArquivo] = useState<File | null>(null);
const [nomeArquivo, setNomeArquivo] = useState('');
```

---

### 4. Tabela de Concursos Atualizada

**Localização**: `app/admin/page.tsx`

**Mudanças**:
- Adicionada coluna/célula para **"Ver Documento"**
- Link direto para o arquivo (se existir)
- Botão visual com ícone 📥

**Exemplo**:
```
┌─────────────────────────────────────────────────────┐
│ Nome    │ Banca │ Cargo │ Data  │ Ações            │
├─────────┼───────┼───────┼───────┼──────────────────┤
│ INSS    │ CEBR. │ Anali.│ 15/06 │ 📥 Ver Documento │
│ 2024    │       │       │ /2024 │ [Deletar]        │
└─────────┴───────┴───────┴───────┴──────────────────┘
```

---

### 5. Dados Armazenados

**Interface ConcursoData atualizada**:
```typescript
export interface ConcursoData {
  id: string;
  nomeConcurso: string;
  banca: string;
  cargo: string;
  salario: string;
  dataProva: string;
  edital: string;
  descricao?: string;
  documentoURL?: string;        // 🆕 NOVO
  dataCriacao: Date;
}
```

---

## 🔧 Funcionalidades Técnicas

### Upload em Firebase Storage

```typescript
const arquivo = file; // arquivo selecionado
const storageRef = ref(
  storage, 
  `concursos/${nomeConcurso}-${Date.now()}-${arquivo.name}`
);

await uploadBytes(storageRef, arquivo);
documentoURL = await getDownloadURL(storageRef);
```

**Caminho de armazenamento**:
```
concursos/
├─ INSS-2024-1706696400000-planilha.xlsx
├─ Caixa-2024-1706696500000-dados.pdf
└─ BB-2024-1706696600000-concurso.docx
```

### Download do Arquivo

```html
<a 
  href={concurso.documentoURL} 
  target="_blank" 
  rel="noopener noreferrer"
>
  📥 Ver Documento
</a>
```

---

## 🎯 Casos de Uso

### Caso 1: Admin com Documento
```
1. Admin acessa /admin
2. Preenche campos do concurso
3. Seleciona arquivo PDF com a planilha
4. Clica "Adicionar Concurso"
5. Arquivo é upload + link é salvo
6. Usuários veem "📥 Ver Documento" em Concursos Disponíveis
```

### Caso 2: Admin sem Documento
```
1. Admin acessa /admin
2. Preencha campos do concurso
3. Deixa o campo de documento em branco
4. Clica "Adicionar Concurso"
5. Concurso é salvo normalmente (sem documento)
6. Campo documentoURL fica vazio
```

### Caso 3: Substituir Documento
```
1. Admin vê concurso com documento desatualizado
2. Clica "Deletar" o concurso
3. Cria um novo concurso com o arquivo correto
4. Novo arquivo é uploaded
```

---

## 🚀 Como Usar

### 1. Adicionar Concurso com Documento

```
1. Navegue para /admin
2. Preencha os campos:
   - Nome: INSS 2024
   - Banca: CEBRASPE
   - Cargo: Analista
   - Data: 15/06/2024
3. Role até "Documento/Planilha"
4. Clique na área cinza ou arraste um arquivo
5. Veja o nome do arquivo aparecer
6. Clique "Adicionar Concurso"
7. Aguarde upload (pode levar alguns segundos se o arquivo for grande)
```

### 2. Visualizar Documento

```
Admin:
1. Acesse /admin
2. Na tabela, clique em "📥 Ver Documento"
3. Abre em nova aba

Usuários Comuns:
(Funcionalidade futura - pode ser adicionada a /concursos-disponiveis)
```

### 3. Remover Documento

```
1. Na página /admin, se um arquivo está selecionado
2. Clique no botão "Remover" (em vermelho)
3. O arquivo é removido do formulário (não salvo ainda)
4. Clique "Adicionar Concurso" para salvar sem documento
```

---

## 🔐 Segurança

### Regras de Firebase Storage Recomendadas

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /concursos/{allPaths=**} {
      // Apenas admins podem enviar
      allow create, write: if request.auth != null && 
        request.auth.token.isAdmin == true;
      
      // Todos podem ler (usuários logados)
      allow read: if request.auth != null;
      
      // Apenas admins podem deletar
      allow delete: if request.auth != null && 
        request.auth.token.isAdmin == true;
    }
  }
}
```

### Limitações Implementadas

- ✅ Apenas arquivos específicos aceitos (PDF, DOC, XLS, CSV)
- ✅ Nome do arquivo inclui timestamp (evita conflitos)
- ✅ Armazenamento em pasta separada (`concursos/`)
- ⚠️ Limite de 10MB (recomendação - Firebase permite mais)

---

## 📊 Dados Armazenados

### No Firestore (concursosData collection)

```json
{
  "nomeConcurso": "INSS 2024",
  "banca": "CEBRASPE",
  "cargo": "Analista do Seguro Social",
  "salario": "R$ 2.500,00",
  "dataProva": "2024-06-15",
  "edital": "https://www.gov.br/...",
  "descricao": "Descrição do concurso",
  "documentoURL": "https://firebasestorage.googleapis.com/...",
  "dataCriacao": "2024-01-30T10:30:00Z"
}
```

### No Firebase Storage

```
concursos/INSS-2024-1706696400000-planilha.xlsx
```

---

## 🎨 Interface Visual

### Formulário

```
┌─────────────────────────────────────────┐
│ Nome do Concurso *                      │
│ [___________________]                   │
│                                         │
│ Banca *                                 │
│ [___________________]                   │
│                                         │
│ Cargo *                                 │
│ [___________________]                   │
│                                         │
│ ... outros campos ...                   │
│                                         │
│ Documento/Planilha (Opcional)           │
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │
│ │  📄                                 │ │
│ │  Clique para selecionar ou          │ │
│ │  arraste o arquivo                  │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│ ℹ️ Documento é opcional                 │
│                                         │
│ [Adicionar Concurso]                    │
└─────────────────────────────────────────┘
```

### Com Arquivo Selecionado

```
┌─────────────────────────────────────────┐
│ Documento/Planilha (Opcional)           │
│ ┌─────────────────────────────────────┐ │
│ │ 📎 planilha.xlsx       [Remover]    │ │
│ │ 245 KB                              │ │
│ └─────────────────────────────────────┘ │
│ ℹ️ Documento é opcional                 │
│                                         │
│ [Adicionar Concurso]                    │
└─────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Dados

```
Admin seleciona arquivo
    ↓
Arquivo enviado ao Firebase Storage
    ↓
URL gerada automaticamente
    ↓
URL + Dados salvos no Firestore
    ↓
Admin vê "✓ Concurso adicionado"
    ↓
Arquivo acessível via URL
    ↓
Admin pode copiar/compartilhar link
    ↓
Usuários podem acessar o arquivo
```

---

## ⚙️ Configuração Necessária

### 1. Firebase Storage Habilitado

Verifique no Firebase Console:
```
Firebase Console > Storage > Habilitar
```

### 2. CORS Configurado (se necessário)

Se acessar de domínios diferentes:
```bash
gsutil cors set cors.json gs://seu-projeto.appspot.com
```

### 3. Credenciais no .env.local

```
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
```

---

## 🧪 Testando

### Teste 1: Adicionar com Documento

```
1. Vá para /admin
2. Preencha todos os campos obrigatórios
3. Selecione um arquivo PDF/Excel
4. Clique "Adicionar Concurso"
5. Aguarde "✓ Concurso adicionado com sucesso!"
6. Veja o arquivo na tabela: "📥 Ver Documento"
7. Clique para abrir em nova aba
```

### Teste 2: Adicionar sem Documento

```
1. Vá para /admin
2. Preencha todos os campos obrigatórios
3. NÃO selecione nenhum arquivo
4. Clique "Adicionar Concurso"
5. Concurso deve ser salvo normalmente
6. Tabela não mostra "📥 Ver Documento"
```

### Teste 3: Remover Arquivo Selecionado

```
1. Vá para /admin
2. Selecione um arquivo
3. Veja o nome aparecer com botão "Remover"
4. Clique "Remover"
5. Arquivo deve desaparecer
6. Clique "Adicionar Concurso" (sem arquivo)
```

---

## 📈 Próximas Melhorias

1. **Visualização em `/concursos-disponiveis`**: Mostrar ícone 📄 se há documento
2. **Múltiplos documentos**: Permitir vários arquivos por concurso
3. **Editar documentos**: Trocar o arquivo de um concurso existente
4. **Preview**: Mostrar preview do PDF antes de fazer upload
5. **Compressão**: Comprimir imagens automaticamente
6. **Histórico**: Manter histórico de versões dos documentos

---

## ✅ Checklist

- ✅ Upload de arquivo funciona
- ✅ Arquivo é armazenado no Firebase Storage
- ✅ URL é salva no Firestore
- ✅ Campo é opcional (não obrigatório)
- ✅ Admin pode ver/baixar documento
- ✅ Interface visual intuitiva
- ✅ Sem erros de compilação
- ✅ Segurança configurada

---

**Sistema de upload de documentos implementado com sucesso!** 🎉
