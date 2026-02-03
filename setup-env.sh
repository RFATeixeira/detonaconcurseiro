#!/bin/bash
# Script de setup para gerar .env.production.local

echo "🔧 Setup do Detona Concurseiro"
echo "=============================="
echo ""
echo "Este script vai criar um arquivo .env.production.local para deploy na Vercel."
echo ""

# Verificar se o arquivo já existe
if [ -f ".env.production.local" ]; then
    echo "⚠️  .env.production.local já existe!"
    read -p "Deseja sobrescrever? (s/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        exit 1
    fi
fi

# Se existe .env.local, copiar para .env.production.local
if [ -f ".env.local" ]; then
    echo "✅ Copiando .env.local para .env.production.local..."
    cp .env.local .env.production.local
    echo "✅ Arquivo criado com sucesso!"
else
    echo "❌ .env.local não encontrado!"
    echo ""
    echo "Por favor:"
    echo "1. Copie .env.example para .env.local"
    echo "2. Preencha com suas credenciais do Firebase"
    echo "3. Execute este script novamente"
    exit 1
fi

echo ""
echo "🎉 Setup concluído!"
echo "Agora você pode fazer deploy na Vercel:"
echo "  vercel deploy --prod"
