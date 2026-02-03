/**
 * INSTRUÇÕES PARA DEFINIR UM USUÁRIO COMO ADMIN
 * 
 * Para definir um usuário como admin no Firestore, você tem duas opções:
 * 
 * OPÇÃO 1: Usar o Console do Firebase
 * 1. Vá para https://console.firebase.google.com
 * 2. Selecione seu projeto
 * 3. Acesse Firestore Database > Coleção "users"
 * 4. Encontre o documento com o UID do usuário que deseja tornar admin
 * 5. Adicione um campo chamado "isAdmin" com valor "true" (boolean)
 * 6. Salve as mudanças
 * 
 * OPÇÃO 2: Usar o Console do Navegador (Developer Tools)
 * Execute este código no console do navegador (F12 > Console):
 * 
 * ```javascript
 * // Você precisa estar logado e ter importado o Firebase
 * import { db, auth } from '@/lib/firebase';
 * import { doc, updateDoc } from 'firebase/firestore';
 * 
 * const uid = auth.currentUser.uid; // seu UID
 * const userRef = doc(db, 'users', uid);
 * await updateDoc(userRef, { isAdmin: true });
 * console.log('Usuário marcado como admin!');
 * ```
 * 
 * OPÇÃO 3: Criar uma página de admin temporária
 * (Não recomendado em produção, apenas para desenvolvimento)
 * 
 * Para encontrar seu UID:
 * 1. Faça login na aplicação
 * 2. Abra o console do navegador (F12)
 * 3. Execute: console.log(auth.currentUser.uid)
 * 4. Copie o UID mostrado
 * 
 * Ou acesse o Firebase Console > Authentication > Users > copie o UID do usuário
 */

export const ADMIN_SETUP_INSTRUCTIONS = `
COMO TORNAR UM USUÁRIO ADMIN:

1. Abra o Firebase Console (console.firebase.google.com)
2. Selecione seu projeto
3. Vá para Firestore Database
4. Na coleção "users", encontre o documento com o UID do usuário
5. Adicione ou edite um campo: isAdmin (boolean) = true
6. Salve

Seu UID pode ser encontrado:
- No Firebase Console > Authentication > clique no usuário
- Na aplicação: abra o console do navegador e execute: console.log(auth.currentUser.uid)
`;
