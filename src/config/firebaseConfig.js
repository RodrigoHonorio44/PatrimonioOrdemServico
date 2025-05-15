// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; // ← adicione isso
import { getAuth } from 'firebase/auth'; // ← se você quiser usar auth também

const firebaseConfig = {
    apiKey: "AIzaSyDiGWblN31neDSExJ3wxjg6O5yChnqSEb8",
    authDomain: "ordem-de-servico-50ee6.firebaseapp.com",
    projectId: "ordem-de-servico-50ee6",
    storageBucket: "ordem-de-servico-50ee6.firebasestorage.app",
    messagingSenderId: "212222916929",
    appId: "1:212222916929:web:5d09bd099ad5c9439449c0"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app); // ✅ Firestore instanciado corretamente
const auth = getAuth(app);    // ✅ Auth também (opcional)

export { app, db, auth }; // ✅ exporte os dois
