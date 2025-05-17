import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/LoginStyles';
import { login } from '../services/authService';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        setError('');
        if (!email || !senha) {
            setError('Preencha todos os campos.');
            return;
        }

        setLoading(true);

        try {
            await login(email, senha);
            navigation.replace('Home');
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
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.card}>
                    <Text style={styles.title}>Login</Text>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    {/* Campo de email com ícone da cartinha à direita */}
                    <View style={styles.inputWrapper}>
                        <TextInput
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor="#666"
                        />
                        <Ionicons
                            name="mail-outline"
                            size={22}
                            color="gray"
                            style={styles.iconRight}
                        />
                    </View>

                    {/* Campo senha com olho */}
                    <View style={styles.inputWrapper}>
                        <TextInput
                            placeholder="Senha"
                            value={senha}
                            onChangeText={setSenha}
                            style={styles.input}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            placeholderTextColor="#666"
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

                    <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
                        <Text style={styles.extraText}>
                            Não tem uma conta?{' '}
                            <Text style={styles.linkText}>Cadastre-se aqui</Text>
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('EsqueceuSenha')}>
                        <Text style={[styles.extraText, { fontWeight: 'bold' }]}>
                            Esqueceu sua senha?
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}
