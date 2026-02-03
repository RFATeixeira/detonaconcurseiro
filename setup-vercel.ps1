# 🚀 Setup Vercel para Windows
# Este script prepara o projeto para deploy no Vercel

Write-Host "==========================================" -ForegroundColor Green
Write-Host "🚀 Setup Vercel - Detona Concurseiro" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# 1. Verificar Node.js
Write-Host "1. Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Node.js $nodeVersion encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js não está instalado!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 2. Verificar npm
Write-Host "2. Verificando npm..." -ForegroundColor Yellow
$npmVersion = npm --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ npm $npmVersion encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ npm não está instalado!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 3. Instalar dependências
Write-Host "3. Instalando dependências..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependências instaladas" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao instalar dependências!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 4. Verificar .env.production
Write-Host "4. Verificando .env.production..." -ForegroundColor Yellow
if (Test-Path ".env.production") {
    Write-Host "✅ .env.production encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ .env.production não encontrado!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 5. Verificar .env.production.local
Write-Host "5. Verificando .env.production.local (chaves privadas)..." -ForegroundColor Yellow
if (Test-Path ".env.production.local") {
    Write-Host "✅ .env.production.local encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ .env.production.local não encontrado!" -ForegroundColor Red
    Write-Host "    Execute primeiro: npm run setup" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# 6. Verificar vercel.json
Write-Host "6. Verificando vercel.json..." -ForegroundColor Yellow
if (Test-Path "vercel.json") {
    Write-Host "✅ vercel.json encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ vercel.json não encontrado!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 7. Build de teste
Write-Host "7. Testando build..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build funcionando corretamente" -ForegroundColor Green
} else {
    Write-Host "❌ Erro no build!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 8. Resumo
Write-Host "==========================================" -ForegroundColor Green
Write-Host "✅ Setup concluído com sucesso!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos no Vercel:" -ForegroundColor Yellow
Write-Host "1. Vá para https://vercel.com"
Write-Host "2. Conecte seu repositório Git"
Write-Host "3. Adicione as variáveis de ambiente:"
Write-Host "   - NEXT_PUBLIC_* (do .env.production)"
Write-Host "   - FIREBASE_ADMIN_* (do .env.production.local)"
Write-Host "4. Clique em Deploy"
Write-Host ""
Write-Host "Para mais informações, veja: VERCEL_DEPLOY.md" -ForegroundColor Green
