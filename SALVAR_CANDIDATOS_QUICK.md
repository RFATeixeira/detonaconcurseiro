# ⚡ Guia Rápido: Salvar Candidatos

## Em 30 Segundos

1. **Admin vai para** `http://localhost:3000/admin`
2. **Seleciona arquivo Excel** (PMPR2025.xlsx)
3. **Clica "Importar e Visualizar"** → mostra preview
4. **Clica "✓ Salvar Candidatos"** → salva no Firestore
5. **Mensagem de sucesso**: "✓ X candidato(s) salvo(s)!"

## Estrutura de Dados

Os candidatos são salvos em:
```
Firestore:
  concursosData/
    {concursoId}/candidatos/
      {candidatoId} → { inscricao, nomeCandidato, regiao, notas... }
```

## Campos Importados

| Campo | Tipo | Exemplo |
|-------|------|---------|
| inscricao | string | "2025001" |
| nomeCandidato | string | "João Silva" |
| regiao | string | "Norte" |
| notaObjetiva | number | 75.5 |
| notaDiscursiva | number | 80.0 |
| notaTotalAntesTAF | number | 155.5 |
| resultadoTAF | string | "Aprovado" |
| notaFinalPosTAF | number | 160.0 |
| novaClassificacao | number | 1 |

## Uso Programático

```typescript
import { useSalvarCandidatos } from '@/lib/use-salvar-candidatos';

const { loading, error, salvarCandidatos } = useSalvarCandidatos();

// Salvar
const msg = await salvarCandidatos('PMPR 2025', candidatos);

// Obter
const candidatos = await obterCandidatos('PMPR 2025');

// Deletar
await deletarCandidatos('PMPR 2025');
```

## Erros Comuns

❌ **"Concurso não encontrado"**  
→ Verifique se o concurso `nomeConcurso` existe

❌ **"Nenhum candidato para salvar"**  
→ Importe o arquivo Excel primeiro

## Próximos Passos

- Visualizar candidatos em página dedicada
- Filtrar/buscar candidatos por nome ou inscrição
- Editar dados de candidatos
- Exportar candidatos para Excel

## Arquivos Modificados

✅ `lib/use-salvar-candidatos.ts` - Novo hook
✅ `components/ImportarPlanilha.tsx` - Integrado com salvamento
✅ `lib/use-import-excel.ts` - Sem mudanças (já tem limparDados)
