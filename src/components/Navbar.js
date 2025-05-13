// src/components/Navbar.js
import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import styles from '../styles/NavbarStyles'; // ✅ sem chaves

export default function Navbar() {
    const navigation = useNavigation();
    const auth = getAuth();

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                Alert.alert('Logout', 'Você saiu com sucesso!');
                // ✅ RESET da navegação para Login (ou AuthLoading)
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'AuthLoading' }],
                    })
                );
            })
            .catch((error) => {
                Alert.alert('Erro', error.message);
            });
    };

    return (
        <View style={styles.navbar}>
            <Text style={styles.title}>Página Inicial</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}
