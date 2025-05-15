import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    filterLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: 10,
    },
    item: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    itemText: {
        fontSize: 18,
        marginBottom: 5,
    },
    removeButton: {
        backgroundColor: '#e74c3c',
        padding: 5,
        borderRadius: 5,
        marginTop: 10,
    },
    removeButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
});
