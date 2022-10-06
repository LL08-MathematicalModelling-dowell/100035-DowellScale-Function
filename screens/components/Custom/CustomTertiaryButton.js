import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native'

const CustomTertiaryButton = ({onPress, text}) => {
    return (
            <TouchableOpacity onPress={onPress}>
                <Text style={styles.Text}>{text}</Text>
            </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    Text:{
        color:"green",
        
        fontWeight:"bold",

        marginTop:10,
        marginBottom:10
    }
})

export default CustomTertiaryButton;

