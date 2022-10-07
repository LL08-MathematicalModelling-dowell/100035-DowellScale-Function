import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import SignupScreen from "./SignupScreen";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { ToastProvider } from "react-native-toast-notifications";
import Logo from "../../assets/icon.png";
import CustomInput from "../components/Custom/CustomInput";

export default function SigninScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onLoginbuttonpressed = () => {
    navigation.navigate("ScaleScreen");
  };
  const onSignUpbuttonpressed = () => {
    navigation.navigate("Signup");
  };

  const onForgotbuttonpressed = () => {
    navigation.navigate("ForgotPassword");
  };

  return (
    <ToastProvider>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <StatusBar style="auto" />

          <Image source={Logo} style={[styles.logo]} resizeMode="contain" />

          <CustomInput
            style={styles.TextInput}
            placeholder="Email."
            placeholderTextColor="black"
            onChangeText={(email) => setEmail(email)}
          />

          <CustomInput
            style={styles.TextInput}
            placeholder="Password."
            placeholderTextColor="black"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />

          <TouchableOpacity>
            <Text style={styles.forgot_button} onPress={onForgotbuttonpressed}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.signUp_button} onPress={onSignUpbuttonpressed}>
              New User? Create Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginBtn}>
            <Text style={styles.loginText} onPress={onLoginbuttonpressed}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },

  image: {
    marginBottom: 40,
    height: 200,
    width: 200,
  },

  forgot_button: {
    height: 30,
  },
  signUp_button: {
    color: "red",
  },
  logo: {
    maxWidth: 300,
    maxHeight: 200,
    width: 200,
  },
  loginBtn: {
    width: "50%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "green",
  },
  loginText: {
    color: "white",
    fontSize: 18,
  },
});
