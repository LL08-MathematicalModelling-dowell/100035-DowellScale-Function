import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import SigninScreen from "../auth/SigninScreen";
import SignupScreen from "../auth/SignupScreen";

export default function Profile({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={{ color: "green" }}>Login</Text>

      <Text style={{ color: "green" }}>
        Notifications after full login/join us.{"\n"}
        Others after link based login {"\n"}
      </Text>
      <View
        style={{
          marginBottom: 10,
        }}
      >
        <Button
          title="Proceed to Sign In"
          
          onPress={() => Alert.alert("Full Sign Up available in version 2")}
          style={{
            color: "green",
            size: "70%",
          }}
        />
      </View>
      <View
        style={{
          color: "green",
          justifyContent: "space-evenly",
          marginBottom: 10,
        }}
      >
        <Button
          title="Register a new account"
          // onPress={() => navigation.navigate("Signup")}
          onPress={() => Alert.alert("Full Sign Up available in version 2")}
          style={{
            backgroundColor: "green",
          }}
        />
      </View>
      <View
        style={{
          borderColor: "green",
        }}
      >
        <Button title=" 😁 " />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    borderStyle: "solid",
    borderRadius: 20,
    margin: 5,
    marginBottom: 0,
  },
});

// onPress={()=>this.props.navigation.navigate("SigninScreen")
