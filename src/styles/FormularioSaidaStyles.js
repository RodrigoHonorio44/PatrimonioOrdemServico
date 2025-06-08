import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const basePadding = width * 0.05;
const baseFontSize = width * 0.045;
const cardPadding = width * 0.05;

export default StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#f5f5f5', // cor de fundo suave
        padding: basePadding,
        paddingBottom: height * 0.3,
    },
    card: {
        backgroundColor: '#eaeaea', // cinza claro
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
        fontSize: baseFontSize * 1.2,
        fontWeight: 'bold',
        marginBottom: basePadding,
        textAlign: 'center',
        color: '#d9534f',
    },
    label: {
        marginTop: basePadding * 0.4,
        fontWeight: 'bold',
        fontSize: baseFontSize,
        color: '#000', // texto preto
    },
    value: {
        marginBottom: basePadding * 0.2,
        fontSize: baseFontSize,
        color: '#000', // texto preto
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: basePadding * 0.5,
        marginTop: basePadding * 0.2,
        fontSize: baseFontSize,
        backgroundColor: '#fff',
        color: '#333', // <- Cor do texto digitado
    },

    inputErro: {
        borderColor: 'red',
    },
    alerta: {
        color: 'red',
        marginTop: basePadding * 0.2,
        fontSize: baseFontSize * 0.9,
    },
    botaoContainer: {
        marginTop: basePadding * 0.6,
        marginBottom: basePadding,
    },
    pickerWrapper: {
        position: 'relative',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },

    picker: {
        height: 50,
        color: '#000',
        paddingHorizontal: 10,
    },

    icon: {
        position: 'absolute',
        right: 10,
        top: '50%',
        marginTop: -10,
        pointerEvents: 'none',
    },

});
