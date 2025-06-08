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
        backgroundColor: '#f5f7fa',
        padding: moderateScale(15),
    },
    datePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: verticalScale(15),
        marginTop: verticalScale(35),
    },
    datePicker: {
        paddingVertical: verticalScale(12),
        paddingHorizontal: moderateScale(15),
        backgroundColor: '#fff',
        borderRadius: moderateScale(8),
        borderWidth: 1,
        borderColor: '#ccc',
        minWidth: scale(140),
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: moderateScale(3),
        shadowOffset: { width: 0, height: verticalScale(2) },
    },
    datePickerText: {
        color: '#000', // texto normal preto
        fontSize: moderateScale(16),
    },
    placeholderText: {
        color: '#999', // placeholder cinza claro
        fontSize: moderateScale(16),
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: verticalScale(20),
    },
    titulo: {
        fontSize: moderateScale(20),
        fontWeight: '700',
        color: '#333',
        borderBottomWidth: moderateScale(2),
        borderBottomColor: '#4a90e2',
        paddingBottom: verticalScale(6),
        marginBottom: verticalScale(10),
    },
    item: {
        backgroundColor: '#fff',
        borderRadius: moderateScale(8),
        padding: moderateScale(12),
        marginVertical: verticalScale(6),
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: moderateScale(5),
        shadowOffset: { width: 0, height: verticalScale(2) },
        elevation: 3,
    },
    negrito: {
        fontWeight: '600',
        color: '#222',
    },
});
