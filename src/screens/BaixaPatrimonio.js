import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { styles } from '../styles/BaixaPatrimonioStyles';

import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

import NavbarBottom from '../components/NavbarBottom';  // importe aqui

export default function BaixaPatrimonio({ navigation }) {
    const [descricao, setDescricao] = useState('');
    const [patrimonio, setPatrimonio] = useState('');
    const [motivo, setMotivo] = useState('');
    const [localDescarte, setLocalDescarte] = useState('');
    const [loading, setLoading] = useState(false);

    const handleBaixa = async () => {
        if (!descricao.trim() || !patrimonio.trim() || !motivo.trim() || !localDescarte.trim()) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, 'BaixaDePatrimonio'), {
                descricao,
                patrimonio,
                motivo,
                localDescarte,
                dataHora: Timestamp.now()
            });

            Alert.alert('Sucesso', `Patrimônio ${patrimonio} dado baixa com sucesso!`);
            setDescricao('');
            setPatrimonio('');
            setMotivo('');
            setLocalDescarte('');
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar a baixa. Tente novamente.');
            console.error('Erro ao salvar baixa:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            style={{ flex: 1 }}
        >
            <View style={{ flex: 1, paddingBottom: 60 /* espaço para navbar */ }}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <Text style={styles.titulo}>Baixa de Patrimônio</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Descrição do Equipamento"
                        value={descricao}
                        onChangeText={setDescricao}
                        returnKeyType="next"
                        editable={!loading}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Número do Patrimônio"
                        value={patrimonio}
                        onChangeText={setPatrimonio}
                        keyboardType="number-pad"
                        returnKeyType="next"
                        editable={!loading}
                    />

                    <TextInput
                        style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                        placeholder="Motivo da Baixa"
                        value={motivo}
                        onChangeText={setMotivo}
                        multiline
                        numberOfLines={3}
                        returnKeyType="next"
                        editable={!loading}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Local de Descarte"
                        value={localDescarte}
                        onChangeText={setLocalDescarte}
                        returnKeyType="done"
                        editable={!loading}
                    />

                    <TouchableOpacity
                        style={[styles.saveButton, loading && { opacity: 0.7 }]}
                        onPress={handleBaixa}
                        disabled={loading}
                    >
                        <Text style={styles.saveButtonText}>{loading ? 'Salvando...' : 'Confirmar Baixa'}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <NavbarBottom navigation={navigation} />
        </KeyboardAvoidingView>
    );
}
