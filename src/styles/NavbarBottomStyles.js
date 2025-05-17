import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    navbarSafeArea: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingVertical: width * 0.02, // responsivo
        paddingHorizontal: width * 0.025,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: width * 0.03,
    },
    navText: {
        fontSize: width * 0.03, // responsivo
        color: '#333',
        marginTop: width * 0.01,
        textAlign: 'center',
    },
});
