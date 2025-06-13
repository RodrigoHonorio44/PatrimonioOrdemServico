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
        backgroundColor: '#f2f2f2',
    },

    tituloPrincipal: {
        fontSize: moderateScale(24),
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: verticalScale(20),
        color: '#333',
    },

    tituloRelatorio: {
        fontSize: moderateScale(20),
        fontWeight: '700',
        color: '#222',
        textAlign: 'center',
        marginBottom: verticalScale(20),
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: moderateScale(16),
        marginBottom: verticalScale(10),
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
        color: '#FF1493',
    },

    unidadeTitle: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        color: '#000',
        marginBottom: verticalScale(4),
    },

    quantidadeText: {
        fontSize: moderateScale(22),
        fontWeight: 'bold',
        color: '#0066cc',
    },

    item: {
        backgroundColor: '#fff',
        padding: moderateScale(14),
        marginVertical: verticalScale(6),
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
    },

    itemText: {
        color: '#FF69B4',
        fontSize: moderateScale(16),
        marginVertical: verticalScale(2),
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
        color: '#000',
        marginBottom: verticalScale(5),
    },

    datePicker: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingVertical: moderateScale(10),
        paddingHorizontal: moderateScale(12),
        width: '100%',
        color: '#000', // texto preto
        ...Platform.select({
            android: {
                paddingVertical: moderateScale(6),
                // Força o texto preto em Android (quando usar text dentro de Pressable)
                // Para Android DatePicker em modo escuro
            },
        }),
    },

    placeholderText: {
        color: '#999',
        fontSize: moderateScale(16),
    },

    pickerHora: {
        width: '100%',
        height: moderateScale(40),
        color: '#000',
    },

    graficoContainer: {
        marginTop: verticalScale(20),
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: moderateScale(15),
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },

    graficoTitulo: {
        fontSize: moderateScale(18),
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: verticalScale(10),
        color: '#333',
    },
});
