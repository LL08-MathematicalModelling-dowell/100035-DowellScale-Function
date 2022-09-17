import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native'
import PhoneInput from 'react-native-phone-number-input';

const CustomPhoneNumberinput = ({ number, setNumber}) => {
    return (
        <View style={styles.container}>
            <PhoneInput
                value={number}
                onChangeValue={setNumber}
                defaultCode='KE'
                placeholder='Phone Number'
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',
        height: 50,

        borderColor: "#e8e8e8",
        borderWidth: 1,
        borderRadius: 5,

        paddingHorizontal: 5,
        marginVertical: 10,
    },
    textcontainerstyle:{
        margin:20
    }
})

export default CustomPhoneNumberinput;