import { StyleSheet, Dimensions, Platform } from 'react-native';
import colors from '../styles/colors';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
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
        backgroundColor: colors.cardBackground,
        width: '100%',
        maxWidth: 400,
        padding: width * 0.06,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 6,
        alignItems: 'center',
    },
    title: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        marginBottom: height * 0.025,
        textAlign: 'center',
        color: '#000',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        paddingHorizontal: width * 0.04,
        height: height * 0.06,
        marginBottom: height * 0.02,
        backgroundColor: colors.inputBackground,
        fontSize: width * 0.045,
        color: '#000',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOpacity: 0.05,
                shadowOffset: { width: 0, height: 1 },
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    button: {
        width: '100%',
        backgroundColor: '#007BFF',
        paddingVertical: height * 0.018,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: height * 0.015,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOpacity: 0.15,
                shadowOffset: { width: 0, height: 3 },
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    buttonText: {
        color: '#fff',
        fontSize: width * 0.045,
        fontWeight: 'bold',
    },
});
