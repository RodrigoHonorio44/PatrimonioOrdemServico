import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    // Container principal
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: 'transparent',
    },

    // Card de login
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: 28,
        borderRadius: 16,
        width: '90%',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },

    // Título
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
        color: '#222',
    },

    // Wrapper dos inputs (email e senha)
    inputWrapper: {
        position: 'relative',
        width: '100%',
        marginBottom: 18,
    },

    input: {
        height: 52,
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingRight: 48,
        backgroundColor: '#f9f9f9',
        fontSize: 16,
        color: '#111',
    },

    // Ícone de email
    iconRight: {
        position: 'absolute',
        right: 16,
        top: '50%',
        transform: [{ translateY: -11 }],
    },

    // Ícone de mostrar/ocultar senha
    eyeIcon: {
        position: 'absolute',
        right: 16,
        top: '50%',
        transform: [{ translateY: -11 }],
        height: 22,
        width: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Botão de login
    button: {
        backgroundColor: '#0066cc',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },

    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 17,
    },

    // Texto de erro
    errorText: {
        color: '#d32f2f',
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 14,
    },

    // Textos de links (cadastro, esqueceu senha)
    extraText: {
        marginTop: 16,
        textAlign: 'center',
        color: '#444',
        fontSize: 15,
    },

    linkText: {
        color: '#0066cc',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },

    esqueceuSenhaText: {
        marginTop: 14,
        color: '#0066cc',
        textAlign: 'center',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },

    // Fundo da tela com imagem
    background: {
        flex: 1,
    },

    // Camada escura sobre a imagem
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
    },
});
