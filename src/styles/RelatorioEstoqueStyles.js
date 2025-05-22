import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',
        padding: 15,
    },
    datePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        marginTop: 35,
    },
    datePicker: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        minWidth: 140,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    titulo: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        borderBottomWidth: 2,
        borderBottomColor: '#4a90e2',
        paddingBottom: 6,
        marginBottom: 10,
    },
    item: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginVertical: 6,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    negrito: {
        fontWeight: '600',
        color: '#222',
    },
});
