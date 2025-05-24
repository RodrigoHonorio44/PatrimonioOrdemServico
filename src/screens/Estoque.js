import React, { useEffect, useState } from 'react';
import { View, Button, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import styles from '../styles/EstoqueStyles';
import FormularioEntrada from '../components/FormularioEntrada';
import FormularioSaida from '../components/FormularioSaida'; // vou assumir que já tem esse componente
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export default function Estoque() {
    const [tela, setTela] = useState('entrada');
    const [equipamento, setEquipamento] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [estoque, setEstoque] = useState([]);
    const [loading, setLoading] = useState(false);
    const [itemSelecionado, setItemSelecionado] = useState(null); // equipamento selecionado para saída

    // Função para buscar e consolidar estoque atual
    const carregarEstoqueAtual = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'movimentacoes'));
            const movimentacoes = [];

            querySnapshot.forEach((doc) => {
                movimentacoes.push(doc.data());
            });

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

            // Filtra só os que tem quantidade positiva
            const estoqueArray = Object.values(estoqueMap).filter(item => item.quantidade > 0);
            setEstoque(estoqueArray);
        } catch (error) {
            console.error('Erro ao carregar estoque:', error);
        } finally {
            setLoading(false);
        }
    };

    // Quando mudar para a aba estoque, carrega os dados
    useEffect(() => {
        if (tela === 'estoque') {
            carregarEstoqueAtual();
        }
    }, [tela]);

    // Renderiza os cards do estoque
    const renderEstoqueItem = ({ item }) => (
        <View style={localStyles.card}>
            <Text style={localStyles.text}><Text style={{ fontWeight: 'bold' }}>Equipamento:</Text> {item.equipamento}</Text>
            <Text style={localStyles.text}><Text style={{ fontWeight: 'bold' }}>Quantidade:</Text> {item.quantidade}</Text>
            <Text style={localStyles.text}><Text style={{ fontWeight: 'bold' }}>Patrimônio:</Text> {item.patrimonio}</Text>
            <Text style={localStyles.text}><Text style={{ fontWeight: 'bold' }}>Local:</Text> {item.localArmazenamento}</Text>
            <Text style={localStyles.text}><Text style={{ fontWeight: 'bold' }}>Unidade:</Text> {item.unidade}</Text>

            <Button
                title="Saída"
                onPress={() => {
                    setItemSelecionado(item);
                    setTela('saida');
                }}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.botoes}>
                <Button
                    title="Entrada"
                    onPress={() => setTela('entrada')}
                    color={tela === 'entrada' ? 'green' : 'gray'}
                />
                <Button
                    title="Estoque Atual"
                    onPress={() => setTela('estoque')}
                    color={tela === 'estoque' ? 'blue' : 'gray'}
                />
                <Button
                    title="Saída"
                    onPress={() => setTela('saida')}
                    color={tela === 'saida' ? 'red' : 'gray'}
                    disabled={!itemSelecionado} // desabilita se não tiver item selecionado
                />
            </View>

            <View style={styles.conteudo}>
                {tela === 'entrada' && (
                    <FormularioEntrada
                        equipamento={equipamento}
                        setEquipamento={setEquipamento}
                        quantidade={quantidade}
                        setQuantidade={setQuantidade}
                    />
                )}

                {tela === 'estoque' && (
                    loading
                        ? <ActivityIndicator size="large" color="blue" />
                        : estoque.length === 0
                            ? <Text>Nenhum equipamento em estoque</Text>
                            : (
                                <FlatList
                                    data={estoque}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={renderEstoqueItem}
                                />
                            )
                )}

                {tela === 'saida' && (
                    itemSelecionado
                        ? <FormularioSaida
                            equipamentoSelecionado={itemSelecionado}
                            onSaidaConcluida={() => {
                                setItemSelecionado(null);
                                setTela('estoque');
                                carregarEstoqueAtual(); // atualiza estoque depois da saída
                            }}
                        />
                        : <Text>Selecione um equipamento na aba Estoque Atual para dar baixa.</Text>
                )}
            </View>
        </View>
    );
}

const localStyles = StyleSheet.create({
    card: {
        backgroundColor: '#f2f2f2',
        padding: 12,
        marginVertical: 8,
        borderRadius: 8,
        elevation: 2,
    },
    text: {
        marginBottom: 4,
    },
});
