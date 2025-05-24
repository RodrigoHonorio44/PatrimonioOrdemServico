import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export default function EstoqueAtual({ navigation }) {
    const [estoque, setEstoque] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovimentacoes = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'movimentacoes'));
                const movimentacoes = [];

                querySnapshot.forEach((doc) => {
                    movimentacoes.push(doc.data());
                });

                // Consolidar estoque
                const estoqueMap = {};

                movimentacoes.forEach((mov) => {
                    const key = `${mov.equipamento}-${mov.patrimonio}-${mov.localArmazenamento}-${mov.unidade}`;

                    if (!estoqueMap[key]) {
                        estoqueMap[key] = {
                            equipamento: mov.equipamento,
                            patrimonio: mov.patrimonio,
                            localArmazenamento: mov.localArmazenamento,
                            unidade: mov.unidade,
                            quantidade: 0,
                        };
                    }

                    if (mov.tipo === 'entrada') {
                        estoqueMap[key].quantidade += mov.quantidade;
                    } else if (mov.tipo === 'saida') {
                        estoqueMap[key].quantidade -= mov.quantidade;
                    }
                });

                const estoqueArray = Object.values(estoqueMap).filter(item => item.quantidade > 0);

                setEstoque(estoqueArray);
            } catch (error) {
                console.error('Erro ao buscar movimentações: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovimentacoes();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text>Equipamento: {item.equipamento}</Text>
            <Text>Quantidade: {item.quantidade}</Text>
            <Text>Patrimônio: {item.patrimonio}</Text>
            <Text>Local: {item.localArmazenamento}</Text>
            <Text>Unidade: {item.unidade}</Text>

            <Button
                title="Saída"
                onPress={() => navigation.navigate('FormularioSaida', { equipamento: item })}
            />
        </View>
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <FlatList
            data={estoque}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
        />
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 10,
        margin: 10,
        backgroundColor: '#eee',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
});
