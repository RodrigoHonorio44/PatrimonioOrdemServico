import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    item: {
        backgroundColor: '#f1f1f1',
        padding: width * 0.04,       // padding proporcional à largura
        marginBottom: height * 0.013, // margem proporcional à altura
        borderRadius: 8,
    },
    title: {
        fontWeight: 'bold',
        fontSize: width > 350 ? 16 : 14, // fonte um pouco menor em telas estreitas
    },
    empty: {
        textAlign: 'center',
        marginTop: height * 0.025,
        fontStyle: 'italic',
        fontSize: width > 350 ? 14 : 12,
    },
});
