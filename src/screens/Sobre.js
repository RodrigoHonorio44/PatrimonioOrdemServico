import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, Alert, SafeAreaView, Image, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';

const EMAIL = 'rodrigohono21@gmail.com';
const LINKEDIN_URL = 'https://www.linkedin.com/in/rodrigo-s-hon%C3%B3rio/';

// Importando a imagem logo.png da pasta assets
const logo = require('../../assets/logo.png');

function LinkText({ onPress, children }) {
    return (
        <Text
            style={styles.link}
            onPress={onPress}
            accessibilityRole="link"
            accessibilityHint={`Abrir ${children}`}
        >
            {children}
        </Text>
    );
}

export default function Sobre() {
    const navigation = useNavigation();
    const versaoApp = Constants.expoConfig?.version || '1.0.0';

    async function openLink(url) {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert('Erro', 'Não foi possível abrir o link.');
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                {/* Imagem do logo */}
                <Image source={logo} style={styles.logo} resizeMode="contain" />

                <Text style={styles.titulo}>Sobre o App</Text>

                <Text style={styles.texto}>
                    Versão: <Text style={styles.bold}>{versaoApp}</Text>
                </Text>

                <Text style={styles.texto}>
                    Criado por: <Text style={styles.bold}>Rodrigo da Silva Honório</Text>
                </Text>

                <Text style={styles.texto}>
                    E-mail: <LinkText onPress={() => openLink(`mailto:${EMAIL}`)}>{EMAIL}</LinkText>
                </Text>

                <Text style={styles.texto}>
                    Linkedin: <LinkText onPress={() => openLink(LINKEDIN_URL)}>{LINKEDIN_URL}</LinkText>
                </Text>

                <TouchableOpacity
                    style={styles.botao}
                    onPress={() => openLink(`mailto:${EMAIL}`)}
                    accessibilityRole="button"
                    accessibilityLabel="Entrar em contato por e-mail"
                    activeOpacity={0.7}
                >
                    <Text style={styles.botaoTexto}>Entrar em contato</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.botaoVoltar}
                    onPress={() => navigation.navigate('Home')}
                    accessibilityRole="button"
                    accessibilityLabel="Voltar para a tela inicial"
                    activeOpacity={0.7}
                >
                    <Text style={styles.botaoTexto}>Voltar para Home</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    texto: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
    },
    bold: {
        fontWeight: 'bold',
    },
    link: {
        color: '#1e90ff',
        textDecorationLine: 'underline',
    },
    botao: {
        marginTop: 20,
        backgroundColor: '#2196F3',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 5,
        minWidth: 200,
        alignItems: 'center',
    },
    botaoVoltar: {
        marginTop: 10,
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 5,
        minWidth: 200,
        alignItems: 'center',
    },
    botaoTexto: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
