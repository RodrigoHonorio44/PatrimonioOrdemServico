// src/styles/LoginScreenStyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        width: '80%',
        padding: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 25,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        width: '100%',
        height: 45,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 25,
        marginBottom: 20,
        paddingLeft: 15,
        backgroundColor: '#fff',
        color: '#333',
    },
    button: {
        width: '100%',
        height: 45,
        backgroundColor: '#00b5ec',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
