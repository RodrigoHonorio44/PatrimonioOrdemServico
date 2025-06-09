import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 667;

const scale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
    size + (scale(size) - size) * factor;

export default StyleSheet.create({

    container: {
        flex: 1,
        padding: moderateScale(15),
        backgroundColor: '#fff',
    },

    // Título principal do relatório, maior e centralizado
    tituloRelatorio: {
        fontSize: moderateScale(22),
        fontWeight: '800',
        color: '#222',
        textAlign: 'center',
        marginBottom: verticalScale(20),
    },

    titulo: {
        fontSize: moderateScale(18),
        fontWeight: '700',
        color: '#222',
    },

    item: {
        backgroundColor: '#f9f9f9',
        padding: moderateScale(12),
        marginVertical: verticalScale(6),
        borderRadius: 6,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
    },

    negrito: {
        fontWeight: '700',
    },

    datePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: verticalScale(15),
    },

    datePickerGroup: {
        flex: 1,
        alignItems: 'flex-start',
        marginRight: moderateScale(10),
    },

    label: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        color: '#555',
        marginBottom: verticalScale(5),
    },

    datePicker: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingVertical: moderateScale(10),
        paddingHorizontal: moderateScale(12),
        width: '100%',
        color: '#000',  // Garante que o texto fique visível (não transparente)
        ...Platform.select({
            android: {
                paddingVertical: moderateScale(6),
            }
        }),
    },

    placeholderText: {
        color: '#999', // placeholder cinza claro
        fontSize: moderateScale(16),
    },

    // Estilo para o picker da hora (caso use Picker dentro do mesmo input)
    pickerHora: {
        width: '100%',
        height: moderateScale(40),
        color: '#000', // texto visível
    },
    tituloRelatorio: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: verticalScale(20),
        color: '#333',
    },

});
