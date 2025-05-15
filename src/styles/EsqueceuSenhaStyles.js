import { StyleSheet } from 'react-native';

const EsqueceuSenhaStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        paddingHorizontal: 20,
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        width: '100%',
        maxWidth: 360,
        padding: 24,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 8,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 15,
        marginBottom: 20,
        color: '#666',
        textAlign: 'center',
    },
    input: {
        height: 48,
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 14,
        borderRadius: 8,
        backgroundColor: '#fff',
        marginBottom: 16,
    },
    button: {
        height: 48,
        width: '100%',
        backgroundColor: '#4a90e2',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default EsqueceuSenhaStyles;
