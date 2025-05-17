import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import FormularioEntrada from '../components/FormularioEntrada';
import FormularioSaida from '../components/FormularioSaida';
import ListaEstoqueAtual from '../components/ListaMovimentacoes'; // baseado no seu código
import NavbarBottom from '../components/NavbarBottom';
import styles from '../styles/EstoqueStyles';

export default function Estoque() {
    const [tipoMovimentacao, setTipoMovimentacao] = useState('entrada');
    const [mostrarEstoque, setMostrarEstoque] = useState(false);
    const [equipamento, setEquipamento] = useState('');
    const [quantidade, setQuantidade] = useState('');

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                {/* Botões de seleção */}
                <View style={styles.selector}>
                    <Button
                        title="Entrada"
                        onPress={() => {
                            setTipoMovimentacao('entrada');
                            setMostrarEstoque(false);
                        }}
                        color={tipoMovimentacao === 'entrada' ? 'green' : 'gray'}
                    />
                    <Button
                        title="Saída"
                        onPress={() => {
                            setTipoMovimentacao('saida');
                            setMostrarEstoque(false);
                        }}
                        color={tipoMovimentacao === 'saida' ? 'red' : 'gray'}
                    />
                    <Button
                        title="Estoque Atual"
                        onPress={() => setMostrarEstoque(true)}
                        color={mostrarEstoque ? 'blue' : 'gray'}
                    />
                </View>

                {/* Conteúdo principal */}
                {!mostrarEstoque ? (
                    // Usa ScrollView só para os formulários
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>
                            {tipoMovimentacao === 'entrada' ? 'Formulário de Entrada' : 'Formulário de Saída'}
                        </Text>

                        {tipoMovimentacao === 'entrada' ? (
                            <FormularioEntrada
                                equipamento={equipamento}
                                setEquipamento={setEquipamento}
                                quantidade={quantidade}
                                setQuantidade={setQuantidade}
                            />
                        ) : (
                            <FormularioSaida
                                equipamento={equipamento}
                                setEquipamento={setEquipamento}
                                quantidade={quantidade}
                                setQuantidade={setQuantidade}
                            />
                        )}
                    </View>
                ) : (
                    // Para mostrar a lista, SEM ScrollView externo (pois a lista já deve usar FlatList)
                    <View style={{ flex: 1 }}>
                        <ListaEstoqueAtual />
                    </View>
                )}
            </View>

            <NavbarBottom style={styles.navbar} />
        </View>
    );
}
