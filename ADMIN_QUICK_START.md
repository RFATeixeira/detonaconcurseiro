# 🚀 Guia Rápido - Sistema Admin

## O que foi criado?

Um sistema completo de gerenciamento de concursos com três níveis de acesso:

1. **Usuário Comum**: Pode buscar e adicionar concursos aos favoritos
2. **Usuário Admin**: Pode adicionar dados de concursos à plataforma
3. **Visitante**: Vê apenas a página de home

## 🔧 Setup Rápido

### Passo 1: Marcar um Usuário como Admin

1. Faça login na aplicação com uma conta de teste
2. Copie seu UID (abra console: F12 > Execute `console.log(auth.currentUser.uid)`)
3. Vá para [Firebase Console](https://console.firebase.google.com)
4. Selecione seu projeto
5. **Firestore Database** → **users** → Encontre seu UID
6. Clique no documento e **Edite**
7. Adicione um novo campo:
   - Nome: `isAdmin`
   - Tipo: Boolean
   - Valor: `true`
8. Salve (ícone ✓)

**Pronto!** Você agora é admin. Recarregue a página para ver as mudanças.

## 📖 Guia de Uso

### Para Admins

#### Adicionar um Concurso:
1. Faça login como admin
2. Clique em **Admin** na navbar
3. Preencha o formulário:
   - **Nome do Concurso** ⭐ (obrigatório)
   - **Banca** ⭐ (ex: CEBRASPE)
   - **Cargo** ⭐ (ex: Analista)
   - **Data da Prova** ⭐
   - **Salário** (opcional)
   - **Edital** - URL do edital (opcional)
   - **Descrição** (opcional)
4. Clique em **Adicionar Concurso**

#### Gerenciar Concursos:
- Veja a tabela de concursos cadastrados
- Clique em **Deletar** para remover um concurso
- Os concursos deletados desaparecem de **Concursos Disponíveis**

### Para Usuários Comuns

#### Explorar Concursos:
1. Faça login
2. Clique em **Concursos Disponíveis** na navbar
3. Use **Busca** para encontrar por nome ou cargo
4. Use **Filtro por Banca** para refinar a busca
5. Clique em **Ver Edital →** para acessar o edital

#### Adicionar aos Meus Concursos:
1. Na página **Concursos Disponíveis**
2. Clique em **Adicionar aos Meus** no card do concurso
3. Acesse **Meus Concursos** para gerenciar sua lista

## 📊 Estrutura de Páginas

```
/dashboard
├── Meus Concursos → /meus-concursos
├── Concursos Disponíveis → /concursos-disponiveis
└── Admin (só para admins) → /admin
```

## 🗄️ Dados no Firebase

### Coleção: `concursosData`
- Todos os concursos da plataforma
- Preenchidos por admins
- Acessível por todos os usuários

### Coleção: `users/{uid}/concursos`
- Concursos adicionados por cada usuário
- Privado para cada usuário
- Vinculado por nome do concurso

## ⚡ Comandos Úteis

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Abrir no navegador
http://localhost:3000
```

## 🔍 Testando

### Testar como Admin:
1. Crie uma conta (ex: admin@test.com)
2. Marque como admin no Firebase
3. Acesse `/admin`
4. Adicione um concurso teste

### Testar como Usuário:
1. Crie outra conta (ex: user@test.com)
2. Acesse `/concursos-disponiveis`
3. Busque o concurso que o admin adicionou
4. Clique em "Adicionar aos Meus"
5. Acesse `/meus-concursos` para confirmar

## 🆘 Problemas Comuns

### "Acesso negado" em /admin?
- Você não é admin
- Solução: Marque seu usuário como admin no Firebase (veja Passo 1)

### Concursos não aparecem em "Concursos Disponíveis"?
- Nenhum concurso foi adicionado ainda
- Solução: Acesse `/admin` e adicione um concurso

### Botão "Adicionar aos Meus" não funciona?
- Você não está logado
- Solução: Faça login primeiro

## 📚 Documentação Completa

- [SISTEMA_ADMIN_README.md](./SISTEMA_ADMIN_README.md) - Documentação técnica
- [ADMIN_SYSTEM_SUMMARY.md](./ADMIN_SYSTEM_SUMMARY.md) - Resumo das mudanças
- [lib/ADMIN_SETUP.md](./lib/ADMIN_SETUP.md) - Como configurar admin

## 💡 Dicas

1. **Usar dados reais**: Adicione concursos com dados reais para testar
2. **Testar com 2 usuários**: Abra uma aba privada/anônima para testar como usuário diferente
3. **Usar dados de exemplo**: INSS, Caixa, BB, Correios, etc.
4. **Observar Firestore**: Veja em tempo real os dados sendo salvos

## 🎉 Pronto!

Você tem um sistema completo de gerenciamento de concursos. Comece a adicionar dados e testando!

Qualquer dúvida, consulte a documentação nos arquivos markdown.
