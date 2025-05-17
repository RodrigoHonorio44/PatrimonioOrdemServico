import { StyleSheet, Dimensions, Platform } from 'react-native';
import colors from '../styles/colors'; // Opcional, se estiver usando tema centralizado

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingBottom: 90, // mais espaço para evitar sobreposição com navbar
        backgroundColor: colors.backgroundLight || '#f9f9f9',
    },
    selector: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: height * 0.05,
        marginTop: height * 0.08,
    },
    title: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: colors.textPrimary || '#333',
    },
    navbar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.white || '#fff',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: colors.border || '#ccc',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 10,
            },
        }),
    },
});
