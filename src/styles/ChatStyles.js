import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    messagesList: {
        padding: 10,
    },
    messageContainer: {
        marginVertical: 5,
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
        padding: 10,
    },
    myMessageBubble: {
        backgroundColor: '#DCF8C6',  // Verde claro WhatsApp
    },
    otherMessageBubble: {
        backgroundColor: '#ECECEC',  // Cinza claro
    },
    messageText: {
        fontSize: 16,
        color: '#000',
    },
    metaText: {
        fontSize: 10,
        color: '#555',
        marginTop: 5,
        textAlign: 'right',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#25D366', // Verde WhatsApp
        borderRadius: 20,
        paddingHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    dateSeparator: {
        alignItems: 'center',
        marginVertical: 10,
    },

    dateText: {
        fontSize: 12,
        color: '#888',
        backgroundColor: '#eee',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    dateHeader: {
        alignItems: 'center',
        marginVertical: 10,
    },
    dateHeaderText: {
        fontSize: 14,
        color: '#888',
        fontWeight: 'bold',
    },


});
