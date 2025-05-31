// AuthContext.js
import '../config/firebaseConfig';
import React, { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [role, setRole] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const auth = getAuth();
        const db = getFirestore();

        const unsubscribe = onAuthStateChanged(auth, async (usr) => {
            if (!isMounted) return;

            setUser(usr);

            if (usr) {
                try {
                    const docRef = doc(db, 'users', usr.uid);
                    const docSnap = await getDoc(docRef);

                    if (!isMounted) return;

                    if (docSnap.exists()) {
                        setRole(docSnap.data().role);
                    } else {
                        setRole(null);
                    }
                } catch (error) {
                    if (!isMounted) return;
                    console.error('Erro ao buscar role:', error);
                    setRole(null);
                }
            } else {
                setRole(null);
            }

            if (isMounted) setAuthLoading(false);
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);

    const logout = async () => {
        const auth = getAuth();
        const db = getFirestore();
        const currentUser = auth.currentUser;

        try {
            if (currentUser) {
                const userRef = doc(db, 'users', currentUser.uid);
                // Atualiza o status online para false antes de deslogar
                await updateDoc(userRef, { online: false });
            }

            await signOut(auth);

            setUser(null);
            setRole(null);
        } catch (error) {
            console.error('Erro no logout:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, role, authLoading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
