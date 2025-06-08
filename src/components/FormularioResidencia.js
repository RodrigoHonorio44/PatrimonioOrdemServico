import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import { styles } from '../styles/EntregaDeEquipamentoStyles';
import { useNavigation } from '@react-navigation/native';
import { db } from '../config/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import MaskInput from 'react-native-mask-input';
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
            assinaturaCliente,
        } = dadosFormulario;

        setFormularioValido(
            Boolean(
                nomePaciente &&
                endereco &&
                telefone &&
                descricaoEquipamento &&
                numeroPatrimonio &&
                nomeTecnico &&
                nomeResponsavel &&
                assinaturaTecnico &&
                assinaturaCliente
            )
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
            await addDoc(collection(db, "entregasResidencia"), {
                data: new Date().toLocaleDateString(),
                nomePaciente: dadosFormulario.nomePaciente,
                endereco: dadosFormulario.endereco,
                telefone: dadosFormulario.telefone,
                descricaoEquipamento: dadosFormulario.descricaoEquipamento,
                numeroPatrimonio: dadosFormulario.numeroPatrimonio,
                nomeTecnico: dadosFormulario.nomeTecnico,
                nomeResponsavel: dadosFormulario.nomeResponsavel,
                assinaturaTecnico: dadosFormulario.assinaturaTecnico,
                assinaturaCliente: dadosFormulario.assinaturaCliente,
            });

            Alert.alert("Sucesso", "Dados salvos com sucesso!");

            try {
                await gerarPdfResidencia(dadosFormulario);
            } catch (pdfError) {
                Alert.alert("Erro", "Falha ao gerar PDF.");
                console.error(pdfError);
            }

            setDadosFormulario({
                nomePaciente: '',
                endereco: '',
                telefone: '',
                descricaoEquipamento: '',
                numeroPatrimonio: '',
                nomeTecnico: '',
                nomeResponsavel: '',
                assinaturaTecnico: null,
                assinaturaCliente: null,
            });

        } catch (error) {
            console.error("Erro ao salvar:", error);
            Alert.alert("Erro", "Falha ao salvar os dados.");
        } finally {
            setIsSaving(false);
        }
    };

    // Exemplo de cor de texto e placeholder personalizada:
    const placeholderColor = '#999999'; // cinza claro
    const textColor = '#333333'; // cinza escuro

    return (
        <View style={styles.container}>
            <TextInput
                style={[styles.input, { color: textColor }]}
                placeholder="Nome do Paciente"
                placeholderTextColor={placeholderColor}
                onChangeText={text => handleChange('nomePaciente', text)}
                value={dadosFormulario.nomePaciente || ''}
            />
            <TextInput
                style={[styles.input, { color: textColor }]}
                placeholder="Endereço"
                placeholderTextColor={placeholderColor}
                onChangeText={text => handleChange('endereco', text)}
                value={dadosFormulario.endereco || ''}
            />

            <MaskInput
                style={styles.input}
                placeholder="(XX) XXXXX-XXXX"
                placeholderTextColor="#999"
                value={dadosFormulario.telefone || ''}
                onChangeText={(masked, unmasked) => handleChange('telefone', masked)}
                mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}

            />



            <TextInput
                style={[styles.input, { color: textColor }]}
                placeholder="Descrição do Equipamento"
                placeholderTextColor={placeholderColor}
                onChangeText={text => handleChange('descricaoEquipamento', text)}
                value={dadosFormulario.descricaoEquipamento || ''}
            />
            <TextInput
                style={[styles.input, { color: textColor }]}
                placeholder="Número do Patrimônio"
                placeholderTextColor={placeholderColor}
                onChangeText={text => handleChange('numeroPatrimonio', text)}
                value={dadosFormulario.numeroPatrimonio || ''}
            />
            <TextInput
                style={[styles.input, { color: textColor }]}
                placeholder="Nome do Técnico"
                placeholderTextColor={placeholderColor}
                onChangeText={text => handleChange('nomeTecnico', text)}
                value={dadosFormulario.nomeTecnico || ''}
            />
            <TextInput
                style={[styles.input, { color: textColor }]}
                placeholder="Nome do Responsável"
                placeholderTextColor={placeholderColor}
                onChangeText={text => handleChange('nomeResponsavel', text)}
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
