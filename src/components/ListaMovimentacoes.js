import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export default function ListaEstoqueAtual({ onSelecionarParaSaida }) {
    const [estoqueAtual, setEstoqueAtual] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'movimentacoes'), (snapshot) => {
            const dados = {};

            snapshot.forEach((doc) => {
                const mov = doc.data();
                const key = `${mov.equipamento}_${mov.localArmazenamento}`;
                const quantidade = parseInt(mov.quantidade);

                if (!dados[key]) {
                    dados[key] = {
                        equipamento: mov.equipamento,
                        local: mov.localArmazenamento,
                        quantidade: 0,
                    };
                }

                if (mov.tipo === 'entrada') {
                    dados[key].quantidade += quantidade;
                } else if (mov.tipo === 'saida') {
                    dados[key].quantidade -= quantidade;
                }
            });

            const resultado = Object.values(dados).filter((item) => item.quantidade > 0);
            setEstoqueAtual(resultado);
        });

        return () => unsubscribe();
    }, []);

    return (
        <View>
            {estoqueAtual.length === 0 ? (
                <Text style={styles.empty}>Estoque vazio</Text>
            ) : (
                <FlatList
                    data={estoqueAtual}
                    keyExtractor={(item, index) => `${item.equipamento}_${index}`}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text style={styles.title}>{item.equipamento}</Text>
                            <Text>Quantidade: {item.quantidade}</Text>
                            <Text>Local: {item.local}</Text>
                            <Button
                                title="Saída"
                                color="red"
                                onPress={() => onSelecionarParaSaida({ equipamento: item.equipamento, local: item.local })}
                            />
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#f1f1f1',
        padding: 12,
        marginBottom: 10,
        borderRadius: 8,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    empty: {
        textAlign: 'center',
        marginTop: 20,
        fontStyle: 'italic',
    },
});
