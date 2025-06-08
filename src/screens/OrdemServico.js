import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    Modal,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Sharing from 'expo-sharing';
import Signature from 'react-native-signature-canvas';
import { useNavigation } from '@react-navigation/native';

import styles from '../styles/OrdemServicosStyles';
import GerarPDF from '../components/GerarPDF';
import NavbarBottom from '../components/NavbarBottom';

import { db } from '../config/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function OrdemServico() {
    const navigation = useNavigation();

    const [dataAtual] = useState(new Date().toLocaleDateString());
    const [nomeResponsavel, setNomeResponsavel] = useState('');
    const [setor, setSetor] = useState('');
    const [descricao, setDescricao] = useState('');
    const [patrimonio, setPatrimonio] = useState('');
    const [servico, setServico] = useState('');
    const [nomeTecnico, setNomeTecnico] = useState('');
    const [unidade, setUnidade] = useState('Hospital Conde');

    const [showAssinaturaTecnico, setShowAssinaturaTecnico] = useState(false);
    const [showAssinaturaCliente, setShowAssinaturaCliente] = useState(false);

    const [assinaturaTecnico, setAssinaturaTecnico] = useState(null);
    const [assinaturaCliente, setAssinaturaCliente] = useState(null);

    const [loading, setLoading] = useState(false);

    const signatureRefTecnico = useRef();
    const signatureRefCliente = useRef();

    const handleOKTecnico = (signature) => {
        setAssinaturaTecnico(signature);
        setShowAssinaturaTecnico(false);
        Alert.alert('Assinatura salva', 'A assinatura do técnico foi registrada com sucesso!');
    };

    const handleOKCliente = (signature) => {
        setAssinaturaCliente(signature);
        setShowAssinaturaCliente(false);
        Alert.alert('Assinatura salva', 'A assinatura do cliente foi registrada com sucesso!');
    };

    const validarCampos = () => {
        if (!nomeResponsavel || !setor || !descricao || !patrimonio || !servico || !nomeTecnico) {
            Alert.alert('Erro', 'Todos os campos devem ser preenchidos');
            return false;
        }
        if (!assinaturaTecnico || !assinaturaCliente) {
            Alert.alert('Erro', 'Ambas as assinaturas devem ser feitas');
            return false;
        }
        return true;
    };

    const isButtonEnabled =
        nomeResponsavel &&
        setor &&
        descricao &&
        patrimonio &&
        servico &&
        nomeTecnico &&
        assinaturaTecnico &&
        assinaturaCliente &&
        !loading;

    const enviarParaFirestore = async () => {
        try {
            await addDoc(collection(db, 'ordensServico'), {
                data: dataAtual,
                unidade,
                nomeResponsavel,
                setor,
                descricao,
                patrimonio,
                servico,
                tecnico: nomeTecnico,
                assinaturaTecnico,
                assinaturaCliente,
                createdAt: new Date(),
            });
            Alert.alert('Sucesso', 'Dados enviados para o Firestore!');
        } catch (error) {
            console.error('Erro ao enviar para Firestore:', error);
            Alert.alert('Erro', 'Falha ao enviar os dados para o Firestore.');
        }
    };

    const resetarFormulario = () => {
        setNomeResponsavel('');
        setSetor('');
        setDescricao('');
        setPatrimonio('');
        setServico('');
        setNomeTecnico('');
        setAssinaturaTecnico(null);
        setAssinaturaCliente(null);
        setUnidade('Hospital Conde');

        if (signatureRefTecnico.current) {
            signatureRefTecnico.current.clearSignature();
        }
        if (signatureRefCliente.current) {
            signatureRefCliente.current.clearSignature();
        }
    };

    const handleGerarPDF = async () => {
        if (!validarCampos()) return;

        setLoading(true);

        try {
            const file = await GerarPDF({
                dataAtual,
                nomeResponsavel,
                setor,
                descricao,
                patrimonio,
                servico,
                nomeTecnico,
                unidade,
                assinaturaTecnico,
                assinaturaCliente,
            });

            if (!file) {
                Alert.alert('Erro', 'Não foi possível gerar o PDF.');
                setLoading(false);
                return;
            }

            await enviarParaFirestore();
            await Sharing.shareAsync(file.uri);
        } catch (error) {
            console.error('Erro ao processar:', error);
            Alert.alert('Erro', 'Ocorreu um erro durante o processo.');
        } finally {
            resetarFormulario();
            setLoading(false);
        }
    };

    const navItems = [
        { label: 'Home', route: 'Home', icon: 'home' },
        { label: 'Ordem Serviço', route: 'OrdemServico', icon: 'assignment' },
        { label: 'Entrega', route: 'EntregaDeEquipamento', icon: 'inventory' },
    ];

    const handleNavigate = (route) => {
        navigation.navigate(route);
    };

    const placeholderColor = '#999999'; // cinza claro
    const textColor = '#333333'; // cinza escuro

    const inputStyle = [styles.input, { color: textColor }];

    return (
        <View style={{ flex: 1 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={80}
            >
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <Text style={styles.date}>Data: {dataAtual}</Text>

                    <TextInput
                        style={inputStyle}
                        placeholderTextColor={placeholderColor}
                        placeholder="Nome do Responsável (Cliente)"
                        value={nomeResponsavel}
                        onChangeText={setNomeResponsavel}
                    />
                    <TextInput
                        style={inputStyle}
                        placeholderTextColor={placeholderColor}
                        placeholder="Setor"
                        value={setor}
                        onChangeText={setSetor}
                    />
                    <TextInput
                        style={inputStyle}
                        placeholderTextColor={placeholderColor}
                        placeholder="Descrição do Equipamento"
                        value={descricao}
                        onChangeText={setDescricao}
                    />
                    <TextInput
                        style={inputStyle}
                        placeholderTextColor={placeholderColor}
                        placeholder="Número do Patrimônio"
                        value={patrimonio}
                        onChangeText={setPatrimonio}
                    />
                    <TextInput
                        style={inputStyle}
                        placeholderTextColor={placeholderColor}
                        placeholder="Serviço Realizado"
                        value={servico}
                        onChangeText={setServico}
                    />
                    <TextInput
                        style={inputStyle}
                        placeholderTextColor={placeholderColor}
                        placeholder="Nome do Técnico"
                        value={nomeTecnico}
                        onChangeText={setNomeTecnico}
                    />

                    <Text style={styles.label}>Hospital / Unidade:</Text>
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={unidade}
                            onValueChange={(itemValue) => setUnidade(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Hospital Conde" value="Hospital Conde" />
                            <Picker.Item label="UPA Inoã" value="UPA Inoã" />
                            <Picker.Item label="UPA Santa Rita" value="UPA Santa Rita" />
                            <Picker.Item label="SAMU Barroco" value="SAMU Barroco" />
                            <Picker.Item label="SAMU Ponta Negra" value="SAMU Ponta Negra" />
                        </Picker>

                        <Icon
                            name="arrow-drop-down"
                            size={28}
                            color="#666"
                            style={styles.pickerIcon}
                        />
                    </View>
                    <TouchableOpacity
                        style={[styles.button, styles.signatureButton]}
                        onPress={() => setShowAssinaturaTecnico(true)}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {assinaturaTecnico ? 'Assinatura do Técnico Salva' : 'Assinar Técnico'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.signatureButton]}
                        onPress={() => setShowAssinaturaCliente(true)}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {assinaturaCliente ? 'Assinatura do Cliente Salva' : 'Assinar Cliente'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.button,
                            isButtonEnabled ? styles.buttonEnabled : styles.buttonDisabled,
                        ]}
                        onPress={handleGerarPDF}
                        disabled={!isButtonEnabled}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Gerar PDF e Enviar por WhatsApp</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>

            <Modal visible={showAssinaturaTecnico} animationType="slide">
                <Signature
                    ref={signatureRefTecnico}
                    onOK={handleOKTecnico}
                    onEmpty={() =>
                        Alert.alert('Assinatura em branco', 'Por favor, faça a assinatura do Técnico')
                    }
                    descriptionText="Assine aqui (Técnico)"
                    clearText="Limpar"
                    confirmText="Salvar"
                    webStyle={styles.signatureWebStyle}
                />
                <TouchableOpacity
                    onPress={() => setShowAssinaturaTecnico(false)}
                    style={styles.closeButton}
                >
                    <Text style={styles.closeButtonText}>Fechar</Text>
                </TouchableOpacity>
            </Modal>

            <Modal visible={showAssinaturaCliente} animationType="slide">
                <Signature
                    ref={signatureRefCliente}
                    onOK={handleOKCliente}
                    onEmpty={() =>
                        Alert.alert('Assinatura em branco', 'Por favor, faça a assinatura do Cliente')
                    }
                    descriptionText="Assine aqui (Cliente)"
                    clearText="Limpar"
                    confirmText="Salvar"
                    webStyle={styles.signatureWebStyle}
                />
                <TouchableOpacity
                    onPress={() => setShowAssinaturaCliente(false)}
                    style={styles.closeButton}
                >
                    <Text style={styles.closeButtonText}>Fechar</Text>
                </TouchableOpacity>
            </Modal>

            <NavbarBottom navItems={navItems} onNavigate={handleNavigate} />
        </View>
    );
}
