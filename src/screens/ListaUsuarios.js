// src/screens/ListaUsuarios.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';

export default function ListaUsuarios() {
    const navigation = useNavigation();
    const db = getFirestore();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Pega em tempo real todos os documentos da coleção 'users'
        const usersRef = collection(db, 'users');
        const unsubscribe = onSnapshot(usersRef, snapshot => {
            const lista = [];
            snapshot.forEach(doc => {
                lista.push({
                    uid: doc.id,
                    name: doc.data().name || 'Usuário',
                });
            });
            setUsers(lista);
        });

        return () => unsubscribe();
    }, [db]);

    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                keyExtractor={item => item.uid}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() =>
                            navigation.navigate('ChatPrivado', {
                                chatId: item.uid,
                                otherName: item.name.trim().split(' ')[0],
                            })
                        }
                    >
                        <Text style={styles.text}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Text style={styles.empty}>Nenhum usuário encontrado.</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    item: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    text: { fontSize: 16 },
    empty: { textAlign: 'center', marginTop: 20, color: '#666' },
});
