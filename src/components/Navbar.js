import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importa ícones
import styles from '../styles/NavbarStyles';

export default function Navbar() {
    const navigation = useNavigation();
    const auth = getAuth();
    const db = getFirestore();
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const userRef = doc(db, 'users', user.uid);
            getDoc(userRef)
                .then((docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        const fullName = data.name || 'Usuário';
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
    }, [auth]);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                Alert.alert('Logout', 'Você saiu com sucesso!');
                navigation.navigate('Login');
            })
            .catch((error) => {
                Alert.alert('Erro', error.message);
            });
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
                onPress={() => navigation.navigate('Chat')} // Navega para a tela Chat
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
