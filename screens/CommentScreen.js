import { StatusBar } from "expo-status-bar";
import { StyleSheet, ScrollView, Text, View, Image, Button } from "react-native";
import CommentHeader from "./components/Comment/CommentHeader"; 


export default function CommentScreen() {
  return (
    <View style={styles.container}>
      <CommentHeader />
      {/* <SafeAreaView style={styles.safeContainer}> */}
      <ScrollView style={styles.scrollView}>
        <View>
          
          <Text>
            <Image style={styles.imageStyle} source={{ uri: 'https://www.linkpicture.com/q/thinking.png', }} />
          </Text>
        </View>
        <View>
          <Text style={styles.textWrapper}>
            Do you recommned this app to your friends and colleagues {'\n'}{'\n'}{'\n'}{'\n'}
            <View style={{marginLeft: 10, borderRadius: 20,
            borderWidth: 1,
            borderColor: "green", }}>
                <Button title=" 😟 No"/>
              </View>
              <View style={styles.buttonContainer}>
                <Button title=" 🙂 May be"/>
              </View>
              <View style={styles.buttonContainer}>
                <Button title=" 😁 Yes"/>
              </View>
          </Text>
          
        </View>

        <View style={styles.textWrapper}>
          <Text>
            
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
    flexDirection: "row",
    borderColor: "green",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 20,
    marginTop: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  safeContainer: {
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: "#fff",
    alignItems: "center",
    
  },
  imageStyle: {
    width: 150,
    height: 150,
    marginTop: 10,
    marginLeft: 10,
   
   
    alignItems: "flex-start",
  },
  buttonContainer: {
    flexDirection: "row",
    marginLeft: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "green",
    paddingRight: 5,
    alignItems: "flex-start",
  },
});
