import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { cpf } = await request.json();

    if (!cpf || typeof cpf !== 'string') {
      return NextResponse.json(
        { error: 'CPF obrigatório.' },
        { status: 400 }
      );
    }

    const normalizedCpf = cpf.replace(/\D/g, '');

    if (normalizedCpf.length !== 11) {
      return NextResponse.json(
        { error: 'CPF inválido.' },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    const snapshot = await db
      .collection('users')
      .where('cpf', '==', normalizedCpf)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { error: 'CPF não encontrado.' },
        { status: 404 }
      );
    }

    const userData = snapshot.docs[0].data();
    const email = userData?.email;

    if (!email) {
      return NextResponse.json(
        { error: 'Email não encontrado para este CPF.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ email });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao resolver email pelo CPF.' },
      { status: 500 }
    );
  }
}
