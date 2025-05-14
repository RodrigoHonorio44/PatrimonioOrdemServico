import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    backgroundImage: {
        width: '100%',
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navbarContainer: {
        width: '100%',
        marginTop: -15,
        paddingHorizontal: 0,
    },
    content: {
        alignItems: 'center',
        paddingTop: 20,
        marginBottom: 10,
    },
    text: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    pageContent: {
        flexGrow: 1,
        padding: 10,
    },

    // Estilos do botão antigo (pode ser removido se não for mais usado)
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        margin: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

    // Novos estilos para os cards com ícones
    cardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        alignItems: 'center',
        elevation: 4, // sombra para Android
        shadowColor: '#000', // sombra para iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    cardText: {
        color: '#fff',
        marginTop: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default styles;
