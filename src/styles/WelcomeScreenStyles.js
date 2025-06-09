import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000367',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 25,
    },
    logo: {
        width: width * 0.45,
        height: width * 0.45,
        marginBottom: 35,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10, // Para Android
    },
    text: {
        fontSize: 24,
        color: '#fff',  // texto branco
        fontWeight: '600',
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'AvenirNext-DemiBold' : 'Roboto',
        textShadowColor: 'rgba(0, 0, 0, 0.35)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
});
