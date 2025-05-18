import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

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
        paddingTop: 2,
        marginBottom: 2,
    },
    welcomeText: {
        color: '#000367',
        fontSize: 23,
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        marginTop: 20,
        marginBottom: 10,
    },
    pageContent: {
        flexGrow: 1,
        padding: 12,
        paddingTop: 60,      // Aumenta o espaço para "puxar" os cards para cima
        paddingBottom: 120,  // Espaço extra para scroll no final
        backgroundColor: '#f0f4ff',
    },
    button: {
        backgroundColor: '#0033cc',
        paddingVertical: 14,
        paddingHorizontal: 25,
        marginVertical: 20,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 3,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
        }),
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    card: {
        width: width * 0.46, // Responsivo: ocupa 46% da largura da tela
        padding: 20,
        borderRadius: 12,
        marginBottom: 15,
        alignItems: 'center',
        elevation: 4,
        backgroundColor: '#000367',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
        }),
    },
    cardText: {
        color: '#fff',
        marginTop: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15,
    },
    stickyHeader: {
        backgroundColor: '#f0f4ff',
        paddingVertical: 20,
        alignItems: 'center',
        zIndex: 10,
    },
});

export default styles;
