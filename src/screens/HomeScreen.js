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

const cards = [
    { title: 'Ordens de Serviço', icon: 'assignment', color: '#4A90E2', screen: 'OrdemServico' },
    { title: 'Vendas de Produtos', icon: 'shopping-cart', color: '#50E3C2', screen: 'Vendas' },
    { title: 'Auto-Agendamento', icon: 'event-available', color: '#F5A623', screen: 'Agendamento' },
    { title: 'Orçamentos', icon: 'attach-money', color: '#9013FE', screen: 'Orcamentos' },
    { title: 'Recibos', icon: 'receipt', color: '#D0021B', screen: 'Recibos' },
    { title: 'Controle de Caixa', icon: 'account-balance-wallet', color: '#7ED321', screen: 'Caixa' },
];

export default function HomeScreen({ navigation }) {
    const [userName, setUserName] = useState('');
    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const fetchUserName = async () => {
            const user = auth.currentUser;
            if (user) {
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
                            onPress={() => navigation.navigate(card.screen)}
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
