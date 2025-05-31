import React, { useState, useEffect, useRef, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/LoginStyles';
import { login } from '../services/authService';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
    const { user } = useContext(AuthContext); // Se quiser usar para debug ou algo
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleLogin = async () => {
        setError('');
        if (!email || !senha) {
            setError('Preencha todos os campos.');
            return;
        }

        setLoading(true);

        try {
            await login(email, senha);
            // REMOVIDO: navegação manual aqui, a mudança no contexto redireciona automaticamente
        } catch (err) {
            if (err.code === 'auth/user-not-found') {
                setError('Usuário não encontrado.');
            } else if (err.code === 'auth/wrong-password') {
                setError('Senha incorreta.');
            } else if (err.code === 'auth/invalid-email') {
                setError('Email inválido.');
            } else {
                setError('Erro ao fazer login.');
            }
        }

        setLoading(false);
    };

    return (
        <ImageBackground
            source={require('../../assets/fundoLogin.png')}
            style={styles.background}
        >
            <View style={styles.overlay} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
                    <Text style={styles.title}>Bem-vindo!</Text>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <View style={styles.inputWrapper}>
                        <TextInput
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor="#aaa"
                        />
                        <Ionicons
                            name="mail-outline"
                            size={22}
                            color="gray"
                            style={styles.iconRight}
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <TextInput
                            placeholder="Senha"
                            value={senha}
                            onChangeText={setSenha}
                            style={styles.input}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            placeholderTextColor="#aaa"
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.eyeIcon}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={showPassword ? 'eye' : 'eye-off'}
                                size={22}
                                color="gray"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Entrar</Text>
                        )}
                    </TouchableOpacity>

                    <View style={{ marginTop: 20, alignItems: 'center' }}>
                        <Text style={styles.extraText}>
                            Não tem uma conta?
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
                            <Text style={styles.linkText}>Cadastre-se aqui</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={() => navigation.navigate('EsqueceuSenha')}>
                        <Text style={styles.esqueceuSenhaText}>
                            Esqueceu sua senha?
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}
