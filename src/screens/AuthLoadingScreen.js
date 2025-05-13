// src/screens/AuthLoadingScreen.js
import React, { useContext, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function AuthLoadingScreen({ navigation }) {
    const { user, authLoading } = useContext(AuthContext);

    useEffect(() => {
        if (!authLoading) {
            navigation.replace(user ? 'Home' : 'Login');
        }
    }, [authLoading, user]);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#007BFF" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});
