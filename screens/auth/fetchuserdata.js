import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';



const fetchuserdata = () => {

    return(
            <View>
                <Text>
                    User Data from Django
                </Text>
            </View>
    )
}

const styles = StyleSheet.create({
    backgroundStyles:{
        flex:1,
        justifyContent: 'center',
        alignItems:"center"
        
        
    }
})

export default fetchuserdata;