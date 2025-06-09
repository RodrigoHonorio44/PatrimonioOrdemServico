import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        paddingHorizontal: width * 0.05,
        paddingTop: height * 0.06,
        paddingBottom: height * 0.1,
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
    textCard: {
        fontSize: width > 350 ? 15 : 13,
        color: '#333',
        marginBottom: height * 0.005,
    },
    negrito: {
        fontWeight: 'bold',
        color: '#222',
    },
    titulo: {
        fontSize: width > 350 ? 22 : 18,
        fontWeight: 'bold',
        marginBottom: height * 0.03,
        color: '#222',
        alignSelf: 'center',
    },
});
