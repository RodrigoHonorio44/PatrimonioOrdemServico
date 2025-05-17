import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: width * 0.035,  // responsivo
        paddingHorizontal: width * 0.04,
        backgroundColor: '#000367',
        alignItems: 'center',
        width: '100%',
    },
    title: {
        color: 'white',
        fontSize: width * 0.045,  // responsivo
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: '#FF3B30',
        paddingVertical: width * 0.015,
        paddingHorizontal: width * 0.03,
        borderRadius: 5,
    },
    logoutText: {
        color: 'white',
        fontSize: width * 0.035,
    },
});

export default styles;
