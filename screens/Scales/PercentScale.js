import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  ScrollView,

} from "react-native";


import React, { useState } from "react";


export default function PercentScale() {
  return (
    <ScrollView style={styles.container}>
     <Text
          style={{
            color: "red",
            width: "100%",
            fontWeight: "bold",
            borderRadius: 20,
            padding: 10,
            alignContent: "center",
            marginTop: 30,
            fontSize: 15,
          }}
        >
          Scale Under Construction
        </Text>
     
        
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: "green",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 20,
    margin: 5,
    marginBottom: 0,
    bottom: 0,
  },
  textWrapper: {
    flexDirection: "row",
    borderColor: "green",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 20,
    margin: 10,
    padding: 10,
    bottom: 0,
    alignItems: "center",
  },
});
