import React, { useState, useEffect, useRef } from 'react';
import {
    View, FlatList, TextInput, Button, Text,
    KeyboardAvoidingView, Platform, TouchableWithoutFeedback,
    Keyboard, StyleSheet, Alert
} from 'react-native';
import {
    getFirestore, collection, query, orderBy,
    onSnapshot, addDoc, serverTimestamp, getDocs, deleteDoc, doc, setDoc, getDoc
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function ChatPrivado() {
    const route = useRoute();
    const navigation = useNavigation();
    const { chatId, otherName } = route.params ?? {};

    const auth = getAuth();
    const db = getFirestore();
    const [message, setMessage] = useState('');
    const [msgs, setMsgs] = useState([]);
    const [typingUsers, setTypingUsers] = useState([]);
    const flatListRef = useRef();

    // Controla se o usuário está perto do final da lista para permitir scroll automático
    const isNearBottomRef = useRef(true);

    useEffect(() => {
        if (!chatId) return;

        // Monitorar mensagens
        const messagesRef = collection(db, 'privateChats', chatId, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'asc'));
        const unsubMessages = onSnapshot(q, snap => {
            const list = [];
            snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
            setMsgs(list);
            if (isNearBottomRef.current) {
                setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
            }
        });

        // Monitorar usuários digitando (exceto eu)
        const typingRef = collection(db, 'privateChats', chatId, 'typing');
        const unsubTyping = onSnapshot(typingRef, snap => {
            const typingNow = [];
            snap.forEach(doc => {
                if (doc.id !== auth.currentUser.uid && doc.data().isTyping) {
                    typingNow.push(doc.id);
                }
            });
            setTypingUsers(typingNow);
        });

        return () => {
            unsubMessages();
            unsubTyping();
            setTypingUsers([]);
        };
    }, [chatId]);

    // Atualiza campo typing no banco
    useEffect(() => {
        if (!chatId) return;
        const typingDocRef = doc(db, 'privateChats', chatId, 'typing', auth.currentUser.uid);

        if (message.length > 0) {
            // Indica que está digitando
            setDoc(typingDocRef, { isTyping: true });
        } else {
            // Remove indicação quando limpa input
            setDoc(typingDocRef, { isTyping: false });
        }

        // Limpar typing ao desmontar
        return () => setDoc(typingDocRef, { isTyping: false });
    }, [message]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button title="Finalizar" color="#f00" onPress={handleFinalizarConversa} />
            )
        });
    }, [navigation]);

    const handleFinalizarConversa = () => {
        Alert.alert(
            'Finalizar conversa',
            'Deseja apagar esta conversa e voltar para a tela inicial?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sim',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const messagesRef = collection(db, 'privateChats', chatId, 'messages');
                            const snapshot = await getDocs(messagesRef);
                            const deletePromises = snapshot.docs.map(docItem =>
                                deleteDoc(doc(db, 'privateChats', chatId, 'messages', docItem.id))
                            );
                            await Promise.all(deletePromises);
                            navigation.navigate('Home');
                        } catch (error) {
                            console.error('Erro ao apagar mensagens:', error);
                        }
                    }
                }
            ]
        );
    };

    const sendMessage = async () => {
        if (!message.trim()) return;
        try {
            await addDoc(collection(db, 'privateChats', chatId, 'messages'), {
                text: message.trim(),
                createdAt: serverTimestamp(),
                uid: auth.currentUser.uid,
                userName: auth.currentUser.displayName?.split(' ')[0] || 'Eu',
            });
            setMessage('');
        } catch (e) {
            console.error(e);
        }
    };

    if (!chatId) {
        return (
            <View style={styles.center}>
                <Text>Conversa não iniciada.</Text>
            </View>
        );
    }

    // Formata a data/hora para mostrar junto da mensagem
    function formatDate(timestamp) {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
    }

    // Controla se o usuário está próximo do fim da lista
    const onScroll = (event) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const paddingToBottom = 20;
        const isNearBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
        isNearBottomRef.current = isNearBottom;
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.select({ ios: 90, android: 60 })}
            >
                <Text style={styles.header}>Chat com {otherName}</Text>

                <FlatList
                    ref={flatListRef}
                    data={msgs}
                    keyExtractor={i => i.id}
                    renderItem={({ item }) => (
                        <View style={[
                            styles.bubble,
                            item.uid === auth.currentUser.uid ? styles.myBubble : styles.theirBubble
                        ]}>
                            <Text style={styles.name}>{item.userName}</Text>
                            <Text>{item.text}</Text>
                            <Text style={styles.timestamp}>{formatDate(item.createdAt)}</Text>
                        </View>
                    )}
                    contentContainerStyle={{ padding: 10, paddingBottom: 20 }}
                    keyboardShouldPersistTaps="handled"
                    onContentSizeChange={() => {
                        if (isNearBottomRef.current) {
                            flatListRef.current?.scrollToEnd({ animated: true });
                        }
                    }}
                    onScroll={onScroll}
                    scrollEventThrottle={100}
                />

                {typingUsers.length > 0 && (
                    <Text style={styles.typingIndicator}>
                        {otherName} está digitando...
                    </Text>
                )}

                <View style={styles.inputContainer}>
                    <TextInput
                        value={message}
                        onChangeText={setMessage}
                        placeholder="Digite sua mensagem"
                        style={styles.input}
                        onSubmitEditing={sendMessage}
                        returnKeyType="send"
                    />
                    <Button title="Enviar" onPress={sendMessage} disabled={!message.trim()} />
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    header: {
        padding: 12,
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: '#000367',
        color: 'white',
    },
    bubble: {
        marginBottom: 10,
        padding: 8,
        borderRadius: 8,
        maxWidth: '80%',
    },
    myBubble: { backgroundColor: '#DCF8C6', alignSelf: 'flex-end' },
    theirBubble: { backgroundColor: '#E5E5E5', alignSelf: 'flex-start' },
    name: { fontWeight: 'bold', marginBottom: 4, fontSize: 12 },
    timestamp: { fontSize: 10, color: '#555', marginTop: 4, textAlign: 'right' },
    typingIndicator: {
        fontStyle: 'italic',
        marginLeft: 12,
        marginBottom: 4,
        color: '#666',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ccc',
        backgroundColor: 'white',
        paddingBottom: 60,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#999',
        borderRadius: 20,
        paddingHorizontal: 15,
        marginRight: 10,
        height: 40,
        backgroundColor: 'white',
    },
});
