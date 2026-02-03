#!/usr/bin/env node

/**
 * 🚀 Deploy Script para Vercel
 * 
 * Este script automatiza o deploy para o Vercel sem precisar criar nada lá.
 * Uso: node deploy-vercel.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  title: (msg) => console.log(`\n${colors.blue}${'='.repeat(50)}${colors.reset}\n${colors.blue}${msg}${colors.reset}\n${colors.blue}${'='.repeat(50)}${colors.reset}\n`),
};

async function checkFile(filename) {
  return new Promise((resolve) => {
    fs.access(filename, fs.constants.F_OK, (err) => {
      resolve(!err);
    });
  });
}

async function runCommand(cmd) {
  try {
    execSync(cmd, { stdio: 'inherit' });
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  log.title('🚀 Vercel Deploy - Detona Concurseiro');

  // 1. Verificar arquivos necessários
  log.info('Verificando arquivos necessários...');
  
  const requiredFiles = [
    '.env.production',
    '.env.production.local',
    'vercel.json',
    'package.json',
    'next.config.ts',
  ];

  let missingFiles = [];
  for (const file of requiredFiles) {
    const exists = await checkFile(file);
    if (exists) {
      log.success(`${file}`);
    } else {
      log.error(`${file}`);
      missingFiles.push(file);
    }
  }

  if (missingFiles.length > 0) {
    log.error(`Arquivos faltando: ${missingFiles.join(', ')}`);
    process.exit(1);
  }

  console.log();

  // 2. Verificar Node.js
  log.info('Verificando Node.js...');
  try {
    const nodeVersion = execSync('node --version').toString().trim();
    log.success(`Node.js ${nodeVersion}`);
  } catch {
    log.error('Node.js não está instalado!');
    process.exit(1);
  }

  console.log();

  // 3. Verificar npm
  log.info('Verificando npm...');
  try {
    const npmVersion = execSync('npm --version').toString().trim();
    log.success(`npm ${npmVersion}`);
  } catch {
    log.error('npm não está instalado!');
    process.exit(1);
  }

  console.log();

  // 4. Instalar dependências
  log.info('Instalando dependências...');
  const installSuccess = await runCommand('npm install');
  if (!installSuccess) {
    log.error('Falha ao instalar dependências!');
    process.exit(1);
  }
  log.success('Dependências instaladas');

  console.log();

  // 5. Instalar Vercel CLI
  log.info('Verificando Vercel CLI...');
  try {
    execSync('vercel --version', { stdio: 'pipe' });
    log.success('Vercel CLI já está instalado');
  } catch {
    log.warning('Vercel CLI não encontrado, instalando...');
    await runCommand('npm install -g vercel');
    log.success('Vercel CLI instalado');
  }

  console.log();

  // 6. Build de teste
  log.info('Testando build...');
  const buildSuccess = await runCommand('npm run build');
  if (!buildSuccess) {
    log.error('Falha no build!');
    log.warning('Execute "npm run build" localmente para ver os erros');
    process.exit(1);
  }
  log.success('Build funcionando');

  console.log();

  // 7. Resumo final
  log.title('✅ Tudo pronto para deploy!');

  log.info('Próximos passos:');
  console.log(`
1. Certifique-se de estar logado no Vercel:
   ${colors.yellow}vercel login${colors.reset}

2. Execute o deploy:
   ${colors.yellow}vercel --prod${colors.reset}

3. Vercel vai:
   ✅ Ler .env.production automaticamente
   ✅ Pedir para confirmar .env.production.local
   ✅ Fazer o deploy
   ✅ Gerar URL da aplicação

Alternativa via GitHub:
   1. Push para seu repositório
   2. Vá para vercel.com
   3. Conecte seu repositório
   4. Deploy automático a cada push

Para informações detalhadas, veja:
   📖 VERCEL_DEPLOY.md
   📖 VERCEL_QUICK.md
  `);
}

main().catch(err => {
  log.error(`Erro: ${err.message}`);
  process.exit(1);
});
