import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native'


const CustomInput = ({ value, setValue, placeholder, secureTextEntry, keyboardType, phoneNumber, setPhonenumber, textAlign, autoCapitalize}) => {
    return (
        <View style={styles.container}>
            <TextInput
                value={value}
                onChangeText={setValue}
                placeholder={placeholder}
                style={styles.input}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                textAlign={textAlign}
                autoCapitalize={autoCapitalize}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',
        height: 38,

        borderColor: "#e8e8e8",
        borderWidth: 1,
        borderRadius: 4,

        paddingHorizontal: 5,
        marginVertical: 10,
    },

    input:{
        paddingVertical:10,
    }
})

export default CustomInput;