// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, ImageBackground, SafeAreaView, ScrollView } from 'react-native';
import Navbar from '../components/Navbar'; // Importando a Navbar
import styles from '../styles/HomeScreenStyles'; // Estilos da tela

export default function HomeScreen() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* Imagem no topo da tela */}
            <ImageBackground
                source={require('../../assets/imgPatrimonio.png')} // Caminho da imagem
                style={styles.backgroundImage}
            >
            </ImageBackground>
            {/* Navbar logo abaixo da imagem */}
            <View style={styles.navbarContainer}>
                <Navbar />
            </View>

            {/* Conteúdo principal */}
            <View style={styles.content}>
                <Text style={styles.text}>Bem-vindo à Home!</Text>
            </View>
            {/* Conteúdo rolável abaixo da imagem */}
            <ScrollView contentContainerStyle={styles.pageContent}>

            </ScrollView>
        </SafeAreaView>
    );
}
