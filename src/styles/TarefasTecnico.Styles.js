import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    item: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    nome: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 5,
    },
    botao: {
        marginTop: 10,
        backgroundColor: '#007bff',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    botaoTexto: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    vazio: {
        textAlign: 'center',
        marginTop: 30,
        fontSize: 16,
        color: '#888',
    },
});
