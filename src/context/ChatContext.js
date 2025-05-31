import React, { createContext, useState, useEffect } from 'react';
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../config/firebaseConfig';  // ajuste para o caminho do seu Firebase config

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [newMessagesCount, setNewMessagesCount] = useState(0);
    const [lastSeen, setLastSeen] = useState(null);  // última vez que abriu o chat
    const [lastMessage, setLastMessage] = useState(null);  // data/hora da última mensagem pública

    // Observa as mensagens públicas
    useEffect(() => {
        const q = query(
            collection(db, 'publicMessages'),
            orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const latest = snapshot.docs[0].data();
                setLastMessage(latest.timestamp);

                // Se usuário já viu, não incrementa
                if (lastSeen && latest.timestamp > lastSeen) {
                    setNewMessagesCount(prev => prev + 1);
                }
            }
        });

        return () => unsubscribe();
    }, [lastSeen]);

    // Chamar ao abrir o chat público
    const markChatAsRead = () => {
        setLastSeen(new Date());
        setNewMessagesCount(0);
    };

    return (
        <ChatContext.Provider value={{
            newMessagesCount,
            setNewMessagesCount,
            lastSeen,
            lastMessage,
            markChatAsRead
        }}>
            {children}
        </ChatContext.Provider>
    );
};
