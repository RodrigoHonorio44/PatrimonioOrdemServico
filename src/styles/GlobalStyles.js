import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scaleWidth = size => (width / guidelineBaseWidth) * size;
const scaleHeight = size => (height / guidelineBaseHeight) * size;

const GlobalStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: '5%',
        position: 'relative',
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: width,
        height: height,
        zIndex: -1,
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        width: '100%',
        maxWidth: 360,
        borderRadius: scaleWidth(12),
        paddingVertical: scaleHeight(24),
        paddingHorizontal: scaleWidth(20),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 8,
        alignItems: 'center',
    },
    title: {
        fontSize: scaleWidth(24),
        fontWeight: 'bold',
        marginBottom: scaleHeight(10),
        color: '#333',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: scaleWidth(15),
        color: '#666',
        marginBottom: scaleHeight(20),
        textAlign: 'center',
    },
    input: {
        height: scaleHeight(48),
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: scaleWidth(8),
        paddingHorizontal: scaleWidth(14),
        backgroundColor: '#fff',
        marginBottom: scaleHeight(16),
        color: '#333',
        fontSize: scaleWidth(16),
    },
    button: {
        height: scaleHeight(48),
        width: '100%',
        backgroundColor: '#4a90e2',
        borderRadius: scaleWidth(8),
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: scaleWidth(16),
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default GlobalStyles;
export { scaleWidth, scaleHeight };
