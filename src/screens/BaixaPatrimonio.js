import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons'; // <- ícone adicionado
import { styles } from '../styles/BaixaPatrimonioStyles';

import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

import NavbarBottom from '../components/NavbarBottom';

export default function BaixaPatrimonio({ navigation }) {
    const [descricao, setDescricao] = useState('');
    const [patrimonio, setPatrimonio] = useState('');
    const [motivo, setMotivo] = useState('');
    const [localDescarte, setLocalDescarte] = useState('');
    const [unidade, setUnidade] = useState('');
    const [loading, setLoading] = useState(false);

    const isFormValid =
        descricao.trim() &&
        patrimonio.trim() &&
        motivo.trim() &&
        localDescarte.trim() &&
        unidade.trim();

    const handleBaixa = async () => {
        if (!isFormValid) {
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
                unidade,
                dataHora: Timestamp.now(),
            });

            Alert.alert('Sucesso', `Patrimônio ${patrimonio} dado baixa com sucesso!`);

            setDescricao('');
            setPatrimonio('');
            setMotivo('');
            setLocalDescarte('');
            setUnidade('');
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
            <View style={{ flex: 1, paddingBottom: 60 }}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <Text style={styles.titulo}>Baixa de Patrimônio</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Descrição do Equipamento"
                        placeholderTextColor="#999"
                        value={descricao}
                        onChangeText={setDescricao}
                        returnKeyType="next"
                        editable={!loading}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Número do Patrimônio"
                        placeholderTextColor="#999"
                        value={patrimonio}
                        onChangeText={setPatrimonio}
                        keyboardType="number-pad"
                        returnKeyType="next"
                        editable={!loading}
                    />

                    <TextInput
                        style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                        placeholder="Motivo da Baixa"
                        placeholderTextColor="#999"
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
                        placeholderTextColor="#999"
                        value={localDescarte}
                        onChangeText={setLocalDescarte}
                        returnKeyType="next"
                        editable={!loading}
                    />

                    {/* Picker com estilo personalizado e ícone */}
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={unidade}
                            onValueChange={(itemValue) => setUnidade(itemValue)}
                            enabled={!loading}
                            style={styles.picker}
                            dropdownIconColor="transparent"
                        >
                            <Picker.Item label="Selecione Hospital/UPA" value="" />
                            <Picker.Item label="Hospital Conde" value="Hospital Conde" />
                            <Picker.Item label="UPA Inoã" value="UPA Inoã" />
                            <Picker.Item label="UPA Santa Rita" value="UPA Santa Rita" />
                            <Picker.Item label="SAMU Ponta Negra" value="SAMU Ponta Negra" />
                            <Picker.Item label="SAMU Barroco" value="SAMU Barroco" />
                        </Picker>
                        <Icon
                            name="arrow-drop-down"
                            size={28}
                            color="#666"
                            style={styles.pickerIcon}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.saveButton, (!isFormValid || loading) && { opacity: 0.6 }]}
                        onPress={handleBaixa}
                        disabled={!isFormValid || loading}
                    >
                        <Text style={styles.saveButtonText}>
                            {loading ? 'Salvando...' : 'Confirmar Baixa'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <NavbarBottom navigation={navigation} />
        </KeyboardAvoidingView>
    );
}
