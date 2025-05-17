import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingBottom: 70, // espaço para a navbar
    },
    selector: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 40,
        marginTop: 60,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
});
