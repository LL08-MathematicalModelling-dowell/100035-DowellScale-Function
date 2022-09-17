import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import cleaningSupply from '../../../assets/images/cleaningSupply.png'
import CustomButton from "./CustomButton";


const CustomAds = ({adText, buttonText, onPress}) => {

    return(
            <View style={styles.container}>
                    <Text style={styles.adText1}>
                        {adText}
                    </Text>
                    <CustomButton 
                        text={buttonText}
                        onpress={onPress}
                        type="SECONDARY"/>

                    <Image style={styles.image}
                    source={cleaningSupply}/>
            </View>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#FFFF',
        width: 320,
        height:168,
        borderRadius: 10,
    },

    adText1:{
        fontSize:20,
        fontWeight:"600",
        marginTop:30,
        marginLeft:10
    },

    image:{
        width:80,
        height:80,
        alignSelf:"flex-end",

        position:"absolute",
        top:60,
        right:20
       
    },

})

export default CustomAds;