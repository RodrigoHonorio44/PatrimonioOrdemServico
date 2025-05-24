import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const basePadding = width * 0.05;       // 5% da largura da tela
const baseFontSize = width * 0.045;     // fonte responsiva ~4.5% da largura
const cardPadding = width * 0.05;       // padding do card proporcional

export default StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: basePadding,
        paddingBottom: height * 0.25, // espaço maior para o teclado, 25% da altura
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: cardPadding,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    header: {
        fontSize: baseFontSize * 1.2,  // 20% maior que base
        fontWeight: 'bold',
        marginBottom: basePadding,
        textAlign: 'center',
        color: '#d9534f',
    },
    label: {
        marginTop: basePadding * 0.4,  // 40% do padding base
        fontWeight: 'bold',
        fontSize: baseFontSize,
    },
    value: {
        marginBottom: basePadding * 0.2,
        fontSize: baseFontSize,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: basePadding * 0.5,
        marginTop: basePadding * 0.2,
        fontSize: baseFontSize,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    alerta: {
        color: 'red',
        marginTop: basePadding * 0.2,
        fontSize: baseFontSize * 0.9,
    },
    botaoContainer: {
        marginTop: basePadding * 0.6,
        marginBottom: basePadding * 0.4,
    },
});
