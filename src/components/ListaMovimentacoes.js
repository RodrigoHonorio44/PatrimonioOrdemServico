import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { db } from '../config/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default function ListaMovimentacoes() {
    const [entradas, setEntradas] = useState([]);
    const [saidas, setSaidas] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const entradasSnapshot = await getDocs(collection(db, 'entradas'));
            const saidasSnapshot = await getDocs(collection(db, 'saidas'));

            const entradasData = entradasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const saidasData = saidasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            setEntradas(entradasData);
            setSaidas(saidasData);
        };

        fetchData();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Entradas</Text>
            {entradas.map(item => (
                <View key={item.id} style={styles.card}>
                    <Text>Equipamento: {item.equipamento}</Text>
                    <Text>Quantidade: {item.quantidade}</Text>
                    <Text>Patrimônio: {item.patrimonio}</Text>
                    <Text>Local: {item.localArmazenamento}</Text>
                    <Text>Data/Hora: {new Date(item.dataHora).toLocaleString()}</Text>
                </View>
            ))}

            <Text style={styles.title}>Saídas</Text>
            {saidas.map(item => (
                <View key={item.id} style={styles.card}>
                    <Text>Equipamento: {item.equipamento}</Text>
                    <Text>Quantidade: {item.quantidade}</Text>
                    <Text>Patrimônio: {item.patrimonio}</Text>
                    <Text>Data/Hora: {new Date(item.dataHora).toLocaleString()}</Text>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 20, fontWeight: 'bold', marginVertical: 16 },
    card: {
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
});
