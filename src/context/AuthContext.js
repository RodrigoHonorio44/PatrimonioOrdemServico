// src/context/AuthContext.js
import '../config/firebaseConfig';
import React, { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [role, setRole] = useState(null); // Adiciona o papel do usuário

    useEffect(() => {
        const auth = getAuth();
        const db = getFirestore();

        const unsubscribe = onAuthStateChanged(auth, async (usr) => {
            setUser(usr);
            setAuthLoading(false);

            if (usr) {
                try {
                    const docRef = doc(db, 'users', usr.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        setRole(docSnap.data().role); // admin ou user
                    } else {
                        setRole(null); // Não encontrou o papel
                    }
                } catch (error) {
                    console.error('Erro ao buscar role:', error);
                    setRole(null);
                }
            } else {
                setRole(null); // Deslogado
            }
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ user, role, authLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
