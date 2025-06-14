import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        padding: width * 0.05,
        backgroundColor: '#f0f4f8',
        flexGrow: 1,
    },
    titulo: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: height * 0.03,
        color: '#333',
        marginTop: 45,
    },
    input: {
        height: height * 0.07,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: width * 0.04,
        fontSize: width * 0.04,
        marginBottom: height * 0.02,
        color: '#000',
    },
    pickerWrapper: {
        position: 'relative',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 16,
        height: 50,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },

    picker: {
        width: '100%',
        color: '#000',
        paddingLeft: 10,
    },

    pickerIcon: {
        position: 'absolute',
        right: 10,
        top: 11,
        pointerEvents: 'none',
    },

    saveButton: {
        backgroundColor: '#007bff',
        paddingVertical: height * 0.018,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: height * 0.02,
        elevation: 3,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: width * 0.045,
        fontWeight: 'bold',
    },
});
