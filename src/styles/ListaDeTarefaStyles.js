import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff', // fundo branco suave da tela
    },
    wrapper: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: height * 0.15, // espaço proporcional para navbar
    },
    container: {
        padding: width * 0.04,
        backgroundColor: '#f0f4f8', // cinza claro mais suave no card
        borderRadius: 10,
    },
    title: {
        fontSize: width > 350 ? 22 : 18,
        fontWeight: 'bold',
        marginBottom: height * 0.015,
        textAlign: 'center',
        marginTop: height * 0.06,
        color: '#000', // texto preto
    },
    inputMultiline: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: width * 0.035,
        height: height * 0.18, // altura proporcional
        textAlignVertical: 'top',
        marginBottom: height * 0.02,
        backgroundColor: '#fff', // fundo branco no input pra destacar
        color: '#000', // texto preto dentro do input
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: height * 0.018,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: height * 0.03,
        marginTop: height * 0.025,
    },
    buttonText: {
        color: '#fff', // texto preto no botão
        fontSize: width > 350 ? 16 : 14,
        fontWeight: 'bold',
    },
    filterLabel: {
        marginTop: height * 0.015,
        marginBottom: height * 0.006,
        fontWeight: 'bold',
        fontSize: width > 350 ? 14 : 12,
        color: '#000', // texto preto nos labels
    },
    pickerWrapper: {
        position: 'relative',
        borderWidth: 1,
        borderColor: '#007BFF',
        borderRadius: 8,
        backgroundColor: '#fff',
        marginBottom: 16,
        height: 50,
        justifyContent: 'center',
    },

    picker: {
        height: 50,
        color: '#000',
        paddingHorizontal: 12,
    },

    pickerIcon: {
        position: 'absolute',
        right: 10,
        top: 10,
        pointerEvents: 'none',
    },


    navbar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#ccc',
        zIndex: 10,
        paddingVertical: height * 0.015,
    },
});
