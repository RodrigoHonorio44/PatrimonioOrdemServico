import React from 'react';
import { View, Text, StyleSheet, Linking, Button } from 'react-native';
import Constants from 'expo-constants';

export default function Sobre() {
    const versaoApp = Constants.manifest.version;

    const handleContato = () => {
        Linking.openURL('rodrigohono21@gmail.com');  // Troque pelo seu e-mail
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Sobre o App</Text>

            <Text style={styles.texto}>
                Versão: 1.0.0<Text style={styles.bold}>{versaoApp}</Text>
            </Text>

            <Text style={styles.texto}>
                Criado por: <Text style={styles.bold}>Rodrigo da Silva Honório</Text>
            </Text>

            <Text style={styles.texto}>
                E-mail: <Text style={styles.link}>rodrigohono21@gmail.com</Text>
            </Text>
            <Text style={styles.texto}>
                Linkedin: <Text style={styles.link}>https://www.linkedin.com/in/rodrigo-s-hon%C3%B3rio/</Text>
            </Text>

            <Button title="Entrar em contato" onPress={handleContato} />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    texto: {
        fontSize: 16,
        marginBottom: 10,
    },
    bold: {
        fontWeight: 'bold',
    },
    link: {
        color: 'blue',
    },
});
