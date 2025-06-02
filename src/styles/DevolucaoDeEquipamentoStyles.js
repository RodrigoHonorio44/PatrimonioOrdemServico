import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Função para calcular tamanho responsivo da fonte
function responsiveFontSize(size) {
    // baseia-se na largura da tela (pode ser ajustado para altura também)
    const scale = width / 375; // 375 é a largura base do iPhone 6/7/8
    const newSize = size * scale;
    return Math.round(newSize);
}

export const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: width * 0.05,  // 5% da largura da tela
        paddingVertical: height * 0.02,   // 2% da altura da tela
        backgroundColor: '#f5f5f5',
        justifyContent: 'flex-start',
    },
    titulo: {
        fontSize: responsiveFontSize(24),
        fontWeight: 'bold',
        marginBottom: height * 0.03,  // 3% da altura
        textAlign: 'center',
        color: '#333',
    },
    picker: {
        height: Platform.OS === 'ios' ? 150 : 50,  // picker no iOS ocupa mais espaço
        marginBottom: height * 0.025,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    label: {
        fontSize: responsiveFontSize(16),
        fontWeight: '600',
        marginBottom: height * 0.01,
        color: '#555',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: width * 0.03,
        marginBottom: height * 0.02,
        backgroundColor: '#fff',
        color: '#333',
        fontSize: responsiveFontSize(14),
    },
    botao: {
        backgroundColor: '#2196F3',
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.07,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: height * 0.015,
    },
    botaoTexto: {
        color: '#fff',
        fontSize: responsiveFontSize(16),
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        marginBottom: height * 0.015,
        fontSize: responsiveFontSize(12),
    },
});
