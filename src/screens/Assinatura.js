// src/screens/Assinatura.js
import React from 'react';
import { View } from 'react-native';
import Signature from 'react-native-signature-canvas';

export default function Assinatura({ navigation, route }) {
    const { onSave } = route.params;

    const handleOK = (signature) => {
        onSave(signature); // salva a assinatura na tela anterior
        navigation.goBack();
    };

    return (
        <View style={{ flex: 1 }}>
            <Signature
                onOK={handleOK}
                descriptionText="Assine abaixo"
                clearText="Limpar"
                confirmText="Salvar"
                webStyle={`.m-signature-pad--footer {display: flex; justify-content: space-between;}`}
            />
        </View>
    );
}
