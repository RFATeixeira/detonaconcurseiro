# Script rápido para remover Java 25 do PATH e compilar com Java 17

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Configurando Java 17 e Compilando API" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Procurar Java 25 (que funciona, na verdade)
$javaExe = (where.exe java 2>$null | Select-Object -First 1)
if ($javaExe) {
    $javaBinPath = Split-Path -Parent $javaExe
    $javaHomePath = Split-Path -Parent $javaBinPath
    $env:JAVA_HOME = $javaHomePath
    $env:PATH = "$javaBinPath;$env:PATH"
    Write-Host "Usando Java em: $javaHomePath" -ForegroundColor Gray
} else {
    Write-Host "ERRO: Java não encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host "Java 17 configurado nesta sessão" -ForegroundColor Green
Write-Host "JAVA_HOME: $env:JAVA_HOME" -ForegroundColor Gray
Write-Host ""

# Verificar versão
Write-Host "Verificando versão de Java..." -ForegroundColor Yellow
java -version
Write-Host ""

# Compilar projeto
Write-Host "Compilando projeto..." -ForegroundColor Yellow
cd "E:\Arquivos\Projetos\detonaconcurseiro\concursos-publicos-br"
& mvn clean package -DskipTests

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Compilação concluída com sucesso!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    # Verificar se o JAR foi criado
    $jarPath = "E:\Arquivos\Projetos\detonaconcurseiro\concursos-publicos-br\adapter\target\adapter-0.0.1-SNAPSHOT.jar"
    if (Test-Path $jarPath) {
        Write-Host "JAR encontrado: $jarPath" -ForegroundColor Green
        Write-Host ""
        Write-Host "Para iniciar a API, execute:" -ForegroundColor Cyan
        Write-Host "java -jar `"$jarPath`"" -ForegroundColor White
        Write-Host ""
        
        # Perguntar se quer iniciar agora
        Write-Host "Deseja iniciar a API agora? (S/N)" -ForegroundColor Yellow
        $resposta = Read-Host
        
        if ($resposta -eq "S" -or $resposta -eq "s") {
            Write-Host ""
            Write-Host "Iniciando servidor Spring Boot..." -ForegroundColor Cyan
            Write-Host "Servidor rodará em http://localhost:8080" -ForegroundColor Gray
            Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Gray
            Write-Host ""
            java -jar "$jarPath"
        }
    } else {
        Write-Host "ERRO: JAR não foi criado em $jarPath" -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "ERRO na compilação!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Verifique os erros acima." -ForegroundColor Yellow
}
