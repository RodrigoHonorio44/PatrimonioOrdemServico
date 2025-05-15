import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import { styles } from '../styles/EntregaDeEquipamentoStyles';
import { useNavigation } from '@react-navigation/native';
import { db } from '../config/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { TextInputMask } from 'react-native-masked-text'; // Importando a máscara
import gerarPdfResidencia from '../components/GerarPdfResidencia';

export default function FormularioResidencia({ dadosFormulario, setDadosFormulario }) {
    const navigation = useNavigation();
    const [formularioValido, setFormularioValido] = useState(false);

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

        if (
            nomePaciente &&
            endereco &&
            telefone &&
            descricaoEquipamento &&
            numeroPatrimonio &&
            nomeTecnico &&
            nomeResponsavel &&
            assinaturaTecnico &&
            assinaturaCliente
        ) {
            setFormularioValido(true);
        } else {
            setFormularioValido(false);
        }
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

            console.log("Documento salvo com ID:", docRef.id);
            Alert.alert("Sucesso", "Dados salvos com sucesso!");

            gerarPdfResidencia(dadosFormulario);

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
            Alert.alert("Erro ao salvar os dados!");
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
                    maskType: 'BRL',
                    withDDD: true,
                    dddMask: '(99)'
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
                disabled={!formularioValido}
            >
                <Text style={styles.saveButtonText}>Salvar e Gerar PDF</Text>
            </TouchableOpacity>
        </View>
    );
}
