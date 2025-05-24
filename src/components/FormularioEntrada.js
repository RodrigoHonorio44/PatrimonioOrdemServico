import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Alert, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../styles/stylesEntrada';
import { db } from '../config/firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

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
        const dataFormatada = agora.toLocaleDateString();
        const horaFormatada = agora.toLocaleTimeString();
        setDataHora(`${dataFormatada} ${horaFormatada}`);
    }, []);

    const handleRegistrar = async () => {
        if (!equipamento || !quantidade || !patrimonio || !localArmazenamento || !unidade) {
            Alert.alert('Atenção', 'Preencha todos os campos.');
            return;
        }

        setLoading(true);
        try {
            // addDoc gera id automaticamente
            await addDoc(collection(db, 'movimentacoes'), {
                tipo: 'entrada',
                equipamento,
                quantidade: parseInt(quantidade, 10),
                patrimonio,
                localArmazenamento,
                unidade,
                dataHora: Timestamp.now(),
            });

            Alert.alert('Sucesso', 'Entrada registrada com sucesso!');
            setEquipamento('');
            setQuantidade('');
            setPatrimonio('');
            setLocalArmazenamento('');
            setUnidade('');
        } catch (error) {
            Alert.alert('Erro', `Erro ao registrar entrada: ${error.message}`);
        } finally {
            setLoading(false);
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
            <Button
                title={loading ? 'Registrando...' : 'Registrar Entrada'}
                onPress={handleRegistrar}
                disabled={loading}
            />
        </View>
    );
}
