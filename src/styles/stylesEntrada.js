import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 8,
        borderRadius: 6,
        fontSize: 16,
        backgroundColor: '#fff',
        color: '#000',
    },
    pickerWrapper: {
        position: 'relative',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },

    picker: {
        height: 50,
        color: '#000',
        paddingHorizontal: 10,
    },

    icon: {
        position: 'absolute',
        right: 10,
        top: '50%',
        marginTop: -10,
        pointerEvents: 'none',
    },

    dataHora: {
        marginBottom: width * 0.03,
        fontStyle: 'italic',
        textAlign: 'center',
        fontSize: width > 350 ? 14 : 12,
    },
});
