import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Image,
  useWindowDimensions,
  Alert,
  ScrollView,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import Logo from "../../assets/icon.png";
import CustomInput from "../components/Custom/CustomInput";
import CustomButton from "../components/Custom/CustomButton";
import CustomTertiaryButton from "../components/Custom/CustomTertiaryButton";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const [emailOTP, setEmailOTP] = useState("");

  const { height } = useWindowDimensions();

  const navigation = useNavigation();

  const onSigninpressed = () => {
    navigation.navigate("Signin");
  };

  const onEmailOTPpressed = () => {
    Alert.alert("Email OTP Pressed");
  };

  const onNextpressed = () => {
    navigation.navigate("Reset Password");
  };

  const onBacktosigninpressed = () => {
    navigation.navigate("Sign in");
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Image
          source={Logo}
          style={[styles.logo, { height: height * 0.3 }]}
          resizeMode="contain"
        />

        <Text style={styles.title}>Forgot password</Text>

        <CustomInput
          placeholder="Email Address"
          value={email}
          setValue={setEmail}
          autoCapitalize={"none"}
          keyboardType="phone-pad"
        />

        <CustomButton text="Get Email OTP " onPress={onEmailOTPpressed} />

        <CustomInput
          placeholder="Email OTP"
          value={emailOTP}
          setValue={setEmailOTP}
          textAlign={"center"}
          keyboardType={"number-pad"}
        />

        <CustomButton text="Next" onPress={onNextpressed} />

        <CustomTertiaryButton
          text="Back to sign in"
          onPress={onBacktosigninpressed}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },

  logo: {
    maxWidth: 300,
    maxHeight: 200,
    width: 100,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    margin: 10,
  },
});

export default ForgotPassword;
