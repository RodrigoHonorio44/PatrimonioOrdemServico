import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

export default function FormularioSaida({
    equipamento,
    local,
    unidade,
    quantidade,
    onSubmit,
}) {
    const [quantidadeSaida, setQuantidadeSaida] = useState('');
    const [patrimonio, setPatrimonio] = useState('');
    const [localDestino, setLocalDestino] = useState('');
    const [dataHoraAtual, setDataHoraAtual] = useState('');
    const [quantidadeInvalida, setQuantidadeInvalida] = useState(false);

    // Estado interno para estoque disponível (quantidade)
    const [estoqueDisponivel, setEstoqueDisponivel] = useState(quantidade);

    // Atualiza estoqueDisponivel sempre que a prop quantidade mudar
    useEffect(() => {
        setEstoqueDisponivel(quantidade);
    }, [quantidade]);

    // Atualiza data e hora
    useEffect(() => {
        const atualizarDataHora = () => {
            const agora = new Date();
            const data = agora.toLocaleDateString();
            const hora = agora.toLocaleTimeString();
            setDataHoraAtual(`${data} - ${hora}`);
        };
        atualizarDataHora();
        const interval = setInterval(atualizarDataHora, 1000);
        return () => clearInterval(interval);
    }, []);

    const validarQuantidade = useCallback(() => {
        const qtd = parseInt(quantidadeSaida, 10);
        return !isNaN(qtd) && qtd > 0 && qtd <= estoqueDisponivel;
    }, [quantidadeSaida, estoqueDisponivel]);

    useEffect(() => {
        const valido = validarQuantidade();
        setQuantidadeInvalida(!valido && quantidadeSaida !== '');
    }, [validarQuantidade, quantidadeSaida]);

    const camposPreenchidos = useCallback(() =>
        patrimonio.trim() !== '' && localDestino.trim() !== ''
        , [patrimonio, localDestino]);

    const enviarSaida = useCallback(() => {
        if (!validarQuantidade()) {
            Alert.alert(
                'Quantidade inválida',
                `Informe uma quantidade entre 1 e ${estoqueDisponivel}`
            );
            return;
        }
        if (!camposPreenchidos()) {
            Alert.alert(
                'Campos obrigatórios',
                'Preencha o número do patrimônio e o local de destino.'
            );
            return;
        }

        onSubmit({
            equipamento,
            local,
            unidade,
            quantidade: parseInt(quantidadeSaida, 10),
            patrimonio: patrimonio.trim(),
            localDestino: localDestino.trim(),
            dataHora: dataHoraAtual,
            tipo: 'saida',
        });

        // Limpa campos após envio
        setQuantidadeSaida('');
        setPatrimonio('');
        setLocalDestino('');
        setQuantidadeInvalida(false);
    }, [validarQuantidade, camposPreenchidos, equipamento, local, unidade, quantidadeSaida, patrimonio, localDestino, dataHoraAtual, onSubmit]);

    const isFormValid = validarQuantidade() && camposPreenchidos();

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.header}>Registrar Saída</Text>

                <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>Equipamento:</Text>
                    <Text style={styles.infoValue}>{equipamento || '-'}</Text>
                </View>

                <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>Local atual:</Text>
                    <Text style={styles.infoValue}>{local || '-'}</Text>
                </View>

                <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>Unidade:</Text>
                    <Text style={styles.infoValue}>{unidade || '-'}</Text>
                </View>

                <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>Estoque disponível:</Text>
                    <Text style={styles.infoValue}>{estoqueDisponivel}</Text>
                </View>

                <Text style={styles.label}>Número do Patrimônio:</Text>
                <TextInput
                    style={styles.input}
                    value={patrimonio}
                    onChangeText={setPatrimonio}
                    placeholder="Digite o número do patrimônio"
                    placeholderTextColor="#999"
                    accessibilityLabel="Número do patrimônio"
                    autoCapitalize="characters"
                    autoCorrect={false}
                />

                <Text style={styles.label}>Local de Destino:</Text>
                <TextInput
                    style={styles.input}
                    value={localDestino}
                    onChangeText={setLocalDestino}
                    placeholder="Digite o local de destino"
                    placeholderTextColor="#999"
                    accessibilityLabel="Local de destino"
                    autoCapitalize="words"
                    autoCorrect={false}
                />

                <Text style={styles.label}>Quantidade para saída:</Text>
                <TextInput
                    style={[
                        styles.input,
                        quantidadeInvalida && styles.inputError
                    ]}
                    keyboardType="numeric"
                    value={quantidadeSaida}
                    onChangeText={setQuantidadeSaida}
                    placeholder="Digite a quantidade"
                    placeholderTextColor="#999"
                    accessibilityLabel="Quantidade para saída"
                />
                {quantidadeInvalida && (
                    <Text style={styles.errorText}>
                        Informe uma quantidade entre 1 e {estoqueDisponivel}.
                    </Text>
                )}

                <Text style={styles.dataHora}>Data/Hora atual: {dataHoraAtual}</Text>

                <TouchableOpacity
                    style={[styles.button, !isFormValid && styles.buttonDisabled]}
                    onPress={enviarSaida}
                    disabled={!isFormValid}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: !isFormValid }}
                    accessibilityLabel="Botão para registrar saída"
                >
                    <Text style={styles.buttonText}>Registrar Saída</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

// ... (mesmos estilos do código anterior)

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        margin: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        flexGrow: 1,
    },
    header: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 20,
        textAlign: 'center',
        color: '#d9534f',
    },
    infoBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    infoLabel: {
        fontWeight: '600',
        color: '#333',
    },
    infoValue: {
        fontWeight: '400',
        color: '#555',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        marginTop: 16,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#fafafa',
    },
    inputError: {
        borderColor: '#d9534f',
    },
    errorText: {
        color: '#d9534f',
        marginTop: 4,
        fontSize: 14,
    },
    dataHora: {
        marginTop: 20,
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    button: {
        marginTop: 16,
        backgroundColor: '#d9534f',
        paddingVertical: 14,
        borderRadius: 8,
    },
    buttonDisabled: {
        backgroundColor: '#f1a9a0',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 18,
        textAlign: 'center',
    },
});
