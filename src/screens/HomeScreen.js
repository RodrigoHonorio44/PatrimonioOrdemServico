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
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';

const cards = [
    { title: 'Ordens de Serviço', icon: 'assignment', color: '#4A90E2', screen: 'OrdemServico' },
    { title: 'Entrega de Equipamento', icon: 'local-shipping', color: '#F5A623', screen: 'EntregaDeEquipamento' },
    { title: 'Criar Tarefas', icon: 'list', color: '#357ABD', screen: 'ListaDeTarefas' },
    { title: 'Tarefas Técnico', icon: 'engineering', color: '#9013FE', screen: 'TarefasTecnico' },
    { title: 'Estoque', icon: 'inventory', color: '#a7a844', screen: 'Estoque' },
    { title: 'Relatórios', icon: 'bar-chart', color: '#7ED321', screen: 'Relatorios' },
    { title: 'Baixa Patrimonio', icon: 'archive', color: '#D0021B', screen: 'BaixaPatrimonio' },
    { title: 'Devolução Equipamento', icon: 'archive', color: '#D0021B', screen: 'DevolucaoDeEquipamento' },
];

export default function HomeScreen({ navigation }) {
    const [userName, setUserName] = useState('');
    const [pendentes, setPendentes] = useState(0);
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
                    }
                } catch (error) {
                    console.error('Erro ao buscar dados do usuário:', error);
                    setUserName('Usuário');
                }
            }
        };

        const buscarTarefasPendentes = async () => {
            try {
                const tarefasSnap = await getDocs(collection(db, 'tarefas'));
                const tarefasPendentes = tarefasSnap.docs.filter(
                    doc => doc.data().status === 'pendente'
                );
                setPendentes(tarefasPendentes.length);
            } catch (error) {
                console.error('Erro ao buscar tarefas pendentes:', error);
            }
        };

        fetchUserName();
        buscarTarefasPendentes();
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
                <Text style={styles.welcomeText}>
                    {pendentes > 0
                        ? `Olá, ${userName}. Você tem ${pendentes} tarefa${pendentes > 1 ? 's' : ''} pendente${pendentes > 1 ? 's' : ''}.`
                        : `Olá, ${userName}. Nenhuma tarefa pendente!`}
                </Text>
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
