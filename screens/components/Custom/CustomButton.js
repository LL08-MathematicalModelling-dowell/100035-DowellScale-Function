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
        backgroundColor: '#06B6D4',
        width: '100%',

        padding: 15,
        marginVertical: 20,

        alignItems: 'center',
        borderRadius: 5

    },

    container_PRIMARY: {
        backgroundColor:"#06B6D4",

    },

    container_SECONDARY:{
        backgroundColor:"#FFC300",
        width:100,
        height:50,
    },

    container_TERTIARY:{},

    text: {
        color: "white",
        fontWeight: "bold"
    },

    text_TERTIARY: {
        color:"#0038FF"
    }

})

export default CustomButton;