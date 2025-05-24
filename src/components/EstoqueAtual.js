import React, { useState, useCallback } from 'react';
import { View, Text, Button, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';

export default function EstoqueAtual({ navigation }) {
    const [estoque, setEstoque] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEstoque = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'estoque'));
            const lista = querySnapshot.docs.map((doc) => {
                return {
                    id: doc.id,  // sempre vem aqui
                    ...doc.data(),
                };
            });
            setEstoque(lista);
        } catch (error) {
            console.error('Erro ao buscar estoque:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchEstoque();
        }, [])
    );

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.text}>
                <Text style={styles.label}>Equipamento:</Text> {item.equipamento || '-'}
            </Text>
            <Text style={styles.text}>
                <Text style={styles.label}>Quantidade:</Text> {item.quantidade || '-'}
            </Text>
            <Text style={styles.text}>
                <Text style={styles.label}>Patrimônio:</Text> {item.patrimonio || '-'}
            </Text>
            <Text style={styles.text}>
                <Text style={styles.label}>Local:</Text> {item.localArmazenamento || '-'}
            </Text>
            <Text style={styles.text}>
                <Text style={styles.label}>Unidade:</Text> {item.unidade || '-'}
            </Text>

            <Button
                title="Registrar Saída"
                onPress={() => navigation.navigate('FormularioSaida', { equipamentoSelecionado: item })}
            />
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Carregando estoque...</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={estoque}
            keyExtractor={(item, index) => item.id ? item.id : index.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 10 }}
            ListEmptyComponent={<Text style={styles.emptyText}>Nenhum item em estoque.</Text>}
        />
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 15,
        marginVertical: 8,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    text: {
        marginBottom: 4,
    },
    label: {
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#555',
    },
});
