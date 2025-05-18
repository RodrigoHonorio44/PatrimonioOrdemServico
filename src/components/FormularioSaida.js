import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Alert, Text } from 'react-native';
import styles from '../styles/stylesSaida';
import { db } from '../config/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function FormularioSaida({
    equipamento,
    setEquipamento,
    local,
    quantidade,
    setQuantidade,
}) {
    const [patrimonio, setPatrimonio] = useState('');
    const [localArmazenamento, setLocalArmazenamento] = useState(local || '');
    const [localDestino, setLocalDestino] = useState('');
    const [dataHora, setDataHora] = useState('');

    useEffect(() => {
        const agora = new Date();
        const dataFormatada = agora.toLocaleDateString();
        const horaFormatada = agora.toLocaleTimeString();
        setDataHora(`${dataFormatada} ${horaFormatada}`);
    }, []);

    const handleRegistrar = async () => {
        if (!equipamento || !quantidade || !patrimonio || !localArmazenamento || !localDestino) {
            Alert.alert('Atenção', 'Preencha todos os campos.');
            return;
        }

        try {
            await addDoc(collection(db, 'movimentacoes'), {
                tipo: 'saida',
                equipamento,
                quantidade: parseInt(quantidade),
                patrimonio,
                local: localArmazenamento,
                localDestino,
                dataHora,
            });

            Alert.alert('Sucesso', 'Saída registrada com sucesso!');

            // Limpa campos após registrar
            setEquipamento('');
            setQuantidade('');
            setPatrimonio('');
            setLocalArmazenamento('');
            setLocalDestino('');
        } catch (error) {
            Alert.alert('Erro', 'Erro ao registrar a saída: ' + error.message);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Nome do Equipamento"
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
            <TextInput
                style={styles.input}
                placeholder="Local de Destino"
                value={localDestino}
                onChangeText={setLocalDestino}
            />
            <Text style={styles.dataHora}>Data e Hora: {dataHora}</Text>
            <Button title="Registrar Saída" onPress={handleRegistrar} />
        </View>
    );
}
