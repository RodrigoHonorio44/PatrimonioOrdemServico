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
    TouchableWithoutFeedback,
    Keyboard,
    AppState,
} from 'react-native';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
    getFirestore,
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    doc,
    updateDoc,
    serverTimestamp,
    setDoc,
} from 'firebase/firestore';

export default function Chat({ navigation }) {
    const auth = getAuth();
    const db = getFirestore();

    const [currentUser, setCurrentUser] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [otherTyping, setOtherTyping] = useState(false);
    const [appState, setAppState] = useState(AppState.currentState);

    useEffect(() => {
        // Atualiza o currentUser e já pega o displayName para facilitar
        const unsubscribeAuth = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
            setUserOnlineStatus(!!user);
        });

        return unsubscribeAuth;
    }, []);

    const setUserOnlineStatus = async (isOnline) => {
        if (!currentUser) return;
        try {
            await updateDoc(doc(db, 'users', currentUser.uid), {
                online: isOnline,
                lastOnline: isOnline ? null : serverTimestamp(),
            });
        } catch (error) {
            console.error('Erro ao atualizar status online:', error);
        }
    };

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            setAppState(nextAppState);
            setUserOnlineStatus(nextAppState === 'active');
        });

        return () => {
            setUserOnlineStatus(false);
            subscription.remove();
        };
    }, [currentUser]);

    useEffect(() => {
        if (!currentUser) return;

        const q = query(collection(db, 'messages'), orderBy('createdAt', 'asc'));
        const unsubscribe = onSnapshot(q, snapshot => {
            setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return unsubscribe;
    }, [currentUser]);

    useEffect(() => {
        if (!currentUser) return;

        const unsubscribe = onSnapshot(collection(db, 'users'), snapshot => {
            setUsers(snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.displayName || data.name || 'Usuário',
                    online: data.online,
                    lastOnline: data.lastOnline,
                };
            }));
        });

        return unsubscribe;
    }, [currentUser]);

    useEffect(() => {
        if (!currentUser) return;

        const unsubscribe = onSnapshot(collection(db, 'typing'), snapshot => {
            setOtherTyping(snapshot.docs.some(doc =>
                doc.id !== currentUser.uid && doc.data().isTyping
            ));
        });

        return unsubscribe;
    }, [currentUser]);

    const sendMessage = async () => {
        if (!currentUser || message.trim() === '') return;

        try {
            await addDoc(collection(db, 'messages'), {
                text: message.trim(),
                createdAt: new Date(),
                uid: currentUser.uid,
                userName: currentUser.displayName || 'Usuário',
            });
            setMessage('');
            updateTyping(false);
            Keyboard.dismiss();
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
        }
    };

    const updateTyping = async (status) => {
        if (!currentUser) return;
        try {
            await setDoc(doc(db, 'typing', currentUser.uid), { isTyping: status });
        } catch (error) {
            console.error('Erro ao atualizar status de digitação:', error);
        }
    };

    const handleLogout = () => {
        navigation.navigate('Home');
    };

    const renderItem = ({ item }) => {
        const time = item.createdAt?.toDate
            ? item.createdAt.toDate()
            : item.createdAt instanceof Date
                ? item.createdAt
                : new Date();

        const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const isMyMessage = item.uid === currentUser?.uid;

        // Busca usuário pelo uid na lista de users para pegar o nome correto
        const messageUser = users.find(u => u.id === item.uid);
        const userName = isMyMessage ? 'Você' : (messageUser?.name || item.userName || 'Usuário');

        return (
            <View style={[
                styles.messageContainer,
                isMyMessage ? styles.myMessageLeft : styles.otherMessageRight
            ]}>
                <Text style={styles.userName}>{userName}</Text>
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.timestamp}>{formattedTime}</Text>
            </View>
        );
    };

    const renderUserItem = ({ item }) => {
        const isOnline = item.online;
        const lastOnline = item.lastOnline?.toDate ? item.lastOnline.toDate() : null;

        return (
            <View style={styles.userItem}>
                <Text style={styles.userName}>{item.name || item.id}</Text>
                <Text style={[styles.status, isOnline ? styles.online : styles.offline]}>
                    {isOnline ? 'Online' : lastOnline ? `Último: ${lastOnline.toLocaleString()}` : 'Offline'}
                </Text>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.flexContainer}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 70}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.flexContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.chatHeader}>Chat Geral</Text>
                        <Button title="Sair" onPress={handleLogout} />
                    </View>

                    {otherTyping && <Text style={styles.typingIndicator}>Alguém está digitando...</Text>}

                    <FlatList
                        data={messages.slice().reverse()}
                        keyExtractor={item => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={{ padding: 10, flexGrow: 1, justifyContent: 'flex-end' }}
                        style={styles.messagesList}
                        keyboardShouldPersistTaps="handled"
                    />

                    <View style={styles.footerContainer}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                value={message}
                                onChangeText={text => {
                                    setMessage(text);
                                    updateTyping(text.length > 0);
                                }}
                                placeholder="Digite sua mensagem"
                                style={styles.input}
                                multiline
                                onSubmitEditing={() => sendMessage()}
                                blurOnSubmit={false}
                            />
                            <Button title="Enviar" onPress={sendMessage} />
                        </View>

                        <Text style={styles.usersTitle}>Usuários online</Text>

                        <FlatList
                            data={users}
                            keyExtractor={item => item.id}
                            renderItem={renderUserItem}
                            contentContainerStyle={{ paddingBottom: 5 }}
                            style={styles.usersList}
                            scrollEnabled={true}
                            nestedScrollEnabled={true}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flexContainer: { flex: 1, backgroundColor: '#f8f8f8' },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#000367',
        padding: 15,
        marginTop: 45,
    },
    chatHeader: { fontSize: 22, fontWeight: 'bold', color: 'white' },
    typingIndicator: { fontStyle: 'italic', paddingHorizontal: 15, color: '#555' },
    messagesList: { flex: 1 },
    footerContainer: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingHorizontal: 10,
        paddingTop: 5,
        paddingBottom: 0,
        maxHeight: 240,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 5,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
        maxHeight: 100,
        backgroundColor: 'white',
    },
    messageContainer: {
        marginVertical: 5,
        padding: 10,
        borderRadius: 10,
        maxWidth: '80%',
    },
    myMessageLeft: {
        backgroundColor: '#dcf8c6',
        alignSelf: 'flex-start',
    },
    otherMessageRight: {
        backgroundColor: '#fff',
        alignSelf: 'flex-end',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    userName: { fontWeight: 'bold', marginBottom: 3, color: '#333', textAlign: 'left' },
    messageText: { fontSize: 16, color: '#222' },
    timestamp: { fontSize: 10, color: '#888', marginTop: 4, textAlign: 'right' },
    usersTitle: { fontWeight: 'bold', fontSize: 16, marginTop: 10, marginBottom: 5, color: '#000367' },
    usersList: { maxHeight: 80 },
    userItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 2,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
    },
    status: { fontSize: 12, fontStyle: 'italic' },
    online: { color: 'green' },
    offline: { color: 'gray' },
});
