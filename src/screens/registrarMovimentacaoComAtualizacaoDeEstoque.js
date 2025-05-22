import { db } from '../config/firebaseConfig';
import { collection, addDoc, doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';

export async function registrarMovimentacaoComEstoque(mov) {
    const {
        tipo, // 'entrada' ou 'saida'
        equipamento,
        localArmazenamento,
        quantidade
    } = mov;

    const quantidadeInt = parseInt(quantidade);
    const docId = `${equipamento}_${localArmazenamento}`.replace(/\s/g, '_');
    const estoqueRef = doc(db, 'estoqueAtual', docId);

    try {
        // 1. Salva movimentação
        await addDoc(collection(db, 'movimentacoes'), {
            tipo,
            equipamento,
            localArmazenamento,
            quantidade: quantidadeInt,
            data: Timestamp.now()
        });

        // 2. Atualiza estoqueAtual
        const estoqueSnap = await getDoc(estoqueRef);
        let novaQuantidade = quantidadeInt;

        if (estoqueSnap.exists()) {
            const atual = estoqueSnap.data().quantidade || 0;
            novaQuantidade = tipo === 'entrada' ? atual + quantidadeInt : atual - quantidadeInt;
            if (novaQuantidade < 0) novaQuantidade = 0;
        }

        await setDoc(estoqueRef, {
            equipamento,
            localArmazenamento,
            quantidade: novaQuantidade,
            atualizadoEm: Timestamp.now()
        }, { merge: true });

    } catch (error) {
        console.error('Erro ao registrar movimentação e atualizar estoque:', error);
        throw error;  // para o chamador tratar se quiser
    }
}
