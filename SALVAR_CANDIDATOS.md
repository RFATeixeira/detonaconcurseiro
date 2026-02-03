# 💾 Salvamento de Candidatos no Firestore

## Visão Geral

O sistema agora permite salvar candidatos importados de planilhas Excel diretamente no Firestore, organizados em sub-coleções dentro de cada concurso.

## Arquitetura

### Hook: `useSalvarCandidatos`

**Localização:** `lib/use-salvar-candidatos.ts`

**Responsabilidades:**
- Salvar candidatos no Firestore
- Obter candidatos de um concurso
- Deletar candidatos de um concurso
- Gerenciar loading e errors

### Estrutura de Dados no Firestore

```
Firestore Database
├── concursosData (collection)
│   ├── {concursoId} (document)
│   │   ├── nomeConcurso: "PMPR 2025"
│   │   ├── banca: "Unioeste"
│   │   └── candidatos (subcollection)
│   │       ├── {candidatoId}
│   │       │   ├── inscricao: "12345"
│   │       │   ├── nomeCandidato: "João Silva"
│   │       │   ├── regiao: "Norte"
│   │       │   ├── notaObjetiva: 75.5
│   │       │   ├── notaDiscursiva: 80.0
│   │       │   ├── notaTotalAntesTAF: 155.5
│   │       │   ├── resultadoTAF: "Aprovado"
│   │       │   ├── notaFinalPosTAF: 160.0
│   │       │   ├── novaClassificacao: 1
│   │       │   └── dataCriacao: Timestamp
│   │       └── {candidatoId2}
│   │           └── ...
│   └── {concursoId2}
│       └── ...
```

## Como Usar

### 1. Importar e Usar o Hook

```typescript
import { useSalvarCandidatos } from '@/lib/use-salvar-candidatos';
import { CandidatoData } from '@/lib/use-import-excel';

export default function MeuComponente() {
  const { loading, error, salvarCandidatos, obterCandidatos, deletarCandidatos } = useSalvarCandidatos();
```

### 2. Salvar Candidatos

```typescript
const handleSalvar = async () => {
  try {
    const mensagem = await salvarCandidatos('PMPR 2025', candidatos);
    console.log(mensagem); // "✓ 250 candidato(s) salvo(s) com sucesso!"
  } catch (err) {
    console.error('Erro:', err);
  }
};
```

### 3. Obter Candidatos de um Concurso

```typescript
const handleCarregar = async () => {
  const candidatos = await obterCandidatos('PMPR 2025');
  console.log(`Carregados ${candidatos.length} candidatos`);
};
```

### 4. Deletar Candidatos de um Concurso

```typescript
const handleDeletar = async () => {
  await deletarCandidatos('PMPR 2025');
  console.log('Candidatos deletados');
};
```

## Integração com ImportarPlanilha

O componente `ImportarPlanilha` já está integrado com o hook:

1. **Upload**: Seleciona arquivo Excel
2. **Preview**: Mostra 10 primeiros candidatos
3. **Validação**: Verifica se o concurso existe
4. **Salvamento**: Click em "✓ Salvar Candidatos no Banco de Dados"
5. **Feedback**: Mostra mensagem de sucesso ou erro
6. **Reset**: Retorna ao modo de upload automaticamente

### Props

```typescript
interface ImportarPlanilhaProps {
  nomeConcurso: string;        // Nome do concurso destino
  onSuccess?: () => void;      // Callback executado após sucesso
}
```

### Exemplo de Uso

```typescript
import ImportarPlanilha from '@/components/ImportarPlanilha';

export default function AdminPage() {
  const handleSalvoSucesso = () => {
    console.log('Candidatos salvos!');
    // Atualizar lista, etc
  };

  return (
    <ImportarPlanilha 
      nomeConcurso="PMPR 2025" 
      onSuccess={handleSalvoSucesso}
    />
  );
}
```

## Fluxo Completo

```
User seleciona arquivo Excel
    ↓
Sistema lê planilha com XLSX
    ↓
Mostra preview de 10 candidatos
    ↓
User clica "Salvar Candidatos"
    ↓
Hook busca o concurso por nome
    ↓
Cria subcollection "candidatos"
    ↓
Batch writes todos os registros
    ↓
Retorna "X candidatos salvos"
    ↓
UI reseta para upload
```

## Tratamento de Erros

### Erros Comuns

| Erro | Causa | Solução |
|------|-------|---------|
| `Nenhum candidato para salvar` | Array vazio | Importe primeiro |
| `Concurso "X" não encontrado` | Nome incorreto | Verifique nome exato |
| `Erro ao salvar candidatos` | Problema Firestore | Verifique conexão |

### Estados do Hook

```typescript
const { loading, error, salvarCandidatos } = useSalvarCandidatos();

// loading === true: Enviando para Firestore
// error !== null: Houve erro
// message: Retorna string de sucesso
```

## Performance

### Otimizações

1. **Batch Writes**: Usa `writeBatch()` para salvar múltiplos documentos de uma vez
   - Máximo de 500 operações por batch (Firestore limit)
   - Apenas 1 batch write para até 500 candidatos

2. **Índices do Firestore**:
   - `nomeConcurso` indexado para busca rápida
   - Subcollections para organizar dados

3. **Timestamps**:
   - Usa `Timestamp.now()` do Firestore
   - Permite ordenação por data de criação

### Limitações

- Máximo 500 candidatos por batch
- Para > 500: Implementar batch múltiplos
- Sem duplicação automática (validar antes)

## Campos Salvos

Cada candidato armazena:

```typescript
interface CandidatoData {
  inscricao: string;              // ID de inscrição
  nomeCandidato: string;          // Nome completo
  regiao: string;                 // Região de lotação
  notaObjetiva: number;           // Nota da prova objetiva
  notaDiscursiva: number;         // Nota da prova discursiva
  notaTotalAntesTAF: number;      // Total antes do TAF
  resultadoTAF: string;           // "Aprovado" ou "Reprovado"
  notaFinalPosTAF: number;        // Nota final após TAF
  novaClassificacao: number;      // Posição no ranking
  dataCriacao: Timestamp;         // Data de import (Firestore)
}
```

## Próximas Melhorias

- [ ] Validação de duplicatas (inscrição já existe)
- [ ] Atualizar candidatos existentes (merge)
- [ ] Importação segmentada para > 500 registros
- [ ] Export de candidatos (Excel, PDF)
- [ ] Histórico de importações
- [ ] Verificação de integridade de dados

## Debugging

### Verificar dados no Firestore

1. Abrir [Firebase Console](https://console.firebase.google.com)
2. Ir para `Firestore Database`
3. Expandir `concursosData` → `{concursoId}` → `candidatos`
4. Verificar documentos salvos

### Logs no Navegador

```typescript
const { salvarCandidatos } = useSalvarCandidatos();

const handleSalvar = async () => {
  console.log('Iniciando salvamento...');
  const msg = await salvarCandidatos('PMPR 2025', candidatos);
  console.log('Resultado:', msg);
};
```

## Segurança

### Firestore Rules Recomendadas

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admins podem ler/escrever candidatos
    match /concursosData/{concursoId}/candidatos/{candidatoId} {
      allow read, write: if request.auth.uid != null && 
                            get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

## Referências

- **Hook:** [lib/use-salvar-candidatos.ts](lib/use-salvar-candidatos.ts)
- **Componente:** [components/ImportarPlanilha.tsx](components/ImportarPlanilha.tsx)
- **Tipo:** [lib/use-import-excel.ts](lib/use-import-excel.ts)
