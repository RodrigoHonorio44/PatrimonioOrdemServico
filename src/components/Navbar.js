import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import styles from '../styles/NavbarStyles'; // Estilos

export default function Navbar() {
    const navigation = useNavigation();
    const auth = getAuth();
    const db = getFirestore();
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            // Obter o nome do usuário na coleção 'users' do Firestore
            const userRef = doc(db, 'users', user.uid); // Aqui usamos o UID do usuário como referência
            getDoc(userRef)
                .then((docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        console.log("Dados do usuário: ", data); // Verificar se os dados estão sendo recuperados
                        // Pega o nome completo do usuário
                        const fullName = data.name || 'Usuário';
                        // Extrai apenas o primeiro nome
                        const firstName = fullName.trim().split(' ')[0];
                        setUserName(firstName); // Exibe apenas o primeiro nome
                    } else {
                        console.log("Documento do usuário não encontrado");
                        setUserName('Usuário');
                    }
                })
                .catch((error) => {
                    console.error('Erro ao buscar dados do usuário: ', error);
                    setUserName('Usuário');
                })
                .finally(() => setLoading(false));
        } else {
            console.log("Usuário não autenticado");
            setUserName('Usuário');
            setLoading(false);
        }
    }, [auth]);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                Alert.alert('Logout', 'Você saiu com sucesso!');
                navigation.navigate('Login'); // Redireciona para a tela de login
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
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}
