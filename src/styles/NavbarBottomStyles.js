import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    navbarSafeArea: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 8,
        paddingBottom: 16, // espaço extra para área segura (botões do sistema)
        zIndex: 10,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },
    navText: {
        fontSize: 12,
        color: '#333',
        marginTop: 4,
    },
});
