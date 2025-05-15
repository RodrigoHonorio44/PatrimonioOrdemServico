import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: 'transparent', // Fundo 100% transparente para destacar a imagem
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Branco translúcido
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
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
        backgroundColor: '#f2f2f2',
        color: '#000',
    },
    button: {
        backgroundColor: '#4CAF50',
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
    forgotPasswordText: {
        marginTop: 16,
        color: '#007bff',
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
});
