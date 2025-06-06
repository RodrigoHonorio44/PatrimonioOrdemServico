import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        padding: width * 0.05, // 5% da largura
        paddingBottom: height * 0.1, // 10% da altura para navbar
    },
    label: {
        fontSize: width > 350 ? 16 : 14,
        fontWeight: 'bold',
        marginTop: height * 0.02,
        color: '#333',
    },
    input: {
        padding: width * 0.035,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        marginTop: height * 0.006,
        marginBottom: height * 0.013,
        fontSize: width > 350 ? 16 : 14,
        color: '#333',
    },
    lista: {
        marginTop: height * 0.025,
        marginBottom: height * 0.025,
    },
    item: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: width * 0.04,
        marginBottom: height * 0.015,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    negrito: {
        fontWeight: 'bold',
    },
    titulo: {
        fontSize: width > 350 ? 24 : 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: height * 0.03,
        marginTop: height * 0.06,
        color: '#333',
    },
    navbarContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.04,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
});
