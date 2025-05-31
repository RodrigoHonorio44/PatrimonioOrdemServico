// src/hooks/usePublicMessagesTracker.js
import { useState, useEffect } from 'react';
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export const usePublicMessagesTracker = (lastSeen) => {
    const [newMessagesCount, setNewMessagesCount] = useState(0);
    const [lastMessage, setLastMessage] = useState(null);

    useEffect(() => {
        const q = query(
            collection(db, 'publicMessages'),
            orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const latest = snapshot.docs[0].data();
                const latestDate = latest.timestamp.toDate();
                setLastMessage(latestDate);

                if (lastSeen) {
                    const newMessages = snapshot.docs.filter(doc =>
                        doc.data().timestamp.toDate() > lastSeen
                    );
                    setNewMessagesCount(newMessages.length);
                }
            }
        });

        return () => unsubscribe();
    }, [lastSeen]);

    return { newMessagesCount, lastMessage, setNewMessagesCount };
};

