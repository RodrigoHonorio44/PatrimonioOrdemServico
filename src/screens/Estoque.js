import React, { useEffect, useState } from 'react';
import { View, Button, Text, FlatList, ActivityIndicator } from 'react-native';
import styles from '../styles/EstoqueStyles';
import FormularioEntrada from '../components/FormularioEntrada';
import FormularioSaida from '../components/FormularioSaida';
import NavbarBottom from '../components/NavbarBottom'; // Importando NavbarBottom
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export default function Estoque() {
    const [tela, setTela] = useState('entrada');
    const [equipamento, setEquipamento] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [estoque, setEstoque] = useState([]);
    const [loading, setLoading] = useState(false);
    const [itemSelecionado, setItemSelecionado] = useState(null);

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
                const idRastreio =
                    mov.idRastreio || `${mov.equipamento}-${mov.patrimonio}-${mov.localArmazenamento}-${mov.unidade}`;

                if (!estoqueMap[idRastreio]) {
                    estoqueMap[idRastreio] = {
                        idRastreio: idRastreio,
                        equipamento: mov.equipamento,
                        patrimonio: mov.patrimonio,
                        localArmazenamento: mov.localArmazenamento,
                        unidade: mov.unidade,
                        quantidade: 0,
                    };
                }

                if (mov.tipo === 'entrada') {
                    estoqueMap[idRastreio].quantidade += mov.quantidade;
                } else if (mov.tipo === 'saida') {
                    estoqueMap[idRastreio].quantidade -= mov.quantidade;
                }
            });

            const estoqueArray = Object.values(estoqueMap).filter((item) => item.quantidade > 0);
            setEstoque(estoqueArray);
        } catch (error) {
            console.error('Erro ao carregar estoque:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tela === 'estoque') {
            carregarEstoqueAtual();
        }
    }, [tela]);

    const renderEstoqueItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.text}>
                <Text style={{ fontWeight: 'bold' }}>Equipamento:</Text> {item.equipamento}
            </Text>
            <Text style={styles.text}>
                <Text style={{ fontWeight: 'bold' }}>Quantidade:</Text> {item.quantidade}
            </Text>
            <Text style={styles.text}>
                <Text style={{ fontWeight: 'bold' }}>Patrimônio:</Text> {item.patrimonio}
            </Text>
            <Text style={styles.text}>
                <Text style={{ fontWeight: 'bold' }}>Local:</Text> {item.localArmazenamento}
            </Text>
            <Text style={styles.text}>
                <Text style={{ fontWeight: 'bold' }}>Unidade:</Text> {item.unidade}
            </Text>

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
                    color={tela === 'saida' ? '#d9534f' : 'gray'}
                    disabled={!itemSelecionado}
                />
            </View>

            <View style={styles.conteudo}>
                {tela === 'entrada' && (
                    <FormularioEntrada
                        equipamento={equipamento}
                        setEquipamento={setEquipamento}
                        quantidade={quantidade}
                        setQuantidade={setQuantidade}
                        onEntradaConcluida={() => {
                            setTela('estoque');
                            carregarEstoqueAtual();
                        }}
                    />
                )}

                {tela === 'estoque' &&
                    (loading ? (
                        <ActivityIndicator size="large" color="blue" />
                    ) : estoque.length === 0 ? (
                        <Text>Nenhum equipamento em estoque</Text>
                    ) : (
                        <FlatList data={estoque} keyExtractor={(item) => item.idRastreio} renderItem={renderEstoqueItem} />
                    ))}

                {tela === 'saida' &&
                    (itemSelecionado ? (
                        <FormularioSaida
                            equipamentoSelecionado={itemSelecionado}
                            onSaidaConcluida={() => {
                                setItemSelecionado(null);
                                setTela('estoque');
                                carregarEstoqueAtual();
                            }}
                        />
                    ) : (
                        <Text>Selecione um equipamento na aba Estoque Atual para dar baixa.</Text>
                    ))}
            </View>
            <View style={styles.navbar}>
                <NavbarBottom tela={tela} setTela={setTela} itemSelecionado={itemSelecionado} />
            </View>
        </View>
    );
}
