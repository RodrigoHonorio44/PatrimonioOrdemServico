import React from 'react';
import { Text, TouchableOpacity, ScrollView, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/NavbarBottomStyles';

export default function NavbarBottom() {
    const navigation = useNavigation();

    const navItems = [
        { label: 'Home', route: 'Home', icon: 'home' },
        { label: 'Ordem Serviço', route: 'OrdemServico', icon: 'assignment' },
        { label: 'Entrega', route: 'EntregaDeEquipamento', icon: 'local-shipping' },
        { label: 'Criar Tarefas', route: 'ListaDeTarefas', icon: 'list' },
        { label: 'Tarefas Técnico', route: 'TarefasTecnico', icon: 'engineering' },

        { label: 'Estoque', route: 'Estoque', icon: 'inventory' },
        { label: 'Baixa Patrimonio', route: 'BaixaPatrimonio', icon: 'archive' },

        { label: 'Relatórios', route: 'Relatorios', icon: 'bar-chart' },
    ];

    return (
        <SafeAreaView edges={['bottom']} style={styles.navbarSafeArea}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {navItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.navItem}
                        onPress={() => navigation.navigate(item.route)}
                    >
                        <MaterialIcons name={item.icon} size={24} color="#333" />
                        <Text style={styles.navText}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
