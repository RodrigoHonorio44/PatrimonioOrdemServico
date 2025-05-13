import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Print from 'expo-print'; // Utilizado para gerar o PDF
import * as Sharing from 'expo-sharing'; // Utilizado para compartilhar o PDF
import styles from '../styles/OrdemServicosStyles';
import Navbar from '../components/Navbar'; // Importando Navbar
import GerarPDF from '../components/GerarPDF'; // Importando o componente de PDF
import Signature from 'react-native-signature-canvas'; // Certifique-se de que está importado corretamente

// 🚀 Importando Firestore
import { db } from '../config/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function OrdemServico() {
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
        return true;
    };

    const isButtonEnabled = nomeResponsavel && setor && descricao && patrimonio && servico && nomeTecnico && assinaturaTecnico && assinaturaCliente;

    // ✅ Enviar dados para Firestore
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
                createdAt: new Date()
            });
            Alert.alert('Sucesso', 'Dados enviados para o Firestore!');
        } catch (error) {
            console.error('Erro ao enviar para Firestore:', error);
            Alert.alert('Erro', 'Falha ao enviar os dados para o Firestore.');
        }
    };

    const handleGerarPDF = async () => {
        if (!validarCampos()) return;

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

            if (file) {
                await Sharing.shareAsync(file.uri);
                await enviarParaFirestore(); // ⬅️ Envia para o Firestore após PDF
            } else {
                Alert.alert('Erro', 'Não foi possível gerar o PDF.');
            }
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao gerar o PDF.');
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <Navbar />
            <ScrollView contentContainerStyle={styles.container}>

                <Text style={styles.date}>Data: {dataAtual}</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nome do Responsável (Cliente)"
                    value={nomeResponsavel}
                    onChangeText={setNomeResponsavel}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Setor"
                    value={setor}
                    onChangeText={setSetor}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Descrição do Equipamento"
                    value={descricao}
                    onChangeText={setDescricao}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Número do Patrimônio"
                    value={patrimonio}
                    onChangeText={setPatrimonio}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Serviço Realizado"
                    value={servico}
                    onChangeText={setServico}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Nome do Técnico"
                    value={nomeTecnico}
                    onChangeText={setNomeTecnico}
                />

                <Text style={styles.label}>Hospital / Unidade:</Text>
                <View style={styles.pickerContainer}>
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
                </View>

                <TouchableOpacity style={[styles.button, styles.signatureButton]} onPress={() => setShowAssinaturaTecnico(true)}>
                    <Text style={styles.buttonText}>
                        {assinaturaTecnico ? 'Assinatura do Técnico Salva' : 'Assinar Técnico'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.signatureButton]} onPress={() => setShowAssinaturaCliente(true)}>
                    <Text style={styles.buttonText}>
                        {assinaturaCliente ? 'Assinatura do Cliente Salva' : 'Assinar Cliente'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, isButtonEnabled ? styles.buttonEnabled : styles.buttonDisabled]}
                    onPress={handleGerarPDF}
                    disabled={!isButtonEnabled}
                >
                    <Text style={styles.buttonText}>Gerar PDF e Enviar por WhatsApp</Text>
                </TouchableOpacity>
            </ScrollView>

            <Modal visible={showAssinaturaTecnico} animationType="slide">
                <Signature
                    ref={signatureRefTecnico}
                    onOK={handleOKTecnico}
                    onEmpty={() => Alert.alert('Assinatura em branco', 'Por favor, faça a assinatura do Técnico')}
                    descriptionText="Assine aqui"
                    clearText="Limpar"
                    confirmText="Confirmar"
                />
            </Modal>

            <Modal visible={showAssinaturaCliente} animationType="slide">
                <Signature
                    ref={signatureRefCliente}
                    onOK={handleOKCliente}
                    onEmpty={() => Alert.alert('Assinatura em branco', 'Por favor, faça a assinatura do Cliente')}
                    descriptionText="Assine aqui"
                    clearText="Limpar"
                    confirmText="Confirmar"
                />
            </Modal>


        </View>
    );
}
