import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity, // substituído Button por TouchableOpacity
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import styles from '../styles/CadastroScreenStyles';

// Importa a imagem de fundo
import fundoLogin from '../../assets/fundoLogin.png';  // ajuste o caminho conforme sua pasta

export default function CadastroScreen() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [carregando, setCarregando] = useState(false);

    const navigation = useNavigation();

    const handleCadastro = async () => {
        if (!nome || !email || !senha) {
            Alert.alert('Atenção', 'Preencha todos os campos!');
            return;
        }

        setCarregando(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
            const userId = userCredential.user.uid;

            await setDoc(doc(db, 'users', userId), {
                email: email,
                name: nome,
                role: 'user',
                criadoEm: new Date()
            });

            Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
            navigation.navigate('Login');
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                Alert.alert('Erro', 'Este e-mail já está cadastrado.');
            } else if (error.code === 'auth/invalid-email') {
                Alert.alert('Erro', 'E-mail inválido.');
            } else if (error.code === 'auth/weak-password') {
                Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
            } else {
                Alert.alert('Erro ao cadastrar', error.message);
            }
        } finally {
            setCarregando(false);
        }
    };

    return (
        <ImageBackground source={fundoLogin} style={styles.backgroundImage} resizeMode="cover">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View style={styles.overlay}>
                    <View style={styles.card}>
                        <Text style={styles.title}>Cadastro</Text>

                        <TextInput
                            placeholder="Nome"
                            value={nome}
                            onChangeText={setNome}
                            style={styles.input}
                            placeholderTextColor="#666"
                        />
                        <TextInput
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={styles.input}
                            placeholderTextColor="#666"
                        />
                        <TextInput
                            placeholder="Senha"
                            value={senha}
                            onChangeText={setSenha}
                            secureTextEntry
                            style={styles.input}
                            placeholderTextColor="#666"
                        />

                        {carregando ? (
                            <ActivityIndicator size="large" color="#007bff" />
                        ) : (
                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleCadastro}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.buttonText}>Cadastrar</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}
