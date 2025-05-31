import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/NavbarStyles';

export default function Navbar() {
    const navigation = useNavigation();
    const { user, logout } = useContext(AuthContext);
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const db = getFirestore();
        if (user) {
            const userRef = doc(db, 'users', user.uid);
            getDoc(userRef)
                .then((docSnap) => {
                    if (docSnap.exists()) {
                        const fullName = docSnap.data().name || 'Usuário';
                        const firstName = fullName.trim().split(' ')[0];
                        setUserName(firstName);
                    } else {
                        setUserName('Usuário');
                    }
                })
                .catch(() => {
                    setUserName('Usuário');
                })
                .finally(() => setLoading(false));
        } else {
            setUserName('Usuário');
            setLoading(false);
        }
    }, [user]);

    const handleLogout = async () => {
        try {
            await logout();
            Alert.alert('Logout', 'Você saiu com sucesso!');
            // Não precisa navegar manualmente, pois o Navigator já troca a árvore pelo user=null
        } catch (error) {
            Alert.alert('Erro', error.message);
        }
    };

    if (loading) {
        return (
            <View style={styles.navbar}>
                <Text style={styles.title}>Carregando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.navbar}>
            <Text style={styles.title}>Bem-vindo, {userName}</Text>

            <TouchableOpacity
                style={styles.chatButton}
                onPress={() => navigation.navigate('Chat')}
                accessible={true}
                accessibilityLabel="Abrir chat"
            >
                <Icon name="chat" size={28} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}
