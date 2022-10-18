import { View , Text, StyleSheet} from 'react-native'
import React from 'react'
import { SafeAreaView } from "react-native";
import WebView from '../components/WebView';
// import { WebView } from "react-native-webview";


export default function FrameMain({ route }) {
  const { url } = route.params;
  console.log(url)
  return (
    <SafeAreaView style={{ alignItems: "center", justifyContent: "center" }}>
      <View>
        {/* <Text style={{color: "teal"}}>Scale Preview</Text> */}
        <View style={styles.video}>
        <WebView
            url={
              `${url}`
            }
          />
        </View>
        
      </View>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  video: {
    marginTop: 20,
    maxHeight: 200,
    width: 320,
    flex: 1
  }
});
