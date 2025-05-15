import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f0f4f8', // cor de fundo suave
    },
    input: {
        height: 50,
        backgroundColor: '#ffffff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 12,
        elevation: 2,
    },
    signatureButton: {
        backgroundColor: '#4caf50',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 12,
        elevation: 2,
    },
    signatureButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    saveButton: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30, // adiciona espaço no final
        elevation: 3,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    titulo: {
        textAlign: 'center',
        marginTop: 30,
    },
    saveButton1: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25, // Borda arredondada
        alignItems: 'center',
        marginTop: 20,
        elevation: 5, // Sombra leve para dar destaque
        shadowColor: '#000', // Cor da sombra
        shadowOffset: { width: 0, height: 5 }, // Direção da sombra
        shadowOpacity: 0.2, // Opacidade da sombra
        shadowRadius: 5, // Abertura da sombra
    },
    saveButtonText1: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
