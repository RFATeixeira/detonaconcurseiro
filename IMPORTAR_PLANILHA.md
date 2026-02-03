# 📊 Importar Planilha de Candidatos - Guia Rápido

## O Que Foi Adicionado

Um novo componente na página `/admin` que permite **importar uma planilha Excel com dados de candidatos** (resultados de concurso).

---

## 🎯 Como Usar

### 1. Acessar Página Admin
```
Navegue para: http://localhost:3000/admin
(Apenas admins têm acesso)
```

### 2. Seção "Importar Planilha de Candidatos"
```
Você verá a seção:
📊 Clique para selecionar ou arraste a planilha
Formatos aceitos: Excel (.xlsx, .xls), CSV
```

### 3. Selecionar Arquivo
- **Clique** na área ou **arraste** o arquivo Excel
- Aceita: `.xlsx`, `.xls`, `.csv`
- Máximo: Sem limite específico (Excel geralmente até 1 milhão de linhas)

### 4. Importar e Visualizar
- Clique em **"Importar e Visualizar"**
- Sistema lê o arquivo e mostra um preview
- Mostra os **primeiros 10 candidatos** com dados formatados

### 5. Salvar Candidatos
- Revise os dados no preview
- Clique em **"✓ Salvar Candidatos no Banco de Dados"**
- Dados são armazenados no Firestore

---

## 📋 Estrutura Esperada da Planilha

A planilha deve ter as seguintes colunas (em qualquer ordem):

| Coluna | Tipo | Exemplo |
|--------|------|---------|
| **Inscrição** | Texto/Número | 12345 |
| **Nome do Candidato** | Texto | João da Silva |
| **Região** | Texto | São Paulo |
| **Nota Objetiva** | Número | 75.5 |
| **Nota Discursiva** | Número | 68.0 |
| **Nota Total (Antes TAF)** | Número | 143.5 |
| **Resultado TAF** | Texto | Aprovado/Reprovado |
| **Nota Final Pós TAF** | Número | 155.0 |
| **Nova Classificação** | Número | 42 |

---

## 📸 Visual do Componente

### Seção de Upload

```
┌────────────────────────────────────────────┐
│ Importar Planilha de Candidatos - Teste    │
├────────────────────────────────────────────┤
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │                                      │  │
│  │           📊                         │  │
│  │  Clique para selecionar ou           │  │
│  │  arraste a planilha                  │  │
│  │                                      │  │
│  │  Formatos: Excel (.xlsx, .xls), CSV  │  │
│  │                                      │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  [Importar e Visualizar]                   │
└────────────────────────────────────────────┘
```

### Seção de Preview

```
┌────────────────────────────────────────────┐
│ Preview - 45 candidato(s) importado(s)    │
│                           [← Voltar]       │
├────────────────────────────────────────────┤
│                                            │
│ Inscrição │ Nome │ Região │ Obj │ Dis │.. │
├───────────┼──────┼────────┼─────┼─────┼...│
│ 12345     │ João │ SP     │75.5 │68.0 │.. │
│ 12346     │ Maria│ RJ     │82.0 │71.5 │.. │
│ ...       │ ...  │ ...    │ ... │ ... │.. │
└────────────────────────────────────────────┘

[✓ Salvar Candidatos no Banco de Dados]
```

---

## 🔧 Funcionalidades Técnicas

### Hook: `useImportExcel()`

```typescript
const {
  candidatos,       // Array de candidatos importados
  loading,          // Está processando?
  error,            // Mensagem de erro (se houver)
  importarPlanilha, // Função para ler arquivo
  limparDados       // Função para limpar tudo
} = useImportExcel();
```

### Componente: `ImportarPlanilha`

**Props**:
```typescript
interface ImportarPlanilhaProps {
  nomeConcurso: string;    // Nome do concurso (exibido no título)
  onSuccess?: () => void;  // Callback após salvar com sucesso
}
```

**Uso**:
```tsx
<ImportarPlanilha 
  nomeConcurso="INSS 2024" 
  onSuccess={() => alert('Candidatos salvos!')}
/>
```

---

## 📊 Processamento de Dados

### Fluxo de Leitura

```
Arquivo Excel
    ↓
XLSX.read() lê o arquivo
    ↓
sheet_to_json() converte para array
    ↓
Mapeia colunas para interface CandidatoData
    ↓
Valida e formata números
    ↓
Array de candidatos
```

### Interface CandidatoData

```typescript
interface CandidatoData {
  inscricao: string;
  nomeCandidato: string;
  regiao: string;
  notaObjetiva: number;
  notaDiscursiva: number;
  notaTotalAntesTAF: number;
  resultadoTAF: string;
  notaFinalPosTAF: number;
  novaClassificacao: number;
}
```

---

## 🎨 Características Visuais

### Preview da Planilha

- ✅ **Tabela formatada** com colunas alinhadas
- ✅ **Cores visuais** para resultado TAF:
  - 🟢 Verde: "Aprovado"
  - 🔴 Vermelho: "Reprovado"
  - ⚪ Cinza: Outro
- ✅ **Mostra primeiros 10 registros** + contador total
- ✅ **Números formatados** com 2 casas decimais
- ✅ **Números de classificação** com símbolo º

### Estados

- 📤 **Upload**: Aguardando arquivo
- 📊 **Preview**: Mostrando dados importados
- ⚠️ **Erro**: Mensagem clara de erro
- ⏳ **Loading**: Indicador enquanto processa

---

## ✨ Recursos Inclusos

- ✅ Leitura de Excel (.xlsx, .xls)
- ✅ Suporte a CSV (padrão)
- ✅ Suporte a nomes de coluna flexíveis
- ✅ Conversão automática de tipos (string → number)
- ✅ Preview com formatação visual
- ✅ Removedor de arquivo selecionado
- ✅ Mensagens de sucesso/erro
- ✅ Responsividade completa

---

## 🧪 Testando

### Teste 1: Importar Planilha Simples

```
1. Acesse /admin
2. Vá para "Importar Planilha de Candidatos"
3. Selecione PMPR2025.xlsx
4. Clique "Importar e Visualizar"
5. Veja o preview com os dados
6. Clique "✓ Salvar Candidatos"
```

### Teste 2: Visualizar Dados

```
1. Na seção preview, verifique:
   ✓ Nomes dos candidatos aparecem
   ✓ Notas estão formatadas (2 casas decimais)
   ✓ TAF mostra cor apropriada
   ✓ Classificação mostra com º
   ✓ Mostra contador total
```

### Teste 3: Erro de Arquivo

```
1. Selecione arquivo com formato errado (ex: .txt)
2. Veja mensagem de erro clara
3. Clique "Remover"
4. Selecione arquivo correto
```

---

## 🔮 Próximas Melhorias

1. **Salvar no Firestore**: Implementar botão "✓ Salvar" para armazenar dados
2. **Associar ao Concurso**: Vincular candidatos ao concurso específico
3. **Editar Dados**: Permitir editar dados antes de salvar
4. **Validação Avançada**: Checker de duplicatas de inscrição
5. **Histórico**: Manter histórico de importações
6. **Exportar**: Exportar candidatos em Excel
7. **Filtros**: Filtrar candidatos por região, resultado TAF, etc
8. **Busca**: Buscar candidatos por inscrição ou nome

---

## 📁 Arquivos Criados/Atualizados

### Criados
- ✅ `lib/use-import-excel.ts` - Hook para processar Excel
- ✅ `components/ImportarPlanilha.tsx` - Componente visual
- ✅ `IMPORTAR_PLANILHA.md` - Este arquivo

### Atualizados
- ✅ `app/admin/page.tsx` - Adicionado componente

### Dependências
- ✅ `xlsx` - Biblioteca para ler Excel (instalada)

---

## ✅ Checklist

- ✅ Componente importador criado
- ✅ Hook para processar Excel criado
- ✅ Interface `CandidatoData` definida
- ✅ Preview visual implementado
- ✅ Integrado em `/admin`
- ✅ Sem erros de compilação
- ✅ Responsivo
- ✅ Documentado

---

## 🎉 Pronto para Testar!

Acesse http://localhost:3000/admin e procure por **"Importar Planilha de Candidatos"**!

Use o arquivo **PMPR2025.xlsx** para testar a funcionalidade.
