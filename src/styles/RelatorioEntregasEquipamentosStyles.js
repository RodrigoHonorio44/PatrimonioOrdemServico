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
        backgroundColor: '#fff',
    },

    titulo: {
        fontSize: moderateScale(22),
        fontWeight: 'bold',
        marginBottom: verticalScale(15),
        marginTop: verticalScale(45),
        color: '#333',
    },

    label: {
        fontSize: moderateScale(16),
        marginTop: verticalScale(10),
        marginBottom: verticalScale(5),
        color: '#555',
    },

    input: {
        fontSize: moderateScale(16),
        paddingVertical: verticalScale(10),
        paddingHorizontal: moderateScale(12),
        borderWidth: moderateScale(1),
        borderColor: '#999',
        borderRadius: moderateScale(5),
        color: '#000',
    },

    item: {
        borderWidth: moderateScale(1),
        borderColor: '#ccc',
        borderRadius: moderateScale(8),
        padding: moderateScale(12),
        marginVertical: verticalScale(6),
        backgroundColor: '#f9f9f9',
    },

    negrito: {
        fontWeight: 'bold',
    },
});

export default styles;
