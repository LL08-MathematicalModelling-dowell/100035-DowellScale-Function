import React from "react";
import { SafeAreaView, StyleSheet, TextInput, Button } from "react-native";

const ScaleSaveInput = () => {
  const [text, onChangeText] = React.useState("Search for old versions");
//   const [text2, onChangeButton] = React.useState("Save");


  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
      />
      {/* <TextInput
        style={styles.input2}
        onChangeText={onChangeButton}
        value={text2}
      /> */}
      {/* <Button title="Save" onPress={() => alert("Saved")} style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row'}} /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: 'row',
    height: 20,
    fontWeight: "bold",
    justifyContent: 'flex-start'
    // justifyContent: 'space-between',
  },
  input: {
    height: 40,
    margin: 10,
    width: '70%',
    borderWidth: 0.2,
    borderLeftColor: 'green',
    borderLeftWidth: 3,
    padding: 10,
  },
  input2: {
    height: 40,
    margin: 10,
    width: '20%',
    borderWidth: 3,
    borderRadius: 20,
    borderColor: 'green',
    padding: 10,
    textAlign: 'center',
    backgroundColor: 'white',
    color: 'green'
  },
});

export default ScaleSaveInput;