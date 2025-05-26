import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

export default function Chat() {
    const auth = getAuth();
    const db = getFirestore();

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'messages'), orderBy('createdAt', 'asc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const msgs = [];
            querySnapshot.forEach((doc) => {
                msgs.push({ id: doc.id, ...doc.data() });
            });
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, []);

    const sendMessage = async () => {
        if (message.trim() === '') return;

        try {
            await addDoc(collection(db, 'messages'), {
                text: message.trim(),
                createdAt: new Date(),
                uid: auth.currentUser.uid,
                userName: auth.currentUser.displayName || 'Usuário',
            });
            setMessage('');
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={[styles.messageContainer, item.uid === auth.currentUser.uid ? styles.myMessage : styles.otherMessage]}>
            <Text style={styles.userName}>{item.userName}</Text>
            <Text style={styles.messageText}>{item.text}</Text>
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
            keyboardVerticalOffset={90}
        >
            <FlatList
                data={messages}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 10 }}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Digite sua mensagem"
                    style={styles.input}
                />
                <Button title="Enviar" onPress={sendMessage} />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    messageContainer: {
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
        maxWidth: '80%',
    },
    myMessage: {
        backgroundColor: '#DCF8C6',
        alignSelf: 'flex-end',
    },
    otherMessage: {
        backgroundColor: '#E5E5E5',
        alignSelf: 'flex-start',
    },
    userName: {
        fontWeight: 'bold',
        marginBottom: 3,
    },
    messageText: {
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderColor: '#999',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        marginRight: 10,
        height: 40,
    },
});
