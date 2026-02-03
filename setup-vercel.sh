#!/bin/bash

# 🚀 Script de Setup para Vercel
# Este script prepara o projeto para deploy no Vercel

set -e

echo "=========================================="
echo "🚀 Setup Vercel - Detona Concurseiro"
echo "=========================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Verificar Node.js
echo -e "${YELLOW}1. Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não está instalado!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v) encontrado${NC}"
echo ""

# 2. Verificar npm
echo -e "${YELLOW}2. Verificando npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm não está instalado!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm -v) encontrado${NC}"
echo ""

# 3. Instalar dependências
echo -e "${YELLOW}3. Instalando dependências...${NC}"
npm install
echo -e "${GREEN}✅ Dependências instaladas${NC}"
echo ""

# 4. Verificar .env.production
echo -e "${YELLOW}4. Verificando .env.production...${NC}"
if [ -f ".env.production" ]; then
    echo -e "${GREEN}✅ .env.production encontrado${NC}"
else
    echo -e "${RED}❌ .env.production não encontrado!${NC}"
    exit 1
fi
echo ""

# 5. Verificar .env.production.local
echo -e "${YELLOW}5. Verificando .env.production.local (chaves privadas)...${NC}"
if [ -f ".env.production.local" ]; then
    echo -e "${GREEN}✅ .env.production.local encontrado${NC}"
else
    echo -e "${RED}❌ .env.production.local não encontrado!${NC}"
    echo "    Execute primeiro: npm run setup"
    exit 1
fi
echo ""

# 6. Verificar vercel.json
echo -e "${YELLOW}6. Verificando vercel.json...${NC}"
if [ -f "vercel.json" ]; then
    echo -e "${GREEN}✅ vercel.json encontrado${NC}"
else
    echo -e "${RED}❌ vercel.json não encontrado!${NC}"
    exit 1
fi
echo ""

# 7. Build de teste
echo -e "${YELLOW}7. Testando build...${NC}"
npm run build
echo -e "${GREEN}✅ Build funcionando corretamente${NC}"
echo ""

# 8. Resumo
echo "=========================================="
echo -e "${GREEN}✅ Setup concluído com sucesso!${NC}"
echo "=========================================="
echo ""
echo -e "${YELLOW}Próximos passos no Vercel:${NC}"
echo "1. Vá para https://vercel.com"
echo "2. Conecte seu repositório Git"
echo "3. Adicione as variáveis de ambiente:"
echo "   - NEXT_PUBLIC_* (do .env.production)"
echo "   - FIREBASE_ADMIN_* (do .env.production.local)"
echo "4. Clique em Deploy"
echo ""
echo -e "${GREEN}Para mais informações, veja: VERCEL_DEPLOY.md${NC}"
