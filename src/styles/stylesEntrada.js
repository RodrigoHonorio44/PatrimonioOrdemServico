import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: width * 0.02,       // 2% da largura da tela
        marginBottom: width * 0.03,  // 3% da largura
        borderRadius: 4,
        marginTop: width * 0.025,    // 2.5% da largura
    },
    dataHora: {
        marginBottom: width * 0.03,
        fontStyle: 'italic',
        textAlign: 'center',
        fontSize: width > 350 ? 14 : 12,
    },
});
