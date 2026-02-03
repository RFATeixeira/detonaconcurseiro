# Script de setup para gerar .env.production.local no Windows

Write-Host "🔧 Setup do Detona Concurseiro" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Este script vai criar um arquivo .env.production.local para deploy na Vercel."
Write-Host ""

# Verificar se o arquivo já existe
if (Test-Path ".env.production.local") {
    Write-Host "⚠️  .env.production.local já existe!" -ForegroundColor Yellow
    $response = Read-Host "Deseja sobrescrever? (s/n)"
    if ($response -ne "s" -and $response -ne "S") {
        exit
    }
}

# Se existe .env.local, copiar para .env.production.local
if (Test-Path ".env.local") {
    Write-Host "✅ Copiando .env.local para .env.production.local..." -ForegroundColor Green
    Copy-Item ".env.local" ".env.production.local"
    Write-Host "✅ Arquivo criado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "❌ .env.local não encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor:" -ForegroundColor Yellow
    Write-Host "1. Copie .env.example para .env.local" -ForegroundColor Yellow
    Write-Host "2. Preencha com suas credenciais do Firebase" -ForegroundColor Yellow
    Write-Host "3. Execute este script novamente" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🎉 Setup concluído!" -ForegroundColor Cyan
Write-Host "Agora você pode fazer deploy na Vercel:" -ForegroundColor Cyan
Write-Host "  vercel deploy --prod" -ForegroundColor Green
