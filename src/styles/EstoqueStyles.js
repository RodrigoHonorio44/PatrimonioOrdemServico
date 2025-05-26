import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
    },

    botoes: {
        flexDirection: 'row',           // lado a lado
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },

    botao: {
        flex: 1,                        // mesmo tamanho
        marginHorizontal: 5,            // espaçamento entre eles
        padding: 12,
        backgroundColor: '#007bff',     // cor do botão
        borderRadius: 8,
        alignItems: 'center',           // texto centralizado
    },

    botaoTexto: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
