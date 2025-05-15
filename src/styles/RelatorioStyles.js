import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eef',
        padding: 20,
        paddingBottom: 80, // <- Isso resolve o espaço abaixo
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 70, // Garantindo espaço para a navbar
        minHeight: '100%', // Garantir que o conteúdo ocupe a tela inteira
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        paddingTop: 35,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        marginBottom: 12,
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        gap: 10,
    },
    dateText: {
        fontSize: 16,
    },
    relatorioContainer: {
        marginTop: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 3,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    relatorioContent: {
        marginTop: 10,
    },
    unidadeItem: {
        backgroundColor: '#f1f1f1',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#1E90FF',
    },
    unidadeText: {
        fontSize: 16,
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E90FF',
        marginBottom: 12,
        textAlign: 'center',
    },
    noDataText: {
        fontSize: 16,
        color: 'gray',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 20,
    },
    navbarContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingTop: -5,
    },

    // Estilos para os botões
    buttonContainer: {
        marginBottom: 15, // Espaçamento entre os botões
    },
});
