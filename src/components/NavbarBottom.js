import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/NavbarBottomStyles';

export default function NavbarBottom({ onNavigate }) {
    const navItems = [
        { label: 'Home', route: 'Home', icon: 'home' },
        { label: 'Ordem Serviço', route: 'OrdemServico', icon: 'assignment' },
        { label: 'Entrega', route: 'EntregaDeEquipamento', icon: 'inventory' },
        { label: 'Lista de Tarefas', route: 'ListaDeTarefas', icon: 'list' },
        { label: 'Tarefas Técnico', route: 'TarefasTecnico', icon: 'list' }, // NOVO ITEM
    ];

    return (
        <SafeAreaView edges={['bottom']} style={styles.navbarSafeArea}>
            {navItems.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.navItem}
                    onPress={() => onNavigate && onNavigate(item.route)}
                >
                    <MaterialIcons name={item.icon} size={24} color="#333" />
                    <Text style={styles.navText}>{item.label}</Text>
                </TouchableOpacity>
            ))}
        </SafeAreaView>
    );
}