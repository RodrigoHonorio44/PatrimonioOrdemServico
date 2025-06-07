import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    messagesList: {
        padding: width * 0.025, // 2.5% da largura da tela
    },
    messageContainer: {
        marginVertical: height * 0.006, // espaçamento vertical relativo
        maxWidth: '75%',
    },
    myMessageContainer: {
        alignSelf: 'flex-end',
    },
    otherMessageContainer: {
        alignSelf: 'flex-start',
    },
    messageBubble: {
        borderRadius: 20,
        paddingVertical: height * 0.012, // padding vertical proporcional
        paddingHorizontal: width * 0.04, // padding horizontal proporcional
    },
    myMessageBubble: {
        backgroundColor: '#DCF8C6', // Verde claro WhatsApp
    },
    otherMessageBubble: {
        backgroundColor: '#ECECEC', // Cinza claro
    },
    messageText: {
        fontSize: width > 350 ? 16 : 14,
        color: '#000',
    },
    metaText: {
        fontSize: width > 350 ? 10 : 8,
        color: '#555',
        marginTop: height * 0.004,
        textAlign: 'right',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: width * 0.025,
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingHorizontal: width * 0.04,
        paddingVertical: Platform.OS === 'ios' ? height * 0.015 : height * 0.012,
        marginRight: width * 0.025,
        fontSize: width > 350 ? 16 : 14,
        color: '#000',
    },
    sendButton: {
        backgroundColor: '#25D366', // Verde WhatsApp
        borderRadius: 20,
        paddingHorizontal: width * 0.04,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: width > 350 ? 16 : 14,
    },
    dateSeparator: {
        alignItems: 'center',
        marginVertical: height * 0.012,
    },
    dateText: {
        fontSize: width > 350 ? 12 : 10,
        color: '#888',
        backgroundColor: '#eee',
        paddingHorizontal: width * 0.025,
        paddingVertical: height * 0.005,
        borderRadius: 10,
    },
    dateHeader: {
        alignItems: 'center',
        marginVertical: height * 0.012,
    },
    dateHeaderText: {
        fontSize: width > 350 ? 14 : 12,
        color: '#888',
        fontWeight: 'bold',
    },
});
