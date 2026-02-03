import { getAdminDb } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { Timestamp } from 'firebase-admin/firestore';
import { NextRequest, NextResponse } from 'next/server';

interface AprovaConcursoRequest {
   id?: string;
  nome: string;
  orgao: string;
  edital?: string;
  salario?: string;
  vagas?: number;
  status?: string;
  dataFechamento?: string;
  dataFinalInscricao?: string;
  dataProva?: string;
  dataEncerramento?: string;
   descricao?: string;
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

    if (!token) {
      return NextResponse.json(
        { error: 'Token de autenticação ausente' },
        { status: 401 }
      );
    }

    const adminDb = getAdminDb();
    const decoded = await getAuth().verifyIdToken(token);
    const userDoc = await adminDb.collection('users').doc(decoded.uid).get();
    const isAdmin = userDoc.exists && userDoc.data()?.isAdmin === true;

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    const body: AprovaConcursoRequest = await request.json();

    // Validar dados obrigatórios
     if (!body.nome || !body.orgao) {
      return NextResponse.json(
        { error: 'Nome e órgão são obrigatórios' },
        { status: 400 }
      );
    }

    // Salvar em concursosData (aprovado)
    const docRef = await adminDb.collection('concursosData').add({
      nomeConcurso: body.nome,
      banca: body.orgao,
      cargo: `${body.orgao} - Vários`,
      salario: body.salario || 'A definir',
      dataProva: body.dataProva || '',
      dataFinalInscricao: body.dataFinalInscricao || body.dataFechamento || '',
      dataEncerramento: body.dataEncerramento || '',
      edital: body.edital || '',
       descricao: body.descricao || `Concurso importado da API Externa - ${body.orgao}`,
      documentoURL: '',
      dataCriacao: Timestamp.now(),
      origem: 'api-externa',
      statusExterno: body.status || 'open',
      vagasExternas: body.vagas || 0,
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Concurso aprovado com sucesso',
        docId: docRef.id 
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao aprovar concurso';
    console.error('Erro ao aprovar concurso:', error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
