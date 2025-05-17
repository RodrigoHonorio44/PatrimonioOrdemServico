import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Função para escalar tamanhos proporcionalmente à largura da tela
const scale = (size) => (width / 375) * size; // 375 é a largura base (iPhone 8)

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
    },
    content: {
        padding: scale(20),
        paddingBottom: scale(100), // deixa espaço para a navbar
    },
    title: {
        fontSize: scale(24),
        fontWeight: 'bold',
        marginBottom: scale(20),
        marginTop: scale(30),
        textAlign: 'center',
    },
    cardsContainer: {
        gap: scale(20),
    },
    card: {
        padding: scale(20),
        borderRadius: scale(16),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        marginBottom: scale(12),
    },
    cardText: {
        fontSize: scale(18),
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
});
