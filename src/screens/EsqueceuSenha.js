import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import styles from '../styles/EsqueceuSenhaStyles';

const EsqueceuSenha = () => {
    const [email, setEmail] = useState('');
    const navigation = useNavigation();

    const handleEnviar = async () => {
        if (!email) {
            Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Erro',
                text2: 'Por favor, insira seu e-mail.',
                visibilityTime: 3000,
            });
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);

            Toast.show({
                type: 'success',
                position: 'bottom',
                text1: 'Link enviado',
                text2: `Enviamos um link de recuperação para: ${email}`,
                visibilityTime: 3000,
            });

            setTimeout(() => {
                navigation.navigate('Login');
            }, 3000);
        } catch (error) {
            let mensagemErro = 'Ocorreu um erro. Tente novamente.';

            switch (error.code) {
                case 'auth/user-not-found':
                    mensagemErro = 'Usuário não encontrado. Verifique o e-mail digitado.';
                    break;
                case 'auth/invalid-email':
                    mensagemErro = 'E-mail inválido. Verifique o formato e tente novamente.';
                    break;
                case 'auth/missing-email':
                    mensagemErro = 'Por favor, insira seu e-mail.';
                    break;
            }

            Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Erro',
                text2: mensagemErro,
                visibilityTime: 3000,
            });

            console.error('Erro ao enviar e-mail de recuperação:', error.message);
        }
    };

    return (
        <ImageBackground
            source={require('../../assets/fundoLogin.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Text style={styles.title}>Recuperar Senha</Text>
                    <Text style={styles.subtitle}>Informe o e-mail cadastrado para receber instruções:</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Digite seu e-mail"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleEnviar}>
                        <Text style={styles.buttonText}>Enviar</Text>
                    </TouchableOpacity>
                </View>
                <Toast />
            </View>
        </ImageBackground>
    );
};

export default EsqueceuSenha;
