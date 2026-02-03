#!/usr/bin/env bash

# 🚀 COMECE AQUI - Deploy no Vercel em 3 passos
# Execute este script para começar o deploy

echo "=========================================="
echo "🚀 DEPLOY VERCEL - COMECE AQUI"
echo "=========================================="
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Você tem 3 opções:${NC}"
echo ""
echo -e "${GREEN}1️⃣  DEPLOY RÁPIDO (Vercel CLI)${NC}"
echo "   npm install -g vercel"
echo "   vercel login"
echo "   vercel --prod"
echo ""
echo -e "${GREEN}2️⃣  DEPLOY AUTOMÁTICO (GitHub)${NC}"
echo "   git push"
echo "   Acesse: vercel.com"
echo "   Conecte seu repositório"
echo ""
echo -e "${GREEN}3️⃣  DEPLOY COM VALIDAÇÃO (Script)${NC}"
echo "   npm run deploy"
echo "   npm run deploy:prod"
echo ""
echo -e "${BLUE}Documentação:${NC}"
echo "   📖 DEPLOY_QUICK.md - 2 minutos"
echo "   📖 VERCEL_QUICK.md - 5 minutos"
echo "   📖 SETUP_VERCEL_COMPLETO.md - Tudo explicado"
echo ""
echo -e "${YELLOW}Qual você escolhe? (1, 2 ou 3)${NC}"
read -p "> " choice

case $choice in
  1)
    echo ""
    echo -e "${BLUE}Instalando Vercel CLI...${NC}"
    npm install -g vercel
    echo -e "${GREEN}✅ Vercel CLI instalado${NC}"
    echo ""
    echo -e "${BLUE}Fazendo login...${NC}"
    vercel login
    echo ""
    echo -e "${BLUE}Iniciando deploy...${NC}"
    vercel --prod
    ;;
  2)
    echo ""
    echo -e "${BLUE}Seus próximos passos:${NC}"
    echo "1. Execute:"
    echo "   git push"
    echo ""
    echo "2. Acesse: https://vercel.com"
    echo ""
    echo "3. Clique em 'New Project'"
    echo ""
    echo "4. Selecione seu repositório"
    echo ""
    echo "5. Clique em 'Deploy'"
    echo ""
    echo -e "${GREEN}✅ Pronto!${NC}"
    ;;
  3)
    echo ""
    echo -e "${BLUE}Validando setup...${NC}"
    npm run deploy
    echo ""
    echo -e "${BLUE}Se tudo OK, execute:${NC}"
    echo "npm run deploy:prod"
    ;;
  *)
    echo -e "${RED}Opção inválida!${NC}"
    exit 1
    ;;
esac

echo ""
echo "=========================================="
echo -e "${GREEN}🎉 SUCESSO!${NC}"
echo "=========================================="
