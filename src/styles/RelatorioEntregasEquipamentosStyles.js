import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },

    titulo: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 45,
        color: '#333',
    },

    label: {
        fontSize: 16,
        marginTop: 10,
        marginBottom: 5,
        color: '#555',
    },

    input: {
        fontSize: 16,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#999',
        borderRadius: 5,
        color: '#000',
    },

    item: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginVertical: 6,
        backgroundColor: '#f9f9f9',
    },

    negrito: {
        fontWeight: 'bold',
    },
});

export default styles;
