import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import FormularioEntrada from '../components/FormularioEntrada';
import FormularioSaida from '../components/FormularioSaida';
import ListaEstoqueAtual from '../components/ListaMovimentacoes';
import NavbarBottom from '../components/NavbarBottom';
import styles from '../styles/EstoqueStyles';

export default function Estoque() {
    const [tipoMovimentacao, setTipoMovimentacao] = useState('entrada');
    const [mostrarEstoque, setMostrarEstoque] = useState(false);
    const [equipamento, setEquipamento] = useState('');
    const [local, setLocal] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [modoSaidaViaLista, setModoSaidaViaLista] = useState(false);

    const abrirFormularioSaidaComEquipamento = ({ equipamento, local }) => {
        setEquipamento(equipamento);
        setLocal(local);
        setQuantidade('');
        setTipoMovimentacao('saida');
        setMostrarEstoque(false);
        setModoSaidaViaLista(true);
    };

    const voltarAoEstoque = () => {
        setEquipamento('');
        setLocal('');
        setQuantidade('');
        setMostrarEstoque(true);
        setModoSaidaViaLista(false);
    };

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
                            setModoSaidaViaLista(false);
                            setEquipamento('');
                            setLocal('');
                            setQuantidade('');
                        }}
                        color={tipoMovimentacao === 'entrada' ? 'green' : 'gray'}
                    />
                    <Button
                        title="Saída"
                        onPress={() => {
                            setTipoMovimentacao('saida');
                            setMostrarEstoque(false);
                            setModoSaidaViaLista(false);
                            setEquipamento('');
                            setLocal('');
                            setQuantidade('');
                        }}
                        color={tipoMovimentacao === 'saida' ? 'red' : 'gray'}
                    />
                    <Button
                        title="Estoque Atual"
                        onPress={() => {
                            setMostrarEstoque(true);
                            setModoSaidaViaLista(false);
                            setEquipamento('');
                            setLocal('');
                            setQuantidade('');
                        }}
                        color={mostrarEstoque ? 'blue' : 'gray'}
                    />
                </View>

                {/* Conteúdo principal */}
                {!mostrarEstoque ? (
                    <View style={{ flex: 1 }}>
                        {/* Se estiver vindo do botão Saída na lista, mostra botão voltar */}
                        {modoSaidaViaLista && (
                            <Button title="Voltar ao Estoque Atual" onPress={voltarAoEstoque} />
                        )}

                        <Text style={styles.title}>
                            {tipoMovimentacao === 'entrada'
                                ? 'Formulário de Entrada'
                                : 'Formulário de Saída'}
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
                                local={local}
                                quantidade={quantidade}
                                setQuantidade={setQuantidade}
                            />
                        )}
                    </View>
                ) : (
                    <View style={{ flex: 1 }}>
                        <ListaEstoqueAtual onSelecionarParaSaida={abrirFormularioSaidaComEquipamento} />
                    </View>
                )}
            </View>

            <NavbarBottom style={styles.navbar} />
        </View>
    );
}
