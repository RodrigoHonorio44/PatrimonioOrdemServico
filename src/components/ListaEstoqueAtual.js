import React, { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    Text,
    Button,
    Alert,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { doc, collection, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // ajuste o caminho conforme seu projeto
import styles from '../styles/SeuEstilo'; // ajuste para seu arquivo de estilos

export default function FormularioSaida({
    equipamento,
    setEquipamento,
    local,
    quantidade,
    setQuantidade,
    estoqueAtual,
    quantidadeSaidaInicial = 0,
}) {
    const [patrimonio, setPatrimonio] = useState('');
    const [localArmazenamento, setLocalArmazenamento] = useState(local || '');
    const [localDestino, setLocalDestino] = useState('');
    const [unidade, setUnidade] = useState('');
    const [quantidadeSaida, setQuantidadeSaida] = useState(
        quantidadeSaidaInicial.toString()
    );
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        setLocalArmazenamento(local || '');
    }, [local]);

    useEffect(() => {
        setQuantidadeSaida(quantidadeSaidaInicial.toString());
    }, [quantidadeSaidaInicial]);

    const estoqueDisponivel =
        typeof estoqueAtual === 'number'
            ? estoqueAtual
            : typeof quantidade === 'number'
                ? quantidade
                : 0;

    // Função para validar e setar a quantidadeSaida (apenas números positivos)
    const handleQuantidadeSaidaChange = (text) => {
        // Remove tudo que não for número
        const somenteNumeros = text.replace(/[^0-9]/g, '');

        // Se vazio, aceita como ''
        if (somenteNumeros === '') {
            setQuantidadeSaida('');
            return;
        }

        // Converte para número para validar estoque
        const num = Number(somenteNumeros);

        // Limita ao estoque disponível
        if (num > estoqueDisponivel) {
            Alert.alert(
                'Quantidade inválida',
                `A quantidade não pode ser maior que o estoque disponível (${estoqueDisponivel}).`
            );
            setQuantidadeSaida(estoqueDisponivel.toString());
            return;
        }

        setQuantidadeSaida(somenteNumeros);
    };

    const handleRegistrar = async () => {
        if (
            !equipamento ||
            !quantidadeSaida ||
            !patrimonio.trim() ||
            !localArmazenamento.trim() ||
            !localDestino.trim() ||
            !unidade
        ) {
            Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
            return;
        }

        const quantidadeNum = Number(quantidadeSaida);

        if (isNaN(quantidadeNum) || quantidadeNum <= 0) {
            Alert.alert('Quantidade inválida', 'Informe uma quantidade válida para saída.');
            return;
        }

        if (quantidadeNum > estoqueDisponivel) {
            Alert.alert(
                'Quantidade inválida',
                `O estoque disponível é ${estoqueDisponivel}.`
            );
            return;
        }

        setCarregando(true);

        try {
            const docRef = doc(collection(db, 'movimentacoes'));
            const id = docRef.id;

            await setDoc(docRef, {
                id,
                tipo: 'saida',
                equipamento,
                quantidade: quantidadeNum,
                patrimonio,
                localArmazenamento,
                localDestino,
                unidade,
                dataHora: Timestamp.now(),
            });

            Alert.alert('Sucesso', 'Saída registrada com sucesso!');

            // Limpa os campos após envio
            setEquipamento('');
            setQuantidade('');
            setPatrimonio('');
            setLocalDestino('');
            setUnidade('');
            setQuantidadeSaida('');
        } catch (error) {
            Alert.alert('Erro', 'Erro ao registrar a saída: ' + error.message);
        } finally {
            setCarregando(false);
        }
    };

    const botaoDesabilitado =
        carregando ||
        !equipamento ||
        !quantidadeSaida ||
        Number(quantidadeSaida) <= 0 ||
        !patrimonio.trim() ||
        !localArmazenamento.trim() ||
        !localDestino.trim() ||
        !unidade;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <TextInput
                    style={styles.input}
                    placeholder="Nome do Equipamento"
                    value={equipamento}
                    editable={false}
                />

                <Text style={styles.label}>
                    Quantidade disponível: {estoqueDisponivel}
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Quantidade de Saída"
                    keyboardType="numeric"
                    value={quantidadeSaida}
                    onChangeText={handleQuantidadeSaidaChange}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Nº do Patrimônio"
                    value={patrimonio}
                    onChangeText={setPatrimonio}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Local de Armazenamento"
                    value={localArmazenamento}
                    editable={false}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Local de Destino"
                    value={localDestino}
                    onChangeText={setLocalDestino}
                />

                <Text style={styles.label}>Unidade</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={unidade}
                        onValueChange={setUnidade}
                        style={styles.picker}
                        accessibilityLabel="Selecionar unidade"
                    >
                        <Picker.Item label="Selecione a Unidade" value="" />
                        <Picker.Item label="Hospital Conde" value="Hospital Conde" />
                        <Picker.Item label="UPA de Inoã" value="UPA de Inoã" />
                        <Picker.Item label="UPA Santa Rita" value="UPA Santa Rita" />
                        <Picker.Item label="Samu Barroco" value="Samu Barroco" />
                        <Picker.Item label="Samu Ponta Negra" value="Samu Ponta Negra" />
                    </Picker>
                </View>

                <Text style={styles.dataHora}>
                    Data e Hora: {new Date().toLocaleString()}
                </Text>

                {carregando ? (
                    <ActivityIndicator size="large" color="#0000ff" style={{ marginVertical: 10 }} />
                ) : (
                    <Button
                        title="Registrar Saída"
                        onPress={handleRegistrar}
                        disabled={botaoDesabilitado}
                    />
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
