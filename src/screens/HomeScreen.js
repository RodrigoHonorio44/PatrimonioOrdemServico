import React from 'react';
import { View, Text, ImageBackground, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import Navbar from '../components/Navbar'; // Importando a Navbar
import styles from '../styles/HomeScreenStyles'; // Estilos da tela

export default function HomeScreen({ navigation }) {
    // Função para navegar para a tela de Ordem de Serviço
    const navegarParaOrdemServico = () => {
        navigation.navigate('OrdemServico'); // Navega para a tela OrdemServico
    };

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

            {/* Botão para navegar para a tela de Ordem de Serviço */}
            <TouchableOpacity
                style={styles.button}
                onPress={navegarParaOrdemServico}
            >
                <Text style={styles.buttonText}>Ir para Ordem de Serviço</Text>
            </TouchableOpacity>

            {/* Conteúdo rolável abaixo da imagem */}
            <ScrollView contentContainerStyle={styles.pageContent}>
                {/* Outros conteúdos podem ser adicionados aqui */}
            </ScrollView>
        </SafeAreaView>
    );
}
