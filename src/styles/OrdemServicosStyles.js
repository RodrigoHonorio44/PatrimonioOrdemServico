import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#eef',
        padding: 20,
        paddingBottom: 80, // espaço para navbar fixa (mais seguro que 70)
        minHeight: height,
    },
    date: {
        marginTop: 30,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        width: '100%', // para ocupar toda largura do container
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
        fontWeight: '500',
    },
    pickerContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        width: '100%',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    button: {
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        width: '100%',
    },
    buttonEnabled: {
        backgroundColor: '#007AFF',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    signatureButton: {
        backgroundColor: '#4ade80',
    },
    pdfButton: {
        backgroundColor: '#007AFF',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    navbar: {
        width: '100%',
        paddingVertical: 10,
        backgroundColor: '#fff',
        elevation: 5,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
});
