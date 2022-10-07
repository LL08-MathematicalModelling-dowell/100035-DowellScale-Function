import * as React from "react";
import { View, StyleSheet } from "react-native";
import { RadioButton, Text } from "react-native-paper";

const MyComponent = () => {
  const [value, setValue] = React.useState("first");

  return (
    <RadioButton.Group
      onValueChange={(newValue) => setValue(newValue)}
      value={value}
      style={styles.container}
    >
      <View>
        <Text>Scale</Text>
        <RadioButton value="first" />
      </View>
      <View>
        <Text>Keyword</Text>
        <RadioButton value="second" />
      </View>
    </RadioButton.Group>
  );
};

export default MyComponent;

const styles = StyleSheet.create({
  container: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
});
