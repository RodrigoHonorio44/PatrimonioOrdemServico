import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        margin: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        flexGrow: 1,
    },
    header: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 20,
        textAlign: 'center',
        color: '#d9534f',
    },
    infoBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    infoLabel: {
        fontWeight: '600',
        color: '#333',
    },
    infoValue: {
        fontWeight: '400',
        color: '#555',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        marginTop: 16,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#fafafa',
    },
    dataHora: {
        marginTop: 20,
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    button: {
        marginTop: 16,
        backgroundColor: '#d9534f',
        paddingVertical: 14,
        borderRadius: 8,
    },
    buttonDisabled: {
        backgroundColor: '#f1a9a0',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 18,
        textAlign: 'center',
    },
});


export default styles;
