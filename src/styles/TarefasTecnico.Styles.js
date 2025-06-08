import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: width * 0.05, // 5% da largura da tela
    },
    titulo: {
        fontSize: width * 0.06, // 6% da largura
        fontWeight: 'bold',
        marginBottom: width * 0.05,
        textAlign: 'center',
        color: '#333',
    },
    item: {
        backgroundColor: '#f0f0f0',
        padding: width * 0.04,
        borderRadius: 10,
        marginBottom: width * 0.04,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    nome: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: width * 0.015,
    },
    textoInfo: {
        color: '#333',       // cor escura e legível
        fontSize: width * 0.04,
        marginBottom: width * 0.01,
    },
    botao: {
        marginTop: width * 0.03,
        backgroundColor: '#007bff',
        paddingVertical: width * 0.025,
        paddingHorizontal: width * 0.04,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    botaoExcluir: {
        marginTop: width * 0.03,
        backgroundColor: '#cc0000', // vermelho para excluir
        paddingVertical: width * 0.025,
        paddingHorizontal: width * 0.04,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    botaoTexto: {
        color: '#fff',
        fontSize: width * 0.035,
        fontWeight: '600',
    },
    vazio: {
        textAlign: 'center',
        marginTop: width * 0.07,
        fontSize: width * 0.04,
        color: '#888',
    },
});
