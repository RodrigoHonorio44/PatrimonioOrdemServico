import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: 'transparent',
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 24,
        borderRadius: 12,
        width: '90%',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
        color: '#333',
    },
    inputWrapper: {
        position: 'relative',
        width: '100%',
        marginBottom: 16,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingRight: 50, // espaço para ícone à direita
        backgroundColor: '#f2f2f2',
        fontSize: 16,
        color: '#000',
    },
    iconRight: {
        position: 'absolute',
        right: 15,
        top: 25,
        marginTop: -11, // metade do ícone (22px)
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
        top: 25,
        marginTop: -11,
        height: 22,
        width: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        marginBottom: 12,
        textAlign: 'center',
    },
    extraText: {
        marginTop: 16,
        textAlign: 'center',
        color: '#333',
        fontWeight: 'bold',
    },
    linkText: {
        color: '#007bff',
        textDecorationLine: 'underline',
    },
    esqueceuSenhaText: {
        marginTop: 16,
        color: '#007bff',
        textAlign: 'center',
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
});
