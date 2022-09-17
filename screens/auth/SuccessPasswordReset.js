import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image, useWindowDimensions, Alert, ScrollView, Text } from 'react-native';
import { useNavigation} from '@react-navigation/native';

import Logo from '../../assets/images/dowellIcon.jpeg';
import CustomInput from '../components/Custom/CustomInput';
import CustomButton from '../components/Custom/CustomButton';
import CustomTertiaryButton from '../components/Custom/CustomTertiaryButton';



const SuccessPasswordReset = () => {

    const { height } = useWindowDimensions();

    const navigation = useNavigation();

    const onSigninPressed = () => {
        navigation.navigate('Sign in')
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <Image source={Logo}
                    style={[styles.logo, { height: height * 0.3 }]}
                    resizeMode="contain"
                />

                <Text style = {styles.title}>Password reset successfully</Text>

                <CustomButton 
                text="Sign in" 
                onPress={onSigninPressed}
                />

            </View>
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },

    logo: {
        maxWidth: 300,
        maxHeight: 200,
        width: 100,
    },

    title:{
        fontSize:24,
        fontWeight:'bold',
        color:"#000",
        margin:10,
    }
});

export default SuccessPasswordReset;
