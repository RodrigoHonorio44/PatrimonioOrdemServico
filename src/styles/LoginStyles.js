import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: 'transparent',
    },

    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: 28,
        borderRadius: 16,
        width: '90%',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },

    title: {
        fontSize: width * 0.07, // responsivo
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
        color: '#222',
    },

    inputWrapper: {
        position: 'relative',
        width: '100%',
        marginBottom: 18,
    },

    input: {
        height: 52,
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingRight: 48,
        backgroundColor: '#f9f9f9',
        fontSize: width * 0.04,
        color: '#111',
    },

    iconRight: {
        position: 'absolute',
        right: 16,
        top: '50%',
        transform: [{ translateY: -11 }],
    },

    eyeIcon: {
        position: 'absolute',
        right: 16,
        top: '50%',
        transform: [{ translateY: -11 }],
        height: 22,
        width: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },

    button: {
        backgroundColor: '#0066cc',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },

    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: width * 0.045,
    },

    errorText: {
        color: '#d32f2f',
        marginBottom: 10,
        textAlign: 'center',
        fontSize: width * 0.035,
    },

    extraText: {
        marginTop: 16,
        textAlign: 'center',
        color: '#444',
        fontSize: width * 0.04,
    },

    linkText: {
        color: '#0066cc',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },

    esqueceuSenhaText: {
        marginTop: 14,
        color: '#0066cc',
        textAlign: 'center',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },

    background: {
        flex: 1,
    },

    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
    },
});
