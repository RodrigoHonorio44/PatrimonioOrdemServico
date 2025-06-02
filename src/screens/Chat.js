import React, { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    FlatList,
    Text,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    TouchableOpacity,
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
    setDoc,
    getDoc,
    getDocs,
    writeBatch,
    serverTimestamp,
} from 'firebase/firestore';

export default function Chat({ navigation }) {
    const auth = getAuth();
    const db = getFirestore();

    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [otherTyping, setOtherTyping] = useState(false);

    // Observa estado da autenticação e busca o role do usuário
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setUserRole(data.role || null);
                }
            } else {
                setUserRole(null);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    // Atualiza lista de mensagens em tempo real
    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, 'messages'),
            orderBy('createdAt', 'asc')
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribe();
    }, [currentUser]);

    // Atualiza lista de usuários (sem status online)
    useEffect(() => {
        if (!currentUser) return;

        const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
            setUsers(
                snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        name: data.displayName || data.name || 'Usuário',
                        // online e lastOnline removidos
                    };
                })
            );
        });

        return () => unsubscribe();
    }, [currentUser]);

    // Atualiza indicador de digitação dos outros usuários
    useEffect(() => {
        if (!currentUser) return;

        const unsubscribe = onSnapshot(collection(db, 'typing'), (snapshot) => {
            setOtherTyping(
                snapshot.docs.some(
                    (doc) => doc.id !== currentUser.uid && doc.data().isTyping
                )
            );
        });

        return () => unsubscribe();
    }, [currentUser]);

    const sendMessage = async () => {
        if (!currentUser || message.trim() === '') return;

        try {
            await addDoc(collection(db, 'messages'), {
                text: message.trim(),
                createdAt: serverTimestamp(),
                uid: currentUser.uid,
                userName: currentUser.displayName || 'Usuário',
            });
            setMessage('');
            await updateTyping(false);
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

    const resetMessages = async () => {
        if (!currentUser || userRole !== 'admin') return;

        try {
            const messagesSnapshot = await getDocs(collection(db, 'messages'));
            const batch = writeBatch(db);

            messagesSnapshot.forEach((docSnap) => {
                batch.delete(docSnap.ref);
            });

            await batch.commit();
            console.log('Mensagens resetadas com sucesso!');
        } catch (error) {
            console.error('Erro ao resetar mensagens:', error);
        }
    };

    // Apenas navega para Home (sem atualizar status online)
    const handleLogout = async () => {
        navigation.navigate('Home');
    };

    const renderItem = ({ item }) => {
        let time;
        if (item.createdAt && typeof item.createdAt.toDate === 'function') {
            time = item.createdAt.toDate();
        } else if (item.createdAt instanceof Date) {
            time = item.createdAt;
        } else {
            time = new Date();
        }

        const formattedTime = time.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
        const isMyMessage = item.uid === currentUser?.uid;

        const messageUser = users.find((u) => u.id === item.uid);
        const userName = isMyMessage
            ? 'Você'
            : messageUser?.name || item.userName || 'Usuário';

        return (
            <View
                style={[
                    styles.messageContainer,
                    isMyMessage ? styles.myMessageRight : styles.otherMessageLeft,
                ]}
            >
                <Text style={styles.userName}>{userName}</Text>
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.timestamp}>{formattedTime}</Text>
            </View>
        );
    };

    const renderUserItem = ({ item }) => {
        return (
            <View style={styles.userItem}>
                <Text style={styles.userName}>{item.name || item.id}</Text>
                {/* Status online removido */}
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
                        <View style={{ flexDirection: 'row' }}>
                            {userRole === 'admin' && (
                                <TouchableOpacity
                                    style={styles.resetButton}
                                    onPress={resetMessages}
                                >
                                    <Text style={styles.resetButtonText}>Reset</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                style={styles.logoutButton}
                                onPress={handleLogout}
                            >
                                <Text style={styles.logoutButtonText}>Sair</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {otherTyping && (
                        <Text style={styles.typingIndicator}>Alguém está digitando...</Text>
                    )}

                    <FlatList
                        data={[...messages].reverse()}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={{
                            padding: 10,
                            flexGrow: 1,
                            justifyContent: 'flex-end',
                        }}
                        style={styles.messagesList}
                        keyboardShouldPersistTaps="handled"
                    />

                    <View style={styles.footerContainer}>
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
                                blurOnSubmit={false}
                            />
                            <TouchableOpacity
                                style={styles.sendButton}
                                onPress={sendMessage}
                            >
                                <Text style={styles.sendButtonText}>Enviar</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.usersTitle}>Usuários</Text>

                        <FlatList
                            data={users}
                            keyExtractor={(item) => item.id}
                            renderItem={renderUserItem}
                            contentContainerStyle={{ paddingBottom: 5 }}
                            style={styles.usersList}
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
        backgroundColor: '#f0f0f0',
    },
    headerContainer: {
        paddingTop: 50,
        paddingBottom: 10,
        backgroundColor: '#000367',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    chatHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    resetButton: {
        backgroundColor: '#e63946',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    resetButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: '#333',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    logoutButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    typingIndicator: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        fontStyle: 'italic',
        color: '#666',
    },
    messagesList: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    messageContainer: {
        marginVertical: 5,
        padding: 10,
        borderRadius: 8,
        maxWidth: '80%',
    },
    myMessageRight: {
        backgroundColor: '#DCF8C6',
        alignSelf: 'flex-start',
    },
    otherMessageLeft: {
        backgroundColor: '#d2a4ff',
        alignSelf: 'flex-end',
    },
    userName: {
        fontWeight: 'bold',
        marginBottom: 2,
        color: '#333',
    },
    messageText: {
        fontSize: 16,
        color: '#000',
    },
    timestamp: {
        fontSize: 10,
        color: '#666',
        marginTop: 3,
        textAlign: 'right',
    },
    footerContainer: {
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: '#fff',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#999',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        fontSize: 16,
        maxHeight: 100,
        backgroundColor: '#fff',
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: '#000367',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    usersTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
        fontSize: 16,
        color: '#000',
    },
    usersList: {
        maxHeight: 120,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    userItem: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
});
