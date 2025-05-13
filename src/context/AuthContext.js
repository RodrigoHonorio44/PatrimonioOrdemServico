// src/context/AuthContext.js
import '../config/firebaseConfig'; // <--- Isso importa e inicializa o Firebase
import React, { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (usr) => {
            setUser(usr);
            setAuthLoading(false);
        });
        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ user, authLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
