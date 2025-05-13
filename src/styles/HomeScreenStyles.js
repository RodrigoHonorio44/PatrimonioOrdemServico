import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    backgroundImage: {
        width: '100%',
        height: 300, // A imagem ocupa o topo da tela
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20, // Espaço entre a imagem e o texto
    },
    text: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    pageContent: {
        flexGrow: 1, // Permite que o conteúdo abaixo da imagem ocupe o restante do espaço
        padding: 10,
    },
    navbarContainer: {
        width: '100%', // Garantindo que a Navbar ocupe toda a largura
        marginTop: -15, // Ajuste de espaçamento entre a imagem e a Navbar
        paddingHorizontal: 0, // Garantindo que a Navbar tenha largura total
    },
    // Estilos do botão
    button: {
        backgroundColor: '#007bff', // Cor azul para o botão
        padding: 15,
        margin: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff', // Texto branco no botão
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default styles;
