import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView
} from 'react-native';

import {
    getFirestore,
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    doc,
    getDoc,
    serverTimestamp
} from 'firebase/firestore';

import { getAuth } from 'firebase/auth';

export default function ChatPublic() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [userName, setUserName] = useState('Usuário');

    const db = getFirestore();
    const auth = getAuth();
    const flatListRef = useRef();

    useEffect(() => {
        const fetchUserName = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    const userRef = doc(db, 'users', user.uid);
                    const docSnap = await getDoc(userRef);
                    if (docSnap.exists()) {
                        const fullName = docSnap.data().name || 'Usuário';
                        const firstName = fullName.trim().split(' ')[0];
                        setUserName(firstName);
                    }
                } catch (error) {
                    console.error('Erro ao buscar nome:', error);
                }
            }
        };
        fetchUserName();
    }, []);

    useEffect(() => {
        const q = query(collection(db, 'messages'), orderBy('createdAt', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(msgs);
        });
        return unsubscribe;
    }, []);

    const sendMessage = async () => {
        if (!message.trim()) return;

        const currentUser = auth.currentUser;
        if (!currentUser) {
            console.log('Usuário não autenticado.');
            return;
        }

        try {
            await addDoc(collection(db, 'messages'), {
                text: message,
                createdAt: serverTimestamp(),
                uid: currentUser.uid,
                userName: userName || 'Usuário'
            });
            setMessage('');
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
        }
    };

    const renderItem = ({ item }) => {
        const isCurrentUser = item.uid === auth.currentUser?.uid;

        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                    marginVertical: 4,
                    paddingHorizontal: 10,
                }}
            >
                <View
                    style={{
                        backgroundColor: isCurrentUser ? '#007AFF' : '#E5E5EA',
                        padding: 10,
                        borderRadius: 10,
                        maxWidth: '80%'
                    }}
                >
                    <Text style={{ fontWeight: 'bold', color: isCurrentUser ? '#fff' : '#000' }}>
                        {item.userName || 'Usuário'}
                    </Text>
                    <Text style={{ color: isCurrentUser ? '#fff' : '#000' }}>
                        {item.text}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={90}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    contentContainerStyle={{ paddingBottom: 70 }}
                />

                {/* Caixa de entrada e botão sempre visíveis */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 10,
                        borderTopWidth: 1,
                        borderColor: '#ccc',
                        backgroundColor: '#fff'
                    }}
                >
                    <TextInput
                        value={message}
                        onChangeText={setMessage}
                        placeholder="Digite sua mensagem..."
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            borderColor: '#ccc',
                            borderRadius: 20,
                            paddingHorizontal: 15,
                            paddingVertical: 10,
                            marginRight: 10,
                            maxHeight: 100,
                        }}
                        multiline
                    />
                    <TouchableOpacity
                        onPress={sendMessage}
                        style={{
                            backgroundColor: '#007AFF',
                            paddingHorizontal: 15,
                            paddingVertical: 10,
                            borderRadius: 20,
                        }}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Enviar</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
