import React, { useState } from 'react';
import {View, StyleSheet, Text, Image, useWindowDimensions, Alert, ScrollView} from 'react-native'
import { ToastProvider } from 'react-native-toast-notifications';

import { useNavigation } from '@react-navigation/native';


import Logo from '../../assets/images/dowellIcon.jpeg';
import CustomButton from '../components/Custom/CustomButton';
import CustomInput from '../components/Custom/CustomInput';
import CustomTertiaryButton from '../components/Custom/CustomTertiaryButton';
import CustomPhoneNumberinput from '../components/Custom/CustomPhoneNumberInput';

const SignupScreen = () => {

    const {height} = useWindowDimensions();

    const [Firstname, setFirstname] = useState('');

    const [Lastname, setLastname] = useState('');

    const [email, setEmail] = useState('');

    const [phoneNumber, setPhonenumber] = useState('');

    const [password, setPassword] = useState('');

    const [repeatPassword, setRepeatpassword] = useState('');

    const navigation = useNavigation()

    const onSignUpPressed = () => {
        navigation.navigate('Home')
    }

    const onLogibuttonpressed = () => {
        navigation.navigate('Sign in')
    }

    const onTermsofservicepressed = () => {
        Alert.alert(
            "Terms of service pressed"
        )
    }

    const onPrivatepolicypressed = () => {
        Alert.alert(
            "Private policy pressed"
        )
    }

    return (
        <ToastProvider>
            <ScrollView showsVerticalScrollIndicator={false}>
                    <View style = {styles.container}>
                            <Image source={Logo}
                                style={[styles.logo, {height: height * 0.3}]}
                                resizeMode="contain"
                            />

                            <Text style = {styles.title}>Sign Up Here</Text>

                            <CustomInput
                                placeholder="First Name"
                                value={Firstname}
                                setValue={setFirstname}
                            />

                            <CustomInput
                                placeholder="Last Name"
                                value={Lastname}
                                setValue={setLastname}
                            />

                            <CustomInput
                                placeholder="Kenyan Phone Number"
                                value={phoneNumber}
                                setValue={setPhonenumber}
                                keyboardType="phone-pad"
                            />
                            
                            <CustomInput
                                placeholder="Email Address"
                                value={email}
                                setValue={setEmail}
                                
                            />

                            <CustomInput
                                placeholder="Password"
                                value={password}
                                setValue={setPassword}
                                secureTextEntry={true}
                            />

                            <CustomInput
                                placeholder="Repeat Password"
                                value={repeatPassword}
                                setValue={setRepeatpassword}
                                secureTextEntry={true}
                            />

                            <CustomButton
                                text="Sign Up"
                                onPress={onSignUpPressed}
                            />

                            <Text style = {styles.text}>
                                By signing up, you confirm to our{' '} 
                                <Text style = {styles.link} onPress={onTermsofservicepressed}>Terms of use</Text> and 
                                {' '}<Text style = {styles.link} onPress={onPrivatepolicypressed}>privacy policy</Text> 
                            </Text>

                            <CustomTertiaryButton
                                onPress={onLogibuttonpressed}
                                text="Already have an account? Log in"
                            />
                    </View>
            </ScrollView>
        </ToastProvider>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        padding: 20,
        
    },

    logo: {
        maxWidth:300,
        maxHeight:200,
        width:100,
        
    },

    title:{
        fontSize:24,
        fontWeight:'bold',
        color:"#000",
        
    },

    text:{
        color:"grey",
        marginVertical:10
    },

    link:{
        color:"orange"
    },

    

    
})

export default SignupScreen;