import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import { styles } from '../styles/EntregaDeEquipamentoStyles';
import { useNavigation } from '@react-navigation/native';
import { db } from '../config/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
// import { TextInputMask } from 'react-native-masked-text'; // removido
import MaskInput from 'react-native-mask-input';  // import novo
import gerarPdfResidencia from '../components/GerarPdfResidencia';

export default function FormularioResidencia({ dadosFormulario, setDadosFormulario }) {
    const navigation = useNavigation();
    const [formularioValido, setFormularioValido] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Atualiza o campo do formulário
    const handleChange = (campo, valor) => {
        setDadosFormulario(prev => ({ ...prev, [campo]: valor }));
    };

    // Verifica se o formulário está válido sempre que dadosFormulario mudar
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

    // Navega para tela de assinatura do Técnico
    const handleAssinaturaTecnico = () => {
        navigation.navigate('Assinatura', {
            onSave: (signature) => {
                setDadosFormulario(prev => ({ ...prev, assinaturaTecnico: signature }));
            }
        });
    };

    // Navega para tela de assinatura do Cliente
    const handleAssinaturaCliente = () => {
        navigation.navigate('Assinatura', {
            onSave: (signature) => {
                setDadosFormulario(prev => ({ ...prev, assinaturaCliente: signature }));
            }
        });
    };

    // Salva os dados no Firestore e gera o PDF
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

            // Gera PDF com os dados preenchidos
            try {
                await gerarPdfResidencia(dadosFormulario);
            } catch (pdfError) {
                Alert.alert("Erro", "Falha ao gerar PDF.");
                console.error(pdfError);
            }

            // Limpa o formulário após salvar e gerar PDF
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

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Nome do Paciente"
                onChangeText={text => handleChange('nomePaciente', text)}
                value={dadosFormulario.nomePaciente || ''}
            />
            <TextInput
                style={styles.input}
                placeholder="Endereço"
                onChangeText={text => handleChange('endereco', text)}
                value={dadosFormulario.endereco || ''}
            />

            <MaskInput
                style={styles.input}
                placeholder="(XX) XXXXX-XXXX"
                value={dadosFormulario.telefone || ''}
                onChangeText={(masked, unmasked) => handleChange('telefone', masked)}
                mask={[/\(\d/, /\d/, /\) /, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                keyboardType="phone-pad"
            />

            <TextInput
                style={styles.input}
                placeholder="Descrição do Equipamento"
                onChangeText={text => handleChange('descricaoEquipamento', text)}
                value={dadosFormulario.descricaoEquipamento || ''}
            />
            <TextInput
                style={styles.input}
                placeholder="Número do Patrimônio"
                onChangeText={text => handleChange('numeroPatrimonio', text)}
                value={dadosFormulario.numeroPatrimonio || ''}
            />
            <TextInput
                style={styles.input}
                placeholder="Nome do Técnico"
                onChangeText={text => handleChange('nomeTecnico', text)}
                value={dadosFormulario.nomeTecnico || ''}
            />
            <TextInput
                style={styles.input}
                placeholder="Nome do Responsável"
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
