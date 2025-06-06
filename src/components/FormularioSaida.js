import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, Button, Alert,
    ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import styles from '../styles/FormularioSaidaStyles';

export default function FormularioSaida({ equipamentoSelecionado, onSaidaConcluida }) {
    const {
        idRastreio,
        equipamento: equipamentoParam,
        quantidade: quantidadeEstoque,
        localArmazenamento,
        unidade: unidadeParam,
        patrimonio: patrimonioEntrada
    } = equipamentoSelecionado || {};

    const [quantidade, setQuantidade] = useState('');
    const [localDestino, setLocalDestino] = useState('');
    const [unidade, setUnidade] = useState(unidadeParam || '');
    const [patrimonio, setPatrimonio] = useState('');
    const [loading, setLoading] = useState(false);
    const [botaoHabilitado, setBotaoHabilitado] = useState(false);

    // Atualiza patrimônio quando equipamento mudar
    useEffect(() => {
        if (patrimonioEntrada) setPatrimonio(patrimonioEntrada);
    }, [patrimonioEntrada]);

    // Verifica se botão deve estar habilitado
    useEffect(() => {
        const qtdNumero = Number(quantidade);
        const podeHabilitar =
            quantidade !== '' &&
            qtdNumero > 0 &&
            qtdNumero <= quantidadeEstoque &&
            localDestino.trim() !== '' &&
            unidade.trim() !== '' &&
            patrimonio.trim() !== '';
        setBotaoHabilitado(podeHabilitar);
    }, [quantidade, localDestino, unidade, patrimonio, quantidadeEstoque]);

    // Só permite números no campo quantidade
    const handleQuantidadeChange = (valor) => {
        const somenteNumeros = valor.replace(/[^0-9]/g, '');
        setQuantidade(somenteNumeros);
    };

    const handleRegistrarSaida = async () => {
        const qtdNumero = Number(quantidade);

        if (!quantidade || qtdNumero <= 0) {
            Alert.alert('Erro', 'Informe uma quantidade válida para saída');
            return;
        }
        if (qtdNumero > quantidadeEstoque) {
            Alert.alert('Erro', 'Quantidade de saída maior que a disponível no estoque');
            return;
        }
        if (!localDestino.trim()) {
            Alert.alert('Erro', 'Informe o local de destino');
            return;
        }
        if (!unidade.trim()) {
            Alert.alert('Erro', 'Informe a unidade');
            return;
        }
        if (!patrimonio.trim()) {
            Alert.alert('Erro', 'Informe o número do patrimônio');
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, 'movimentacoes'), {
                tipo: 'saida',
                equipamento: equipamentoParam,
                quantidade: qtdNumero,
                patrimonio,
                localArmazenamento,
                localDestino,
                unidade,
                dataHora: serverTimestamp(),
                idRastreio,
            });

            Alert.alert('Sucesso', 'Saída registrada com sucesso!');

            // Resetar campos (decida se quer resetar unidade também)
            setQuantidade('');
            setLocalDestino('');
            setPatrimonio('');
            // setUnidade(''); // Opcional

            onSaidaConcluida();
        } catch (error) {
            Alert.alert('Erro', 'Falha ao registrar saída: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!equipamentoSelecionado) {
        return (
            <View style={styles.container}>
                <Text>Nenhum equipamento selecionado.</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.card}>
                    <Text style={styles.header}>Registrar Saída</Text>

                    <Text style={styles.label}>Equipamento:</Text>
                    <Text style={styles.value}>{equipamentoParam}</Text>

                    <Text style={styles.label}>Patrimônio de Entrada:</Text>
                    <Text style={styles.value}>{patrimonioEntrada}</Text>

                    <Text style={styles.label}>Quantidade em estoque:</Text>
                    <Text style={styles.value}>{quantidadeEstoque}</Text>

                    <Text style={styles.label}>Local Armazenado:</Text>
                    <Text style={styles.value}>{localArmazenamento}</Text>

                    <Text style={styles.label}>Unidade:</Text>
                    <Text style={styles.value}>{unidade}</Text>

                    <Text style={styles.label}>Quantidade para saída:</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={quantidade}
                        onChangeText={handleQuantidadeChange}
                        placeholder="Informe a quantidade"
                    />
                    {quantidade !== '' && Number(quantidade) > quantidadeEstoque && (
                        <Text style={styles.alerta}>
                            Quantidade maior que o estoque disponível!
                        </Text>
                    )}

                    <Text style={styles.label}>Local de destino:</Text>
                    <TextInput
                        style={styles.input}
                        value={localDestino}
                        onChangeText={setLocalDestino}
                        placeholder="Informe o local de destino"
                    />

                    <Text style={styles.label}>Número do Patrimônio:</Text>
                    <TextInput
                        style={styles.input}
                        value={patrimonio}
                        onChangeText={setPatrimonio}
                        placeholder="Informe o número do patrimônio"
                    />

                    <Text style={styles.label}>Unidade:</Text>
                    <Picker
                        selectedValue={unidade}
                        style={styles.input}
                        onValueChange={(itemValue) => setUnidade(itemValue)}
                    >
                        <Picker.Item label="Selecione a Unidade" value="" />
                        <Picker.Item label="Hospital Conde" value="Hospital Conde" />
                        <Picker.Item label="UPA de Inoã" value="UPA de Inoã" />
                        <Picker.Item label="UPA Santa Rita" value="UPA Santa Rita" />
                        <Picker.Item label="Samu Barroco" value="Samu Barroco" />
                        <Picker.Item label="Samu Ponta Negra" value="Samu Ponta Negra" />
                    </Picker>

                    {loading ? (
                        <ActivityIndicator size="large" color="#d9534f" />
                    ) : (
                        <View style={styles.botaoContainer}>
                            <Button
                                title="Registrar Saída"
                                onPress={handleRegistrarSaida}
                                color="#d9534f"
                                disabled={!botaoHabilitado}
                            />
                        </View>
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
