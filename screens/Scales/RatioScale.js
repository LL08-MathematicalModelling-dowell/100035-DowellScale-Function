import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,

} from "react-native";

import WebView from "react-native-webview";

import React, { useState } from "react";


export default function RatioScale() {
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
        <View style={styles.textWrapper}>
          <WebView
            url={
              "https://100035.pythonanywhere.com/nps-scale1/VOC_NPS7469?brand_name=your brand&product_name=your product"
            }
          />
        </View>
        
      
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
