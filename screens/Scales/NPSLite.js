import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  ScrollView,
  SafeAreaView
} from "react-native";
import WebView from "../components/WebView";
import OldVersions from "./OldVersions";
import React, { useState } from "react";


let textList = [
  "FROM 9 -> 10",
  "FROM 6 -> 8",
  "FROM 5 -> 4",
  "FROM 2 -> 3",
  "FROM 0 -> 1",
];

export default function NPSLiteScale() {
  return (
    <ScrollView style={styles.container}>
     
        {/* <NPSScaleHeader />   */}

        <View style={styles.textWrapper}>
          <WebView
            url={
              "https://100035.pythonanywhere.com/nps-lite/nps-lite-scale/defaultnplslite/?brand_name=your brand&product_name=your product"
            }
          />
        </View>
        <Text
          style={{
            color: "red",
            width: "100%",
            fontWeight: "bold",
            borderRadius: 20,
            padding: 10,
            // justifyContent: "center",
            alignContent: "center",
            marginTop: 30,
            fontSize: 15,
          }}
        >
          Old versions
        </Text>
        <OldVersions />
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
