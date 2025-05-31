import React, { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    Button,
    FlatList,
    Text,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { getAuth } from 'firebase/auth';
import {
    getFirestore,
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    where,
    setDoc,
    doc,
    getDocs,
} from 'firebase/firestore';

export default function Chat({ navigation }) {
    const auth = getAuth();
    const db = getFirestore();

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [chatType, setChatType] = useState(null);
    const [users, setUsers] = useState([]);
    const [privateRecipient, setPrivateRecipient] = useState(null);
    const [otherTyping, setOtherTyping] = useState(false);

    useEffect(() => {
        if (chatType === 'private' && !privateRecipient) {
            const fetchUsers = async () => {
                const snapshot = await getDocs(collection(db, 'users'));
                const usersList = [];
                snapshot.forEach((doc) => {
                    if (doc.id !== auth.currentUser.uid) {
                        usersList.push({ id: doc.id, ...doc.data() });
                    }
                });
                setUsers(usersList);
            };
            fetchUsers();
        }
    }, [chatType, privateRecipient]);

    useEffect(() => {
        if (!chatType || (chatType === 'private' && !privateRecipient)) return;

        let q;

        if (chatType === 'public') {
            q = query(
                collection(db, 'messages'),
                where('chatType', '==', 'public'),
                orderBy('createdAt', 'asc')
            );
        } else {
            q = query(
                collection(db, 'messages'),
                where('chatType', '==', 'private'),
                where('participants', 'array-contains', auth.currentUser.uid),
                orderBy('createdAt', 'asc')
            );
        }

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const msgs = [];
            querySnapshot.forEach((doc) => {
                if (
                    chatType === 'public' ||
                    (doc.data().participants.includes(auth.currentUser.uid) &&
                        doc.data().participants.includes(privateRecipient.id))
                ) {
                    msgs.push({ id: doc.id, ...doc.data() });
                }
            });
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, [chatType, privateRecipient, auth.currentUser.uid]);

    useEffect(() => {
        if (chatType !== 'private' || !privateRecipient) return;

        const typingRef = doc(db, 'typing', privateRecipient.id);
        const unsubscribe = onSnapshot(typingRef, (docSnap) => {
            if (docSnap.exists() && docSnap.data().isTyping) {
                setOtherTyping(true);
            } else {
                setOtherTyping(false);
            }
        });

        return () => unsubscribe();
    }, [chatType, privateRecipient]);

    const sendMessage = async () => {
        if (message.trim() === '') return;

        try {
            await addDoc(collection(db, 'messages'), {
                text: message.trim(),
                createdAt: new Date(),
                uid: auth.currentUser.uid,
                userName: auth.currentUser.displayName || 'Usuário',
                chatType: chatType,
                participants:
                    chatType === 'private' ? [auth.currentUser.uid, privateRecipient.id] : [],
            });
            setMessage('');
            updateTyping(false);
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
        }
    };

    const updateTyping = async (status) => {
        if (chatType === 'private') {
            try {
                await setDoc(doc(db, 'typing', auth.currentUser.uid), { isTyping: status });
            } catch (error) {
                console.log('Erro ao atualizar status de digitação:', error);
            }
        }
    };

    const renderItem = ({ item }) => (
        <View
            style={[
                styles.messageContainer,
                item.uid === auth.currentUser.uid ? styles.myMessage : styles.otherMessage,
            ]}
        >
            <Text style={styles.userName}>{item.userName}</Text>
            <Text style={styles.messageText}>{item.text}</Text>
        </View>
    );

    if (!chatType) {
        return (
            <View style={styles.centeredContainer}>
                <Text style={styles.title}>Escolha o tipo de chat:</Text>
                <Button title="Chat Público" onPress={() => setChatType('public')} />
                <View style={{ height: 20 }} />
                <Button title="Chat Privado" onPress={() => setChatType('private')} />
            </View>
        );
    }

    if (chatType === 'private' && !privateRecipient) {
        return (
            <View style={styles.centeredContainer}>
                <Text style={styles.title}>Escolha com quem conversar:</Text>
                {users.length === 0 && <ActivityIndicator size="large" />}
                {users.map((user) => (
                    <Button key={user.id} title={user.name || user.id} onPress={() => setPrivateRecipient(user)} />
                ))}
                <View style={{ height: 20 }} />
                <Button title="Voltar" onPress={() => setChatType(null)} />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.flexContainer}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 70}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.flexContainer}>
                    <Text style={styles.chatHeader}>
                        {chatType === 'public'
                            ? 'Chat Público'
                            : `Privado com ${privateRecipient.name || privateRecipient.id}`}
                    </Text>

                    {otherTyping && <Text style={styles.typingIndicator}>Usuário está digitando...</Text>}

                    <FlatList
                        data={messages}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={{ padding: 10, paddingBottom: 10 }}
                        style={styles.flexContainer}
                        inverted
                    />

                    <View style={styles.inputContainer}>
                        <TextInput
                            value={message}
                            onChangeText={(text) => {
                                setMessage(text);
                                updateTyping(text.length > 0);
                            }}
                            placeholder="Digite sua mensagem"
                            style={styles.input}
                            multiline
                            onSubmitEditing={() => sendMessage()}
                            returnKeyType="send"
                        />
                        <Button title="Enviar" onPress={sendMessage} />
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <Button
                            title="Sair do chat"
                            onPress={() => {
                                setChatType(null);
                                setPrivateRecipient(null);
                                setMessages([]);
                                setMessage('');
                                updateTyping(false);
                                navigation.navigate('Home');
                            }}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flexContainer: {
        flex: 1,
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
    },
    chatHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        textAlign: 'center',
    },
    typingIndicator: {
        fontStyle: 'italic',
        color: 'gray',
        marginBottom: 5,
        textAlign: 'center',
    },
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
        paddingHorizontal: 10,
        paddingVertical: 5,
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
        maxHeight: 100,
        minHeight: 40,
    },
});
