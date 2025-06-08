import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f0f4ff',
        paddingHorizontal: width * 0.05, // 5% da largura da tela
        paddingTop: height * 0.02,
        paddingBottom: height * 0.1, // espaço para navbar fixa
        minHeight: height,
    },
    date: {
        marginTop: height * 0.03,
        fontSize: width * 0.045,
        fontWeight: 'bold',
        marginBottom: height * 0.02,
        color: '#000367',
    },
    input: {
        backgroundColor: '#fff',
        padding: width * 0.035,
        borderRadius: 10,
        marginBottom: height * 0.02,
        fontSize: width * 0.045,
        borderWidth: 1,
        borderColor: '#ccd',
        width: '100%',
        color: '#111',
    },
    label: {
        fontSize: width * 0.045,
        marginBottom: 5,
        color: '#000367',
        fontWeight: '600',
    },
    pickerWrapper: {
        position: 'relative',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        overflow: 'hidden',
        justifyContent: 'center',
    },

    picker: {
        width: '100%',
        color: '#333',
        paddingRight: 30, // espaço para a seta
    },

    pickerIcon: {
        position: 'absolute',
        right: 10,
        top: '50%',
        marginTop: -14, // metade do tamanho do ícone para centralizar verticalmente
        pointerEvents: 'none', // permite clicar no picker e não no ícone
    },

    button: {
        paddingVertical: height * 0.018,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: height * 0.02,
        width: '100%',
    },
    buttonEnabled: {
        backgroundColor: '#000367',
    },
    buttonDisabled: {
        backgroundColor: '#aaa',
    },
    signatureButton: {
        backgroundColor: '#4ade80',
    },
    pdfButton: {
        backgroundColor: '#0033cc',
    },
    buttonText: {
        color: '#fff',
        fontSize: width * 0.045,
        fontWeight: '600',
    },
    navbar: {
        width: '100%',
        paddingVertical: height * 0.015,
        backgroundColor: '#000367',
        elevation: 5,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
});
