import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    Button,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    ScrollView,
} from 'react-native';
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
            const lista = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
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

            <View style={styles.buttonContainer}>
                <Button
                    title="Registrar Saída"
                    onPress={() => navigation.navigate('FormularioSaida', { equipamentoSelecionado: item })}
                    color="#007bff"
                />
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={{ color: '#000' }}>Carregando estoque...</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={estoque}
            keyExtractor={(item, index) => item.id || index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<Text style={styles.emptyText}>Nenhum item em estoque.</Text>}
        />
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    listContent: {
        padding: 10,
        paddingBottom: 30,
    },
    card: {
        width: '100%',
        padding: 16,
        marginBottom: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    text: {
        marginBottom: 4,
        fontSize: width < 380 ? 14 : 16,
        color: '#333',
    },
    label: {
        fontWeight: 'bold',
        color: '#111',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 30,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 30,
        fontSize: 16,
        color: '#666',
    },
    buttonContainer: {
        marginTop: 10,
    },
});
