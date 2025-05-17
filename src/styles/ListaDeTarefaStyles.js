import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: width * 0.065, // ex: 26px para ~400px largura
        fontWeight: '700',
        marginBottom: 24,
        textAlign: 'center',
        color: '#222',
        marginTop: 45,
    },
    input: {
        borderWidth: 1,
        borderColor: '#bbb',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: width * 0.04, // ex: 16px para ~400px largura
        backgroundColor: '#fafafa',
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 14,
        borderRadius: 8,
        marginBottom: 25,
        alignItems: 'center',
        elevation: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: width * 0.04, // ex: 16px
    },
    filterLabel: {
        fontSize: width * 0.043, // ex: 17px
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 15,
        color: '#333',
    },
    item: {
        backgroundColor: '#f9f9f9',
        padding: 18,
        borderRadius: 8,
        marginBottom: 12,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    itemText: {
        fontSize: width * 0.045, // ex: 18px
        marginBottom: 8,
        color: '#111',
    },
    removeButton: {
        backgroundColor: '#e74c3c',
        paddingVertical: 8,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    removeButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: width * 0.035, // ex: 14px
    },
});
