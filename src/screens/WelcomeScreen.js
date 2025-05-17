import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import styles from '../styles/WelcomeScreenStyles';

export default function WelcomeScreen({ navigation }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        // Sequência animada: fade in + scale up
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1500,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                tension: 100,
                useNativeDriver: true,
            }),
        ]).start();

        // Navega para Login após 3 segundos
        const timer = setTimeout(() => {
            navigation.replace('Login');
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Animated.Image
                source={require('../../assets/logo.png')}
                style={[
                    styles.logo,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
                resizeMode="contain"
            />
            <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
                Bem-vindo(a) à Rodhon Systems!
            </Animated.Text>
        </View>
    );
}
