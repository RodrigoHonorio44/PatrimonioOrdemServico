import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const isSmallDevice = width < 360;
const baseFontSize = isSmallDevice ? 14 : 16;
const basePadding = isSmallDevice ? 10 : 12;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eef',
        padding: basePadding * 2,
        paddingBottom: 80,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 80,
        minHeight: '100%',
    },
    title: {
        fontSize: baseFontSize + 8,
        fontWeight: 'bold',
        paddingTop: 35,
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: basePadding,
        marginBottom: basePadding,
        borderRadius: 8,
        backgroundColor: '#fff',
        fontSize: baseFontSize,
        color: '#000', // texto dentro do input em preto
        placeholderTextColor: '#888', // cor do placeholder
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        gap: 10,
        flexWrap: 'wrap',
    },
    dateText: {
        fontSize: baseFontSize,
        color: '#333',
    },
    relatorioContainer: {
        marginTop: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: basePadding * 1.5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 3,
        width: '100%',
        maxWidth: 600,
        alignSelf: 'center',
    },
    subtitle: {
        fontSize: baseFontSize + 2,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#333',
    },
    relatorioContent: {
        marginTop: 10,
    },
    unidadeItem: {
        backgroundColor: '#f9f9f9',
        padding: basePadding,
        borderRadius: 8,
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#1E90FF',
    },
    unidadeText: {
        fontSize: baseFontSize,
        color: '#333',
    },
    totalText: {
        fontSize: baseFontSize,
        fontWeight: 'bold',
        color: '#1E90FF',
        marginBottom: 12,
        textAlign: 'center',
    },
    noDataText: {
        fontSize: baseFontSize,
        color: 'gray',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 20,
    },

    navbarContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: Platform.OS === 'ios' ? 20 : 15,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        elevation: 10,
        zIndex: 1000,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonContainer: {
        marginBottom: 15,
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
    },
    loadingText: {
        fontSize: baseFontSize,
        fontStyle: 'italic',
        textAlign: 'center',
        marginVertical: 10,
        color: '#555',
    },
});
