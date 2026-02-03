@echo off
REM 🚀 COMECE AQUI - Deploy no Vercel em 3 passos
REM Execute este script para começar o deploy

setlocal enabledelayedexpansion

echo.
echo ==========================================
echo 🚀 DEPLOY VERCEL - COMECE AQUI
echo ==========================================
echo.

echo Você tem 3 opções:
echo.
echo 1️⃣  DEPLOY RÁPIDO (Vercel CLI)
echo    npm install -g vercel
echo    vercel login
echo    vercel --prod
echo.
echo 2️⃣  DEPLOY AUTOMÁTICO (GitHub)
echo    git push
echo    Acesse: vercel.com
echo    Conecte seu repositório
echo.
echo 3️⃣  DEPLOY COM VALIDAÇÃO (Script)
echo    npm run deploy
echo    npm run deploy:prod
echo.
echo Documentação:
echo    📖 DEPLOY_QUICK.md - 2 minutos
echo    📖 VERCEL_QUICK.md - 5 minutos
echo    📖 SETUP_VERCEL_COMPLETO.md - Tudo explicado
echo.

set /p choice="Qual você escolhe? (1, 2 ou 3): "

if "%choice%"=="1" (
    echo.
    echo Instalando Vercel CLI...
    call npm install -g vercel
    echo ✅ Vercel CLI instalado
    echo.
    echo Fazendo login...
    call vercel login
    echo.
    echo Iniciando deploy...
    call vercel --prod
) else if "%choice%"=="2" (
    echo.
    echo Seus próximos passos:
    echo 1. Execute:
    echo    git push
    echo.
    echo 2. Acesse: https://vercel.com
    echo.
    echo 3. Clique em 'New Project'
    echo.
    echo 4. Selecione seu repositório
    echo.
    echo 5. Clique em 'Deploy'
    echo.
    echo ✅ Pronto!
) else if "%choice%"=="3" (
    echo.
    echo Validando setup...
    call npm run deploy
    echo.
    echo Se tudo OK, execute:
    echo npm run deploy:prod
) else (
    echo Opção inválida!
    exit /b 1
)

echo.
echo ==========================================
echo 🎉 SUCESSO!
echo ==========================================
echo.

pause
