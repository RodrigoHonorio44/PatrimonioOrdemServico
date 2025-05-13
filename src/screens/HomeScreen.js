// src/screens/HomeScreen.js
import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles/HomeScreenStyles'; // Importando os estilos

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Bem-vindo à Home!</Text>
        </View>
    );
}
