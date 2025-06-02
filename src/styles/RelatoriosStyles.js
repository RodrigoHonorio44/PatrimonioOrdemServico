import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Base de referência: iPhone 8 (375x667)
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 667;

// Escala horizontal proporcional à largura da tela
const scale = (size) => (width / guidelineBaseWidth) * size;

// Escala vertical proporcional à altura da tela
const verticalScale = (size) => (height / guidelineBaseHeight) * size;

// Escala moderada (balanceia entre horizontal e vertical)
const moderateScale = (size, factor = 0.5) =>
    size + (scale(size) - size) * factor;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        // Removido flex: 1 para ScrollView funcionar direito
        paddingHorizontal: moderateScale(20),
        paddingTop: verticalScale(30),
        paddingBottom: verticalScale(100), // Espaço para navbar fixa
    },
    title: {
        fontSize: moderateScale(24),
        fontWeight: 'bold',
        marginBottom: verticalScale(20),
        textAlign: 'center',
        color: '#333',
    },
    cardsContainer: {
        // gap não funciona direto, então vamos usar marginBottom no card
        // flexGrow para expandir se necessário
        flexGrow: 1,
    },
    card: {
        width: '100%',
        padding: moderateScale(20),
        borderRadius: moderateScale(16),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: verticalScale(20), // substitui gap
    },
    icon: {
        marginBottom: verticalScale(12),
    },
    cardText: {
        fontSize: moderateScale(18),
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    navbar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: verticalScale(60),
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: Platform.OS === 'ios' ? verticalScale(20) : verticalScale(10),
    },
});
