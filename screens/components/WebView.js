import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native";
import { WebView } from "react-native-webview";

const Webview = ({ url }) => {
  return (
    <SafeAreaView style={{ flex: 1, height: 225 }}>
      <WebView
        source={{
          uri: url,
        }}
      />
    </SafeAreaView>
  );
};

export default Webview;
