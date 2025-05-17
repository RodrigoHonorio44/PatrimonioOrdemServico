import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Alert, Text } from 'react-native';
import styles from '../styles/stylesSaida';
import { db } from '../config/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function FormularioSaida({ equipamento, setEquipamento, quantidade, setQuantidade }) {
    const [patrimonio, setPatrimonio] = useState('');
    const [dataHora, setDataHora] = useState('');

    useEffect(() => {
        const agora = new Date();
        const dataFormatada = agora.toLocaleDateString();
        const horaFormatada = agora.toLocaleTimeString();
        setDataHora(`${dataFormatada} ${horaFormatada}`);
    }, []);

    const handleRegistrar = async () => {
        try {
            await addDoc(collection(db, 'saidas'), {
                equipamento,
                quantidade,
                patrimonio,
                dataHora: new Date().toISOString(),
            });

            Alert.alert('Saída registrada com sucesso!');
            setEquipamento('');
            setQuantidade('');
            setPatrimonio('');
        } catch (error) {
            Alert.alert('Erro ao registrar saída', error.message);
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
            <Text style={styles.dataHora}>Data e Hora: {dataHora}</Text>
            <Button title="Registrar Saída" onPress={handleRegistrar} />
        </View>
    );
}
