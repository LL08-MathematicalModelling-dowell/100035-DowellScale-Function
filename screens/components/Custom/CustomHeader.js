import React from 'react';
import { StatusBar } from 'expo-status-bar';
import headerbackground from '../../../assets/images/headerBackground.png'

import {StyleSheet, ImageBackground} from 'react-native';

const CustomHeader = () => {

    return(
            <ImageBackground 
            source = {headerbackground}
            style={styles.backgroundStyles}>
                <StatusBar style='auto'/>
            </ImageBackground>
    )
}

const styles = StyleSheet.create({
    backgroundStyles:{
        width:"100%",
        height:"50%",
    }
})

export default CustomHeader;