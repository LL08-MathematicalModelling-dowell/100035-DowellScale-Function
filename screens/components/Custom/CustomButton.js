import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

const CustomButton = ({ onPress, text, type = "PRIMARY", bgColor, fgColor }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.container, 
            styles[`container_${type}`],
            bgColor ? {backgroundColor: bgColor} : {}
            ]}>
            

            <Text
            style={[styles.text, 
            styles[`text_${type}`],
            fgColor ? {color: fgColor} : {}
            ]}>{text}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'green',
        width: '60%',

        padding: 15,
        marginVertical: 20,

        alignItems: 'center',
        borderRadius: 5

    },

    container_PRIMARY: {
        backgroundColor:"green",
        borderRadius: 5,
    },

    container_SECONDARY:{
        backgroundColor:"#FFC300",
        width:100,
        height:50,
        borderRadius: 5,
    },

    container_TERTIARY:{
        backgroundColor:"green",
        borderRadius: 5,

    },

    text: {
        color: "white",
        fontWeight: "bold",
        fontSize: 18,
        borderRadius: 5
    },

    text_TERTIARY: {
        color:"#0038FF"
    }

})

export default CustomButton;