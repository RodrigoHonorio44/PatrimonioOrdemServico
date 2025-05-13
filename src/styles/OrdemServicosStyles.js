import { StyleSheet, Dimensions } from 'react-native';

// Obter largura da tela
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#eef',
        flexGrow: 1,
    },
    date: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        width: width - 40, // Para ajustar de forma responsiva
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
        fontWeight: '500',
    },
    pickerContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        width: width - 40, // Responsivo
    },
    picker: {
        height: 50,
        width: '100%',
    },
    button: {
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        width: width - 40, // Ajusta a largura do botão
    },
    buttonEnabled: {
        backgroundColor: '#007AFF', // Cor azul para o botão habilitado
    },
    buttonDisabled: {
        backgroundColor: '#ccc', // Cor cinza para o botão desabilitado
    },
    signatureButton: {
        backgroundColor: '#4ade80', // Cor verde para o botão de assinatura
    },
    pdfButton: {
        backgroundColor: '#007AFF', // Cor azul para o botão de gerar PDF
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    // Estilos para a Navbar
    navbar: {
        width: '100%', // Garantir que a navbar ocupe a largura total
        paddingTop: -100, // Ajuste o valor para definir o espaço no topo
        backgroundColor: '#fff', // Cor de fundo da Navbar
        elevation: 5, // Sombra para dispositivos Android
        position: 'absolute', // Para que a navbar seja fixa ou ajustável
        top: 0, // Posiciona a navbar no topo
        left: 0,
        right: 0,
        zIndex: 1, // Garante que a navbar fique acima de outros componentes
    },
});
