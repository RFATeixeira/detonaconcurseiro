# ✨ Upload de Documentos - Resumo Rápido

## O Que Mudou?

Agora o admin pode **opcionalmente** enviar uma **planilha/documento** ao adicionar um concurso.

---

## 🎯 Como Usar

### Adicionar Concurso com Documento

```
1. Acesse /admin
2. Preencha campos do concurso
3. Role até "Documento/Planilha"
4. Clique ou arraste um arquivo
5. Clique "Adicionar Concurso"
```

### Formatos Aceitos

- PDF
- DOC / DOCX
- XLS / XLSX
- CSV

---

## 📊 Onde os Arquivos Ficam

**Firebase Storage**: `concursos/nome-arquivo.pdf`
**Firestore**: Campo `documentoURL` com link do arquivo

---

## 👁️ Visualizar Documento

Na tabela de `/admin`, clique em **"📥 Ver Documento"** para abrir em nova aba.

---

## ✅ É Obrigatório?

**NÃO!** Você pode:
- ✅ Adicionar concurso **com** documento
- ✅ Adicionar concurso **sem** documento
- ✅ Remover documento selecionado antes de salvar

---

## 🔧 Arquivos Modificados

| Arquivo | Mudança |
|---------|---------|
| `components/AddConcursoDataForm.tsx` | Input de upload + lógica |
| `lib/use-concursos-data.ts` | Upload em Firebase Storage |
| `lib/firebase.ts` | Exporta `storage` |
| `app/admin/page.tsx` | Link para visualizar documento |

---

## 📚 Documentação Completa

Consulte: [`UPLOAD_DOCUMENTOS.md`](./UPLOAD_DOCUMENTOS.md)

---

**Pronto para usar!** 🚀
