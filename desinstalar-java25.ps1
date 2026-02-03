# Script para desinstalar Java 25 e manter apenas Java 17

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Desinstalando Java 25 (Temurin 25.0.2)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Listar todas as versões de Java instaladas
Write-Host "Verificando versões de Java instaladas..." -ForegroundColor Yellow
Get-WmiObject -Class Win32_Product | Where-Object { $_.Name -like "*Java*" -or $_.Name -like "*JDK*" -or $_.Name -like "*Temurin*" } | Select-Object Name, Version | Format-Table -AutoSize

Write-Host ""
Write-Host "Desinstalando Java 25..." -ForegroundColor Yellow

# Desinstalar Java 25 (Temurin 25.0.2)
$java25 = Get-WmiObject -Class Win32_Product | Where-Object { $_.Name -like "*Temurin*25*" }

if ($java25) {
    Write-Host "Encontrado: $($java25.Name)" -ForegroundColor Green
    Write-Host "Desinstalando..." -ForegroundColor Yellow
    $java25.Uninstall()
    Write-Host "Java 25 desinstalado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "Java 25 não encontrado ou já foi desinstalado." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Aguardando 5 segundos..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Verificar Java após desinstalação
Write-Host ""
Write-Host "Verificando versão de Java no PATH..." -ForegroundColor Yellow
java -version

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Processo concluído!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Green
Write-Host "1. Feche e reabra o terminal" -ForegroundColor White
Write-Host "2. Execute: cd E:\Arquivos\Projetos\detonaconcurseiro\concursos-publicos-br" -ForegroundColor White
Write-Host "3. Execute: mvn clean package -DskipTests" -ForegroundColor White
Write-Host "4. Execute: java -jar adapter\target\adapter-0.0.1-SNAPSHOT.jar" -ForegroundColor White
Write-Host ""
