import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
    },

    conteudo: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
    },

    botoes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },

    botao: {
        flex: 1,
        marginHorizontal: 5,
        padding: 12,
        backgroundColor: '#007bff',
        borderRadius: 8,
        alignItems: 'center',
    },

    botaoTexto: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
