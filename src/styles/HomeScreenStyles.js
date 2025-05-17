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
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    welcomeText: {
        color: '#000367', // azul principal
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: '#000000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        marginTop: 20,
        marginBottom: 10,
    },
    pageContent: {
        flexGrow: 1,
        padding: 10,
        backgroundColor: '#f0f4ff', // fundo claro com toque azulado
    },
    button: {
        backgroundColor: '#0033cc', // azul mais vivo para contraste
        padding: 15,
        margin: 20,
        borderRadius: 8,
        alignItems: 'center',
        elevation: 3,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        padding: 20,
        borderRadius: 12,
        marginBottom: 15,
        alignItems: 'center',
        backgroundColor: '#000367', // usa a cor principal
        elevation: 4,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    cardText: {
        color: '#ffffff',
        marginTop: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default styles;
