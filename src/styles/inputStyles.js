// src/styles/InputStyles.js
import colors from './colors';

export const inputStyles = {
    input: {
        height: 40,
        borderColor: colors.border,
        borderWidth: 1,
        paddingHorizontal: 10,
        fontSize: 16,
        color: colors.text,  // cor do texto digitado
        backgroundColor: colors.inputBackground,
        borderRadius: 4,
    },
    placeholderTextColor: colors.placeholder,  // cor do placeholder
};

export const pickerStyles = {
    picker: {
        height: 50,
        width: '100%',
        color: colors.text,  // cor do texto selecionado no picker
    },
};
