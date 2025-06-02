import React from 'react';
import { View, Text, Pressable, Animated, ScrollView } from 'react-native';
import styles from '../styles/RelatoriosStyles';
import NavbarBottom from '../components/NavbarBottom';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

export default function Relatorios({ navigation }) {
    const relatorios = [
        {
            label: 'Relatórios de Ordens de Serviço',
            route: 'Relatorio',
            icon: <MaterialIcons name="assignment" size={28} color="#fff" />,
            bgColor: '#4a90e2',
        },
        {
            label: 'Relatórios de Entregas Equipamentos',
            route: 'RelatorioEntregasEquipamentos',
            icon: <Ionicons name="cube-outline" size={28} color="#fff" />,
            bgColor: '#50e3c2',
        },
        {
            label: 'Relatórios de Devolução de Equipamento',
            route: 'RelatorioDevolucaoDeEquipamento',
            icon: <Ionicons name="cube-outline" size={28} color="#fff" />,
            bgColor: '#f2445e',
        },
        {
            label: 'Relatórios Baixa Patrimônio',
            route: 'RelatorioBaixaPatrimonio',
            icon: <FontAwesome5 name="tasks" size={26} color="#fff" />,
            bgColor: '#f5a623',
        },
        {
            label: 'Relatórios do Estoque',
            route: 'RelatorioEstoque',
            icon: <FontAwesome5 name="tasks" size={26} color="#fff" />,
            bgColor: '#9013FE',
        },
    ];

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                // Removido style flex:1 do ScrollView para o scroll funcionar
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Selecione um Relatório</Text>

                <View style={styles.cardsContainer}>
                    {relatorios.map((item, index) => {
                        const scale = React.useRef(new Animated.Value(1)).current;

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
                                style={({ pressed }) => [
                                    styles.pressable,
                                    pressed && styles.pressed,
                                ]}
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
            </ScrollView>

            <NavbarBottom navigation={navigation} />
        </View>
    );
}
