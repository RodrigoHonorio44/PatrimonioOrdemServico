import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        padding: width * 0.05,            // 5% da largura da tela
        backgroundColor: '#f0f4f8',      // cor de fundo suave
    },
    input: {
        height: height * 0.07,            // 7% da altura da tela
        backgroundColor: '#ffffff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: width * 0.04,  // 4% da largura da tela
        fontSize: width * 0.04,           // fonte proporcional à largura
        marginBottom: height * 0.015,
        elevation: 2,
        color: '#000',
    },
    signatureButton: {
        backgroundColor: '#4caf50',
        paddingVertical: height * 0.018,
        paddingHorizontal: width * 0.04,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: height * 0.015,
        elevation: 2,
    },
    signatureButtonText: {
        color: '#fff',
        fontSize: width * 0.04,
        fontWeight: 'bold',
    },
    saveButton: {
        paddingVertical: height * 0.018,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: height * 0.012,
        marginBottom: height * 0.04,
        elevation: 3,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: width * 0.045,
        fontWeight: 'bold',
    },
    titulo: {
        textAlign: 'center',
        marginTop: height * 0.04,
        fontSize: width * 0.055,
        color: '#000',
    },
    saveButton1: {
        paddingVertical: height * 0.018,
        paddingHorizontal: width * 0.08,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: height * 0.025,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    saveButtonText1: {
        color: '#fff',
        fontSize: width * 0.045,
        fontWeight: 'bold',
    },
});
