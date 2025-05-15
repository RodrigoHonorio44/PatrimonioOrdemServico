import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/NavbarBottomStyles';

export default function NavbarBottom({ items, onNavigate }) {
    return (
        <SafeAreaView edges={['bottom']} style={styles.navbarSafeArea}>
            {items.map((item, index) => (
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
