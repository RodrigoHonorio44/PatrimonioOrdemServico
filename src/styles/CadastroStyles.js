import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: width * 0.05, // 5% da largura da tela
        backgroundColor: '#f0f0f0',
    },
    form: {
        backgroundColor: '#fff',
        padding: width * 0.05, // 5% da largura da tela
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        width: '100%',
        maxWidth: 600, // limite máximo pra não ficar gigante em tablets
        alignSelf: 'center',
    },
    title: {
        fontSize: width > 350 ? 24 : 20, // fonte menor em telas pequenas
        marginBottom: height * 0.03, // 3% da altura da tela
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#000',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: Platform.OS === 'ios' ? 14 : 10, // padding maior no iOS para melhorar toque
        marginBottom: height * 0.02, // 2% da altura da tela
        backgroundColor: '#fff',
        fontSize: width > 350 ? 16 : 14,
        color: '#000',
    },
});
