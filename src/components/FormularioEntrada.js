import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Alert, Text } from 'react-native';
import styles from '../styles/stylesEntrada';
import { db } from '../config/firebaseConfig'; // ajuste o caminho se necessário
import { collection, addDoc } from 'firebase/firestore';

export default function FormularioEntrada({ equipamento, setEquipamento, quantidade, setQuantidade }) {
    const [patrimonio, setPatrimonio] = useState('');
    const [localArmazenamento, setLocalArmazenamento] = useState('');
    const [dataHora, setDataHora] = useState('');

    useEffect(() => {
        const agora = new Date();
        const dataFormatada = agora.toLocaleDateString();
        const horaFormatada = agora.toLocaleTimeString();
        setDataHora(`${dataFormatada} ${horaFormatada}`);
    }, []);

    const handleRegistrar = async () => {
        try {
            await addDoc(collection(db, 'entradas'), {
                equipamento,
                quantidade,
                patrimonio,
                localArmazenamento,
                dataHora: new Date().toISOString(),
            });

            Alert.alert('Entrada registrada com sucesso!');
            setEquipamento('');
            setQuantidade('');
            setPatrimonio('');
            setLocalArmazenamento('');
        } catch (error) {
            Alert.alert('Erro ao registrar entrada', error.message);
        }
    };

    return (
        <View>
            <TextInput
                style={styles.input}
                placeholder="Quantidade"
                keyboardType="numeric"
                value={quantidade}
                onChangeText={setQuantidade}
            />
            <TextInput
                style={styles.input}
                placeholder="Descrição do Equipamento"
                value={equipamento}
                onChangeText={setEquipamento}
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
            <Text style={styles.dataHora}>Data e Hora: {dataHora}</Text>
            <Button title="Registrar Entrada" onPress={handleRegistrar} />
        </View>
    );
}
