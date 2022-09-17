import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity} from 'react-native'

import PhoneInput from 'react-native-phone-number-input';


const PhoneNumberinput = () => { 
    const [phoneNumber, setPhoneNumber] = useState('')

    // const onGetPhoneNumberPressed =()

    return(
        <View style={styles.container}>
            <Text style={styles.text}>
                Phone number input
            </Text>

        <PhoneInput
            defaultValue={phoneNumber}
        />

        <TouchableOpacity onpress={onGetPhoneNumberPressed} style={styles.button}>
            <Text>
                Get Phone number
            </Text>
        </TouchableOpacity>
        </View>
        
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:"center"
    },

    text:{
        color:"grey",
        fontWeight:"bold"
    },

    button:{
        
    }
})

export default PhoneNumberinput;