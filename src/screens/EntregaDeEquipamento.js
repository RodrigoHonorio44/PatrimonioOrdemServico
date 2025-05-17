import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { styles } from '../styles/EntregaDeEquipamentoStyles';
import FormularioResidencia from '../components/FormularioResidencia';
import FormularioUnidade from '../components/FormularioUnidade';
import NavbarBottom from '../components/NavbarBottom';
import gerarPdfResidencia from '../components/GerarPdfResidencia';
import gerarPdfUnidade from '../components/GerarPdfUnidade';
import { useNavigation } from '@react-navigation/native';

export default function EntregaDeEquipamento() {
    const navigation = useNavigation();

    const [tipoEntrega, setTipoEntrega] = useState('');
    const [dadosFormulario, setDadosFormulario] = useState({});

    const handleSubmit = () => {
        if (tipoEntrega === 'Residência') {
            gerarPdfResidencia(dadosFormulario);
            Alert.alert("Sucesso", "PDF de Residência gerado com sucesso!");
        } else if (tipoEntrega !== '') {
            gerarPdfUnidade({ ...dadosFormulario, tipoLocal: tipoEntrega });
            Alert.alert("Sucesso", "PDF de Unidade gerado com sucesso!");
        } else {
            Alert.alert("Erro", "Por favor, selecione o tipo de entrega.");
        }
    };

    const handleNavigate = (route) => {
        navigation.navigate(route);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // ajuste esse valor se tiver header fixo
        >
            {/* TouchableWithoutFeedback fecha o teclado ao clicar fora */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    <ScrollView
                        contentContainerStyle={[styles.container, { paddingBottom: 100 }]}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={styles.titulo}>Entrega de Equipamento</Text>

                        <Picker
                            selectedValue={tipoEntrega}
                            onValueChange={(itemValue) => setTipoEntrega(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Selecione o tipo" value="" />
                            <Picker.Item label="Residência" value="Residência" />
                            <Picker.Item label="Hospital Conde" value="Hospital Conde" />
                            <Picker.Item label="UPA Inoã" value="UPA Inoã" />
                            <Picker.Item label="UPA Santa Rita" value="UPA Santa Rita" />
                            <Picker.Item label="Samu Ponta Negra" value="Samu Ponta Negra" />
                            <Picker.Item label="Samu Barroco" value="Samu Barroco" />
                        </Picker>

                        {tipoEntrega === 'Residência' ? (
                            <FormularioResidencia
                                dadosFormulario={dadosFormulario}
                                setDadosFormulario={setDadosFormulario}
                                handleSubmit={handleSubmit}
                            />
                        ) : (
                            <FormularioUnidade
                                dadosFormulario={dadosFormulario}
                                setDadosFormulario={setDadosFormulario}
                                tipoLocal={tipoEntrega}
                                handleSubmit={handleSubmit}
                            />
                        )}
                    </ScrollView>

                    <NavbarBottom onNavigate={handleNavigate} />
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
