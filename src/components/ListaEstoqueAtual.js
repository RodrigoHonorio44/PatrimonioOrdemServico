import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export default function FormularioSaida({ item, onVoltar }) {

    const confirmarSaida = async () => {
        try {
            await addDoc(collection(db, 'movimentacoes'), {
                equipamento: item.equipamento,
                localArmazenamento: item.local,
                patrimonio: item.patrimonio,
                unidade: item.unidade,
                quantidade: 1,  // Aqui, sempre registra 1 unidade. Pode ajustar.
                tipo: 'saida',
                dataHora: serverTimestamp(),
            });
            Alert.alert('Sucesso', 'Saída registrada com sucesso!');
            onVoltar();  // Volta para a lista
        } catch (error) {
            console.error('Erro ao registrar saída:', error);
            Alert.alert('Erro', 'Não foi possível registrar a saída.');
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Confirmar Saída</Text>
            <Text>Equipamento: {item.equipamento}</Text>
            <Text>Local: {item.local}</Text>
            <Text>Patrimônio: {item.patrimonio}</Text>
            <Text>Unidade: {item.unidade}</Text>
            <Text>Quantidade disponível: {item.quantidade}</Text>

            <View style={{ marginTop: 20 }}>
                <Button title="Confirmar Saída" onPress={confirmarSaida} color="red" />
            </View>
            <View style={{ marginTop: 10 }}>
                <Button title="Cancelar" onPress={onVoltar} />
            </View>
        </View>
    );
}
