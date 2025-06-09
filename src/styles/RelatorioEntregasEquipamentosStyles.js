import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 667;

const scale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
    size + (scale(size) - size) * factor;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: moderateScale(20),
        backgroundColor: '#ffffff',
    },

    titulo: {
        fontSize: moderateScale(24),
        fontWeight: '700',
        marginBottom: verticalScale(20),
        marginTop: verticalScale(50),
        color: '#1a1a1a',
        textAlign: 'center',
    },

    label: {
        fontSize: moderateScale(16),
        marginTop: verticalScale(12),
        marginBottom: verticalScale(6),
        color: '#444',
    },

    input: {
        fontSize: moderateScale(16),
        paddingVertical: verticalScale(10),
        paddingHorizontal: moderateScale(14),
        borderWidth: moderateScale(1),
        borderColor: '#ccc',
        borderRadius: moderateScale(6),
        backgroundColor: '#fff',
        color: '#000',
    },

    item: {
        borderWidth: moderateScale(1),
        borderColor: '#ddd',
        borderRadius: moderateScale(10),
        padding: moderateScale(14),
        marginVertical: verticalScale(8),
        backgroundColor: '#f2f2f2',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,

    },

    negrito: {
        fontWeight: 'bold',
        color: '#222',
    },
    // ... outros estilos

    textoItem: {
        color: '#000',
    },

    // ... estilos existentes

});

export default styles;
