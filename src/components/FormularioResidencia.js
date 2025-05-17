import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import { styles } from '../styles/EntregaDeEquipamentoStyles';
import { useNavigation } from '@react-navigation/native';
import { db } from '../config/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { TextInputMask } from 'react-native-masked-text';
import gerarPdfResidencia from '../components/GerarPdfResidencia';

export default function FormularioResidencia({ dadosFormulario, setDadosFormulario }) {
    const navigation = useNavigation();
    const [formularioValido, setFormularioValido] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (campo, valor) => {
        setDadosFormulario(prev => ({ ...prev, [campo]: valor }));
    };

    useEffect(() => {
        const {
            nomePaciente,
            endereco,
            telefone,
            descricaoEquipamento,
            numeroPatrimonio,
            nomeTecnico,
            nomeResponsavel,
            assinaturaTecnico,
            assinaturaCliente
        } = dadosFormulario;

        setFormularioValido(
            nomePaciente &&
            endereco &&
            telefone &&
            descricaoEquipamento &&
            numeroPatrimonio &&
            nomeTecnico &&
            nomeResponsavel &&
            assinaturaTecnico &&
            assinaturaCliente
        );
    }, [dadosFormulario]);

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
        if (!formularioValido || isSaving) return;

        setIsSaving(true);
        try {
            const docRef = await addDoc(collection(db, "entregasResidencia"), {
                data: new Date().toLocaleDateString(),
                nomePaciente: dadosFormulario.nomePaciente,
                endereco: dadosFormulario.endereco,
                telefone: dadosFormulario.telefone,
                descricaoEquipamento: dadosFormulario.descricaoEquipamento,
                numeroPatrimonio: dadosFormulario.numeroPatrimonio,
                nomeTecnico: dadosFormulario.nomeTecnico,
                nomeResponsavel: dadosFormulario.nomeResponsavel
            });

            Alert.alert("Sucesso", "Dados salvos com sucesso!");

            // Gerar PDF com os dados antes de resetar
            try {
                await gerarPdfResidencia(dadosFormulario);
            } catch (pdfError) {
                Alert.alert("Erro", "Falha ao gerar PDF.");
                console.error(pdfError);
            }

            // Resetar formulário
            setDadosFormulario({
                nomePaciente: '',
                endereco: '',
                telefone: '',
                descricaoEquipamento: '',
                numeroPatrimonio: '',
                nomeTecnico: '',
                nomeResponsavel: '',
                assinaturaTecnico: null,
                assinaturaCliente: null
            });

        } catch (e) {
            console.error("Erro ao salvar:", e);
            Alert.alert("Erro", "Falha ao salvar os dados.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Nome do Paciente"
                onChangeText={(text) => handleChange('nomePaciente', text)}
                value={dadosFormulario.nomePaciente || ''}
            />
            <TextInput
                style={styles.input}
                placeholder="Endereço"
                onChangeText={(text) => handleChange('endereco', text)}
                value={dadosFormulario.endereco || ''}
            />
            <TextInputMask
                type={'cel-phone'}
                options={{
                    withDDD: true,
                    dddMask: '(99) '
                }}
                style={styles.input}
                placeholder="(XX) XXXXX-XXXX"
                value={dadosFormulario.telefone || ''}
                onChangeText={(text) => handleChange('telefone', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Descrição do Equipamento"
                onChangeText={(text) => handleChange('descricaoEquipamento', text)}
                value={dadosFormulario.descricaoEquipamento || ''}
            />
            <TextInput
                style={styles.input}
                placeholder="Número do Patrimônio"
                onChangeText={(text) => handleChange('numeroPatrimonio', text)}
                value={dadosFormulario.numeroPatrimonio || ''}
            />
            <TextInput
                style={styles.input}
                placeholder="Nome do Técnico"
                onChangeText={(text) => handleChange('nomeTecnico', text)}
                value={dadosFormulario.nomeTecnico || ''}
            />
            <TextInput
                style={styles.input}
                placeholder="Nome do Responsável"
                onChangeText={(text) => handleChange('nomeResponsavel', text)}
                value={dadosFormulario.nomeResponsavel || ''}
            />

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
                style={[styles.saveButton, { backgroundColor: formularioValido ? '#2196F3' : '#ccc' }]}
                onPress={salvarDadosNoFirestore}
                disabled={!formularioValido || isSaving}
            >
                <Text style={styles.saveButtonText}>
                    {isSaving ? 'Salvando...' : 'Salvar e Gerar PDF'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
