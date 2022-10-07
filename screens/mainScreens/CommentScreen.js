import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Image,
  Button,
} from "react-native";
import { TextInput } from "react-native-paper";
import CommentHeader from "../components/Comment/CommentHeader";

export default function CommentScreen() {
  return (
    <View style={styles.container}>
      <CommentHeader />
      {/* <SafeAreaView style={styles.safeContainer}> */}
      <ScrollView style={styles.scrollView}>
        <View
          style={{
            borderColor: "green",
            borderWidth: 1,
            borderStyle: "solid",
            marginTop: 10,
            borderRadius: 20,
            marginBottom: 10,
          }}
        >
          <Image
            style={styles.imageStyle}
            source={{ uri: "https://www.linkpicture.com/q/thinking.png" }}
          />
          <View style={styles.textWrapper}>
            <Text style={{ margin: 10, padding: 10 }}>
              Contribute your comments and suggestions about DoWell Scale App in
              2 minutes and get rewarded
            </Text>
            <TextInput
              style={{
                borderColor: "green",
                backgroundColor: "white",
                borderRadius: 20,
                padding: 10,
              }}
            ></TextInput>
          </View>
        </View>
        <View
          style={{
            marginTop: 40,
            flexDirection: "row",
            marginHorizontal: 10,
            borderColor: "green",
            borderWidth: 1,
            borderStyle: "solid",
            borderRadius: 20,
            padding: 20,
          }}
        >
          <Text>
            Do you recommend this app to your friends and colleagues {"\n"}
            {"\n"}
            <View
              style={{
                marginLeft: 40,
              }}
            >
              <Button title=" 😟 No" style={styles.buttonContainer} />
            </View>
            <View>
              <Button title=" 🙂 May be" style={styles.buttonContainer} />
            </View>
            <View>
              <Button title=" 😁 Yes" style={styles.buttonContainer} />
            </View>
          </Text>
        </View>

        <StatusBar style="auto" />
        {/* </SafeAreaView> */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderColor: 'green',
    // borderWidth: 1,
    // borderStyle: 'solid',
    // borderRadius: 20,
    margin: 5,
    marginTop: 40,
    marginBottom: 0,
    bottom: 0,
  },
  textWrapper: {
    flexDirection: "column",
    borderColor: "green",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 20,
    marginTop: 20,
    padding: 10,
    margin: 20,
    width: "90%",
    justifyContent: "center",
  },
  safeContainer: {
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  imageStyle: {
    width: 200,
    height: 200,
    marginTop: 10,
    marginLeft: 10,

    // alignItems: "flex-start",
  },
  buttonContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "green",
    paddingRight: 5,
    marginLeft: 40,
    // alignItems: "flex-start",
  },
});
