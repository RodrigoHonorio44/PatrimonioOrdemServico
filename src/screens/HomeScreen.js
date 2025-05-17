import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import Navbar from '../components/Navbar';
import styles from '../styles/HomeScreenStyles';
import { MaterialIcons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Lista de cards disponíveis no dashboard
const cards = [
    { title: 'Ordens de Serviço', icon: 'assignment', color: '#4A90E2', screen: 'OrdemServico' },
    { title: 'Entrega de Equipamento', icon: 'local-shipping', color: '#F5A623', screen: 'EntregaDeEquipamento' },
    { title: 'Lista de Tarefas', icon: 'list', color: '#357ABD', screen: 'ListaDeTarefas' },  // NOVO ITEM
    { title: 'Tarefas Técnico', icon: 'engineering', color: '#9013FE', screen: 'TarefasTecnico' },
    {
        title: 'Estoque', icon: 'inventory', color: '#D0021B', screen: 'Estoque'
    },
    { title: 'Relatórios', icon: 'bar-chart', color: '#7ED321', screen: 'Relatorios' },
];

export default function HomeScreen({ navigation }) {
    const [userName, setUserName] = useState('');
    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const fetchUserName = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    const userRef = doc(db, 'users', user.uid);
                    const docSnap = await getDoc(userRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        const fullName = data.name || 'Usuário';
                        const firstName = fullName.trim().split(' ')[0];
                        setUserName(firstName);
                    } else {
                        setUserName('Usuário');
                    }
                } catch (error) {
                    console.error('Erro ao buscar dados do usuário:', error);
                    setUserName('Usuário');
                }
            } else {
                setUserName('Usuário');
            }
        };

        fetchUserName();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground
                source={require('../../assets/imgPatrimonio.png')}
                style={styles.backgroundImage}
            />

            <View style={styles.navbarContainer}>
                <Navbar />
            </View>

            <View style={styles.content}>
                <Text style={styles.welcomeText}>Bem-vindo, {userName}!</Text>
            </View>

            <ScrollView contentContainerStyle={styles.pageContent}>
                <View style={styles.cardContainer}>
                    {cards.map((card, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.card, { backgroundColor: card.color }]}
                            onPress={() => {
                                try {
                                    navigation.navigate(card.screen);
                                } catch (err) {
                                    console.error(`Tela ${card.screen} não encontrada.`, err);
                                }
                            }}
                        >
                            <MaterialIcons name={card.icon} size={32} color="#fff" />
                            <Text style={styles.cardText}>{card.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
