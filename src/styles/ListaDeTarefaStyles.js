import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    wrapper: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: height * 0.15, // espaço proporcional para navbar
    },
    container: {
        padding: width * 0.04, // padding proporcional à largura
    },
    title: {
        fontSize: width > 350 ? 22 : 18,
        fontWeight: 'bold',
        marginBottom: height * 0.015,
        textAlign: 'center',
        marginTop: height * 0.06,
    },
    inputMultiline: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: width * 0.035,
        height: height * 0.18, // altura proporcional
        textAlignVertical: 'top',
        marginBottom: height * 0.02,
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
        color: '#fff',
        fontSize: width > 350 ? 16 : 14,
        fontWeight: 'bold',
    },
    filterLabel: {
        marginTop: height * 0.015,
        marginBottom: height * 0.006,
        fontWeight: 'bold',
        fontSize: width > 350 ? 14 : 12,
    },
    picker: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: height * 0.015,
        marginTop: height * 0.015,
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
