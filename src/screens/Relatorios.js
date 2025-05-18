import React from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import styles from '../styles/RelatoriosStyles';
import NavbarBottom from '../components/NavbarBottom';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

export default function Relatorios({ navigation }) {
    const relatorios = [
        {
            label: 'Relatório de Ordens de Serviço',
            route: 'Relatorio', // <- esta é a rota que abre o componente Relatorio.js
            icon: <MaterialIcons name="assignment" size={28} color="#fff" />,
            bgColor: '#4a90e2',
        },
        {
            label: 'Relatório de Entregas',
            route: 'RelatorioEntregas',
            icon: <Ionicons name="cube-outline" size={28} color="#fff" />,
            bgColor: '#50e3c2',
        },
        {
            label: 'Relatorio Baixa Patrimonio',
            route: 'RelatorioBaixaPatrimonio',
            icon: <FontAwesome5 name="tasks" size={26} color="#fff" />,
            bgColor: '#f5a623',
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Selecione um Relatório</Text>
                <View style={styles.cardsContainer}>
                    {relatorios.map((item, index) => {
                        const scale = new Animated.Value(1);

                        const onPressIn = () => {
                            Animated.spring(scale, {
                                toValue: 0.96,
                                useNativeDriver: true,
                            }).start();
                        };

                        const onPressOut = () => {
                            Animated.spring(scale, {
                                toValue: 1,
                                friction: 3,
                                useNativeDriver: true,
                            }).start();
                        };

                        return (
                            <Pressable
                                key={index}
                                onPressIn={onPressIn}
                                onPressOut={onPressOut}
                                onPress={() => navigation.navigate(item.route)}
                            >
                                <Animated.View
                                    style={[
                                        styles.card,
                                        { backgroundColor: item.bgColor, transform: [{ scale }] },
                                    ]}
                                >
                                    <View style={styles.icon}>{item.icon}</View>
                                    <Text style={styles.cardText}>{item.label}</Text>
                                </Animated.View>
                            </Pressable>
                        );
                    })}
                </View>
            </View>
            <NavbarBottom navigation={navigation} />
        </View>
    );
}
