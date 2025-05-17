import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import FormularioEntrada from '../components/FormularioEntrada';
import FormularioSaida from '../components/FormularioSaida';
import ListaMovimentacoes from '../components/ListaMovimentacoes';
import NavbarBottom from '../components/NavbarBottom';
import styles from '../styles/EstoqueStyles';

export default function Estoque() {
    const [tipoMovimentacao, setTipoMovimentacao] = useState('entrada');
    const [mostrarEstoque, setMostrarEstoque] = useState(false);
    const [equipamento, setEquipamento] = useState('');
    const [quantidade, setQuantidade] = useState('');

    return (
        <View style={styles.container}>
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

            {!mostrarEstoque ? (
                <>
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
                </>
            ) : (
                <>
                    <Text style={styles.title}>Estoque Atual</Text>
                    <ListaMovimentacoes />
                </>
            )}

            <NavbarBottom />
        </View>
    );
}
