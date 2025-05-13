// src/services/authService.js
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export async function login(email, password) {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password);
}
