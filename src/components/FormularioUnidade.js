import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import { styles } from '../styles/EntregaDeEquipamentoStyles';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import gerarPdfUnidade from '../components/GerarPdfUnidade';

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
            unidade,  // novo campo
        } = dadosFormulario;

        if (
            setor &&
            numeroPatrimonio &&
            descricaoEquipamento &&
            motivo &&
            nomeTecnico &&
            nomeResponsavel &&
            unidade &&           // valida unidade
            dadosFormulario.assinaturaTecnico &&
            dadosFormulario.assinaturaCliente
        ) {
            setFormularioValido(true);
        } else {
            setFormularioValido(false);
        }
    }, [dadosFormulario]);

    // Atualiza o tipoLocal para o campo unidade no estado
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
            const docRef = await addDoc(collection(db, "entregasUnidades"), {
                data: new Date().toLocaleDateString(),
                setor: dadosFormulario.setor,
                numeroPatrimonio: dadosFormulario.numeroPatrimonio,
                descricaoEquipamento: dadosFormulario.descricaoEquipamento,
                motivo: dadosFormulario.motivo,
                nomeTecnico: dadosFormulario.nomeTecnico,
                nomeResponsavel: dadosFormulario.nomeResponsavel,
                unidade: dadosFormulario.unidade,  // salva a unidade
            });

            console.log("Documento salvo com ID:", docRef.id);
            Alert.alert("Sucesso", "Dados salvos com sucesso!");

            gerarPdfUnidade(dadosFormulario); // Gera PDF com as assinaturas e unidade

            // Limpa o formulário (inclui unidade para resetar)
            setDadosFormulario({
                setor: '',
                numeroPatrimonio: '',
                descricaoEquipamento: '',
                motivo: '',
                nomeTecnico: '',
                nomeResponsavel: '',
                assinaturaTecnico: '',
                assinaturaCliente: '',
                unidade: '',
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
                onChangeText={(text) => handleChange('nomeResponsavel', text)}
                value={dadosFormulario.nomeResponsavel || ''}
            />
            <TextInput
                style={styles.input}
                placeholder="Setor"
                onChangeText={(text) => handleChange('setor', text)}
                value={dadosFormulario.setor || ''}
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
                placeholder="Motivo"
                onChangeText={(text) => handleChange('motivo', text)}
                value={dadosFormulario.motivo || ''}
            />
            <TextInput
                style={styles.input}
                placeholder="Nome do Técnico"
                onChangeText={(text) => handleChange('nomeTecnico', text)}
                value={dadosFormulario.nomeTecnico || ''}
            />

            {/* Exibindo unidade como campo somente leitura */}
            <Text style={{ marginVertical: 10, fontWeight: 'bold' }}>
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
