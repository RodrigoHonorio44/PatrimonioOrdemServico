import React, { useEffect, useState } from 'react';
import { View, TextInput, Alert, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../styles/stylesSaida';

export default function FormularioSaida({ equipamentoSelecionado, onSaidaConcluida }) {
    const [equipamento, setEquipamento] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [patrimonio, setPatrimonio] = useState('');
    const [localDestino, setLocalDestino] = useState('');
    const [unidade, setUnidade] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (equipamentoSelecionado) {
            setEquipamento(equipamentoSelecionado.equipamento || '');
            setQuantidade('');
            setPatrimonio(equipamentoSelecionado.patrimonio || '');
            setLocalDestino('');
            setUnidade(equipamentoSelecionado.unidade || '');
        }
    }, [equipamentoSelecionado]);

    const handleRegistrarSaida = async () => {
        const quantidadeNum = parseInt(quantidade, 10);

        if (!equipamento || !quantidade || !patrimonio || !localDestino || !unidade) {
            Alert.alert('Atenção', 'Preencha todos os campos.');
            return;
        }
        if (quantidadeNum <= 0 || quantidadeNum > parseInt(equipamentoSelecionado.quantidade, 10)) {
            Alert.alert('Erro', 'Quantidade para saída inválida.');
            return;
        }

        setLoading(true);

        try {
            Alert.alert('Sucesso', 'Saída registrada com sucesso!');
            onSaidaConcluida();
        } catch (error) {
            Alert.alert('Erro', `Erro ao registrar saída: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Equipamento:</Text>
                <Text style={styles.infoValue}>{equipamento}</Text>
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Quantidade disponível:</Text>
                <Text style={styles.infoValue}>{String(equipamentoSelecionado?.quantidade || '0')}</Text>
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Patrimônio:</Text>
                <Text style={styles.infoValue}>{patrimonio}</Text>
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Local Armazenado:</Text>
                <Text style={styles.infoValue}>{equipamentoSelecionado?.localArmazenamento || ''}</Text>
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Unidade:</Text>
                <Text style={styles.infoValue}>{unidade}</Text>
            </View>

            <Text style={styles.label}>Quantidade para saída</Text>
            <TextInput
                placeholder="Quantidade para saída"
                keyboardType="numeric"
                value={quantidade}
                onChangeText={setQuantidade}
                style={styles.input}
            />

            <Text style={styles.label}>Número do Patrimônio</Text>
            <TextInput
                placeholder="Número do Patrimônio"
                value={patrimonio}
                onChangeText={setPatrimonio}
                style={styles.input}
            />

            <Text style={styles.label}>Local de Destino</Text>
            <TextInput
                placeholder="Local de Destino"
                value={localDestino}
                onChangeText={setLocalDestino}
                style={styles.input}
            />

            <Text style={styles.label}>Unidade</Text>
            <View style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 8,
                backgroundColor: '#fafafa',
                marginBottom: 20,
                overflow: 'hidden'
            }}>
                <Picker
                    selectedValue={unidade}
                    onValueChange={setUnidade}
                    style={{ height: 50 }}
                >
                    <Picker.Item label="Selecione a Unidade" value="" />
                    <Picker.Item label="Hospital Conde" value="Hospital Conde" />
                    <Picker.Item label="UPA de Inoã" value="UPA de Inoã" />
                    <Picker.Item label="UPA Santa Rita" value="UPA Santa Rita" />
                    <Picker.Item label="Samu Barroco" value="Samu Barroco" />
                    <Picker.Item label="Samu Ponta Negra" value="Samu Ponta Negra" />
                </Picker>
            </View>

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleRegistrarSaida}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Registrando...' : 'Registrar Saída'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
