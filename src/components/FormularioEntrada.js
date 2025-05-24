import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Alert, Text, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../styles/stylesEntrada';
import { db } from '../config/firebaseConfig';
import { collection, addDoc, updateDoc, doc, Timestamp, query, where, getDocs } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

// Função para formatar Date JS no formato desejado
function formatarDataHora(date) {
    const opcoesData = { day: '2-digit', month: 'long', year: 'numeric' };
    const data = date.toLocaleDateString('pt-BR', opcoesData);
    const hora = date.toLocaleTimeString('pt-BR');
    return `${data} às ${hora}`;
}

export default function FormularioEntrada({
    equipamento,
    setEquipamento,
    quantidade,
    setQuantidade,
}) {
    const [patrimonio, setPatrimonio] = useState('');
    const [localArmazenamento, setLocalArmazenamento] = useState('');
    const [unidade, setUnidade] = useState('');
    const [dataHora, setDataHora] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const agora = new Date();
        setDataHora(formatarDataHora(agora));
    }, []);

    const handleRegistrar = async () => {
        if (!equipamento || !quantidade || !patrimonio || !localArmazenamento || !unidade) {
            Alert.alert('Atenção', 'Preencha todos os campos.');
            return;
        }

        setLoading(true);

        try {
            // Consulta estoque pelo equipamento
            const estoqueRef = collection(db, 'estoque');
            const q = query(estoqueRef, where('equipamento', '==', equipamento));
            const querySnapshot = await getDocs(q);

            let equipamentoId;
            let estoqueDocRef;

            if (querySnapshot.empty) {
                // Cria novo equipamento no estoque
                equipamentoId = uuidv4();
                const estoqueDoc = await addDoc(estoqueRef, {
                    equipamentoId,
                    equipamento,
                    patrimonio,
                    localArmazenamento,
                    unidade,
                    quantidade: parseInt(quantidade, 10),
                    dataHora: Timestamp.now(),
                });
                estoqueDocRef = estoqueDoc;
            } else {
                // Atualiza equipamento existente
                const docEstoque = querySnapshot.docs[0];
                const dataEstoque = docEstoque.data();
                equipamentoId = dataEstoque.equipamentoId;
                estoqueDocRef = docEstoque.ref;

                const novaQuantidade = dataEstoque.quantidade + parseInt(quantidade, 10);

                await updateDoc(estoqueDocRef, {
                    quantidade: novaQuantidade,
                    patrimonio,
                    localArmazenamento,
                    unidade,
                    dataHora: Timestamp.now(),
                });
            }

            // Registra movimentação
            const movimentacoesRef = collection(db, 'movimentacoes');
            const docMovimentacao = await addDoc(movimentacoesRef, {
                tipo: 'entrada',
                equipamento,
                equipamentoId,
                quantidade: parseInt(quantidade, 10),
                patrimonio,
                localArmazenamento,
                unidade,
                dataHora: Timestamp.now(),
            });

            await updateDoc(doc(movimentacoesRef, docMovimentacao.id), {
                id: docMovimentacao.id,
            });

            Alert.alert('Sucesso', 'Entrada registrada com sucesso!');

            // Resetar campos
            setEquipamento('');
            setQuantidade('');
            setPatrimonio('');
            setLocalArmazenamento('');
            setUnidade('');
            setDataHora(formatarDataHora(new Date()));

        } catch (error) {
            Alert.alert('Erro', `Erro ao registrar entrada: ${error.message}`);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View>
            <TextInput
                style={styles.input}
                placeholder="Descrição do Equipamento"
                value={equipamento}
                onChangeText={setEquipamento}
            />

            <TextInput
                style={styles.input}
                placeholder="Quantidade"
                keyboardType="numeric"
                value={quantidade}
                onChangeText={setQuantidade}
            />

            <TextInput
                style={styles.input}
                placeholder="Nº do Patrimônio"
                value={patrimonio}
                onChangeText={setPatrimonio}
            />

            <TextInput
                style={styles.input}
                placeholder="Local de Armazenamento"
                value={localArmazenamento}
                onChangeText={setLocalArmazenamento}
            />

            <Picker
                selectedValue={unidade}
                onValueChange={setUnidade}
                style={styles.input}
            >
                <Picker.Item label="Selecione a Unidade" value="" enabled={false} />
                <Picker.Item label="Hospital Conde" value="Hospital Conde" />
                <Picker.Item label="UPA de Inoã" value="UPA de Inoã" />
                <Picker.Item label="UPA Santa Rita" value="UPA Santa Rita" />
                <Picker.Item label="Samu Barroco" value="Samu Barroco" />
                <Picker.Item label="Samu Ponta Negra" value="Samu Ponta Negra" />
            </Picker>

            <Text style={styles.dataHora}>Data e Hora: {dataHora}</Text>

            {loading ? (
                <ActivityIndicator size="large" color="blue" />
            ) : (
                <Button
                    title="Registrar Entrada"
                    onPress={handleRegistrar}
                />
            )}
        </View>
    );
}
