import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import { styles } from '../styles/EntregaDeEquipamentoStyles';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import gerarPdfUnidade from '../components/GerarPdfDevolucaoUnidade';

export default function FormularioUnidade({ dadosFormulario, setDadosFormulario, tipoLocal }) {
    const navigation = useNavigation();
    const [formularioValido, setFormularioValido] = useState(false);

    const handleChange = (campo, valor) => {
        setDadosFormulario(prev => ({ ...prev, [campo]: valor }));
    };

    useEffect(() => {
        const {
            setor,
            numeroPatrimonio,
            descricaoEquipamento,
            motivo,
            nomeTecnico,
            nomeResponsavel,
            unidade,
            assinaturaTecnico,
            assinaturaCliente
        } = dadosFormulario;

        setFormularioValido(
            setor &&
            numeroPatrimonio &&
            descricaoEquipamento &&
            motivo &&
            nomeTecnico &&
            nomeResponsavel &&
            unidade &&
            assinaturaTecnico &&
            assinaturaCliente
        );
    }, [dadosFormulario]);

    useEffect(() => {
        if (tipoLocal) {
            setDadosFormulario(prev => ({ ...prev, unidade: tipoLocal }));
        }
    }, [tipoLocal]);

    const handleAssinaturaTecnico = () => {
        navigation.navigate('Assinatura', {
            onSave: (signature) => {
                setDadosFormulario(prev => ({ ...prev, assinaturaTecnico: signature }));
            }
        });
    };

    const handleAssinaturaCliente = () => {
        navigation.navigate('Assinatura', {
            onSave: (signature) => {
                setDadosFormulario(prev => ({ ...prev, assinaturaCliente: signature }));
            }
        });
    };

    const salvarDadosNoFirestore = async () => {
        try {
            const devolucaoUnidadeRef = collection(db, "devolucao_unidade");

            await addDoc(devolucaoUnidadeRef, {
                data: Timestamp.fromDate(new Date()),
                setor: dadosFormulario.setor,
                numeroPatrimonio: dadosFormulario.numeroPatrimonio,
                descricaoEquipamento: dadosFormulario.descricaoEquipamento,
                motivo: dadosFormulario.motivo,
                nomeTecnico: dadosFormulario.nomeTecnico,
                nomeResponsavel: dadosFormulario.nomeResponsavel,
                unidade: dadosFormulario.unidade,
            });

            Alert.alert("Sucesso", "Dados salvos com sucesso!");
            gerarPdfUnidade(dadosFormulario);

            setDadosFormulario({
                setor: '',
                numeroPatrimonio: '',
                descricaoEquipamento: '',
                motivo: '',
                nomeTecnico: '',
                nomeResponsavel: '',
                assinaturaTecnico: '',
                assinaturaCliente: '',
                unidade: tipoLocal || '',
            });

        } catch (e) {
            console.error("Erro ao salvar:", e);
            Alert.alert("Erro", "Não foi possível salvar os dados.");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Nome do Responsável"
                placeholderTextColor="#999"
                onChangeText={(text) => handleChange('nomeResponsavel', text)}
                value={dadosFormulario.nomeResponsavel || ''}
            />
            <TextInput
                style={styles.input}
                placeholder="Setor"
                placeholderTextColor="#999"
                onChangeText={(text) => handleChange('setor', text)}
                value={dadosFormulario.setor || ''}
            />
            <TextInput
                style={styles.input}
                placeholder="Descrição do Equipamento"
                placeholderTextColor="#999"
                onChangeText={(text) => handleChange('descricaoEquipamento', text)}
                value={dadosFormulario.descricaoEquipamento || ''}
            />
            <TextInput
                style={styles.input}
                placeholder="Número do Patrimônio"
                placeholderTextColor="#999"
                onChangeText={(text) => handleChange('numeroPatrimonio', text)}
                value={dadosFormulario.numeroPatrimonio || ''}
            />
            <TextInput
                style={styles.input}
                placeholder="Motivo"
                placeholderTextColor="#999"
                onChangeText={(text) => handleChange('motivo', text)}
                value={dadosFormulario.motivo || ''}
            />
            <TextInput
                style={styles.input}
                placeholder="Nome do Técnico"
                placeholderTextColor="#999"
                onChangeText={(text) => handleChange('nomeTecnico', text)}
                value={dadosFormulario.nomeTecnico || ''}
            />

            {/* Texto da Unidade com cor preta para ficar visível */}
            <Text style={{ marginVertical: 10, fontWeight: 'bold', color: '#000' }}>
                Unidade: {dadosFormulario.unidade || tipoLocal || 'Não selecionada'}
            </Text>

            <TouchableOpacity style={styles.signatureButton} onPress={handleAssinaturaTecnico}>
                <Text style={styles.signatureButtonText}>
                    {dadosFormulario.assinaturaTecnico ? 'Assinatura do Técnico ✅' : 'Assinar Técnico'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signatureButton} onPress={handleAssinaturaCliente}>
                <Text style={styles.signatureButtonText}>
                    {dadosFormulario.assinaturaCliente ? 'Assinatura do Cliente ✅' : 'Assinar Cliente'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.saveButton1, { backgroundColor: formularioValido ? '#2196F3' : '#ccc' }]}
                onPress={salvarDadosNoFirestore}
                disabled={!formularioValido}
            >
                <Text style={styles.saveButtonText1}>Salvar e Gerar PDF</Text>
            </TouchableOpacity>
        </View>
    );
}
