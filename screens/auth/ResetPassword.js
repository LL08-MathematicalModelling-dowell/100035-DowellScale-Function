import React from "react";
import { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  useWindowDimensions,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import Logo from "../../assets/images/dowellIcon.jpeg";
import CustomButton from "../components/Custom/CustomButton";
import CustomInput from "../components/Custom/CustomInput";
import CustomTertiaryButton from "../components/Custom/CustomTertiaryButton";

const ResetPassword = () => {
  const { height } = useWindowDimensions();

  const [password, setPassword] = useState("");

  const Navigation = useNavigation();

  const onResetpasswordpressed = () => {
    Navigation.navigate("SuccessPasswordReset");
  };

  const onBacktosigninpressed = () => {
    Navigation.navigate("Sign in");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      <CustomInput
        placeholder="Password"
        value={password}
        setValue={setPassword}
        secureTextEntry={true}
      />

      <CustomButton text="Reset Password" onPress={onResetpasswordpressed} />

      <CustomTertiaryButton
        text="Back to sign in"
        onPress={onBacktosigninpressed}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  },
});

export default ResetPassword;
