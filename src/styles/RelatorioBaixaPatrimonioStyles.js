import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        padding: 20,
        paddingBottom: 80, // espaço para a navbar
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 15,
        color: '#333',
    },
    input: {
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        marginTop: 5,
        marginBottom: 10,
        fontSize: 16,
        color: '#333',
    },
    lista: {
        marginTop: 20,
        marginBottom: 20,
    },
    item: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    negrito: {
        fontWeight: 'bold',
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 45,
        color: '#333',
    },
    navbarContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        // Removi paddingTop negativo
    },
});
