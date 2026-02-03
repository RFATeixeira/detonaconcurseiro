import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

const PCI_BASE_URL = 'https://www.pciconcursos.com.br/concursos/';

const UF_TO_STATE: Record<string, string> = {
  AC: 'ACRE',
  AL: 'ALAGOAS',
  AP: 'AMAPÁ',
  AM: 'AMAZONAS',
  BA: 'BAHIA',
  CE: 'CEARÁ',
  DF: 'DISTRITO FEDERAL',
  ES: 'ESPÍRITO SANTO',
  GO: 'GOIÁS',
  MA: 'MARANHÃO',
  MT: 'MATO GROSSO',
  MS: 'MATO GROSSO DO SUL',
  MG: 'MINAS GERAIS',
  PA: 'PARÁ',
  PB: 'PARAÍBA',
  PR: 'PARANÁ',
  PE: 'PERNAMBUCO',
  PI: 'PIAUÍ',
  RJ: 'RIO DE JANEIRO',
  RN: 'RIO GRANDE DO NORTE',
  RS: 'RIO GRANDE DO SUL',
  RO: 'RONDÔNIA',
  RR: 'RORAIMA',
  SC: 'SANTA CATARINA',
  SP: 'SÃO PAULO',
  SE: 'SERGIPE',
  TO: 'TOCANTINS',
};

export async function GET(request: Request) {
  try {
    const response = await fetch(PCI_BASE_URL, { cache: 'no-store' });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Falha ao buscar concursos externos' },
        { status: response.status }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    console.log('🔍 Buscando TODOS os concursos do Brasil');

    const concursos_abertos: Array<Record<string, string>> = [];

    // Buscar todos os elementos com classe 'ca' (concursos)
    let debugCount = 0;
    $('.ca').each((_, el) => {
      const node = $(el);
      const linkEl = node.find('a');
      const name = linkEl.text().trim();
      const link = linkEl.attr('href') || '';

      // Encontrar o estado mais próximo (olhando para trás)
      let currentUF = 'NACIONAL';
      let currentState = 'NACIONAL';
      
      const prevUf = node.prevAll('div.uf').first();
      if (prevUf.length) {
        currentState = prevUf.text().trim();
        // Encontrar a UF correspondente
        for (const [uf, stateName] of Object.entries(UF_TO_STATE)) {
          if (stateName === currentState.toUpperCase()) {
            currentUF = uf;
            break;
          }
        }
      }

      // Buscar elementos irmãos (siblings) com classes cd e ce
      const details = node.siblings('.cd').text();
      const subscription = node.siblings('.ce').text();

      // Se não encontrou como sibling, tentar parent's siblings
      const detailsAlt = node.parent().find('.cd').text();
      const subscriptionAlt = node.parent().find('.ce').text();

      const finalDetails = details || detailsAlt;
      const finalSubscription = subscription || subscriptionAlt;

      // Debug dos primeiros 3 concursos
      if (debugCount < 3) {
        console.log('\n🔍 DEBUG Concurso', debugCount + 1);
        console.log('Nome:', name);
        console.log('HTML structure:', node.parent().html()?.substring(0, 300));
        console.log('Details raw:', finalDetails);
        console.log('Subscription raw:', finalSubscription);
        debugCount++;
      }

      const vagasMatch = finalDetails.match(/(\d+)\s*vaga/gi);
      const nivelMatch = finalDetails.match(/Superior|Médio/gi);
      const salarioMatch = finalDetails.match(/R\$\s*\d+[\d\.]*,?\d*/g);
      const inscricaoMatch = finalSubscription.match(/\d{2}\/\d{2}\/\d{4}/g);

      if (name) {
        concursos_abertos.push({
          Concurso: name,
          Vagas: vagasMatch ? vagasMatch[0].replace(/\D/g, '') : '',
          'Nível': nivelMatch ? nivelMatch.join('/') : '',
          'Salário Até': salarioMatch ? salarioMatch[0] : '',
          'Inscrição Até': inscricaoMatch ? inscricaoMatch[0] : '',
          Link: link,
          UF: currentUF,
          Estado: currentState,
        });
      }
    });

    console.log('✅ Total de concursos encontrados:', concursos_abertos.length);

    return NextResponse.json({
      concursos_abertos,
      concursos_previstos: [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro inesperado ao consultar API externa' },
      { status: 500 }
    );
  }
}
