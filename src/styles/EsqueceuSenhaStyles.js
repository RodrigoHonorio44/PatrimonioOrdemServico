import { StyleSheet, Dimensions, Platform } from 'react-native';
import colors from '../styles/colors'; // Certifique-se de ter este arquivo com suas cores definidas

const { width, height } = Dimensions.get('window');

const EsqueceuSenhaStyles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.03,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        width: '100%',
        maxWidth: 400,
        padding: width * 0.06,
        borderRadius: 12,
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    title: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        marginBottom: height * 0.015,
        color: colors.textPrimary || '#333',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: width * 0.04,
        marginBottom: height * 0.025,
        color: colors.textSecondary || '#666',
        textAlign: 'center',
    },
    input: {
        height: height * 0.065,
        width: '100%',
        borderColor: colors.border || '#ccc',
        borderWidth: 1,
        paddingHorizontal: width * 0.04,
        borderRadius: 8,
        backgroundColor: colors.inputBackground || '#fff',
        marginBottom: height * 0.02,
        color: colors.textPrimary || '#333',
    },
    button: {
        height: height * 0.065,
        width: '100%',
        backgroundColor: '#007BFF',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: colors.white || '#fff',
        fontWeight: 'bold',
        fontSize: width * 0.045,
    },
});

export default EsqueceuSenhaStyles;
