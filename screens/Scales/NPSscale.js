import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  ScrollView,
} from "react-native";
import { Recommendation, Rating } from "react-native-recommendation";
// import Line from './components/Line';
import NPSScaleHeader from "./NPSScaleHeader";
import TextInput from "./TextInput";
import OldVersions from "./OldVersions";
import ReportTable from "../../screens/components/Reports/ReportTable";
import React, { useState } from "react";
import NpsSettings from "../components/NpsSettings";

let textList = [
  "FROM 9 -> 10",
  "FROM 6 -> 8",
  "FROM 5 -> 4",
  "FROM 2 -> 3",
  "FROM 0 -> 1",
];

export default function NPSScale() {
  return (
    <ScrollView>
      <View style={styles.container}>
        {/* <NPSScaleHeader />   */}

        <Recommendation
          titleText={
            "Considering your experience with <product>, how likely would you be to recommend <product> to your friend or colleague"
          }
          titleStyle={{
            alignSelf: "center",
            backgroundColor: "orange",
            padding: 10,
            marginTop: 10,
            fontColor: "red",
            fontSize: 10,
            fontWeight: "bold",
            color: "red",
          }}
          selectedColor={"orange"}
          selectedTextColor={"white"}
          unSelectedTextColor={"red"}
          selectedSize={30}
          max={10}
          reactionTextList={textList}
          // backgroundColor={'orange'}
          style={{
            flexDirection: "row",
            borderColor: "green",
            borderWidth: 1,
            borderStyle: "solid",
            borderRadius: 20,
            margin: 10,
            padding: 10,
            bottom: 0,
            alignSelf: "center",
            justifyContent: "space-between",
          }}
          // Remove this to disable reaction icon and text
        />
        {/* <TextInput /> */}
        {/* <Text
          style={{
            color: "red",
            width: "100%",
            fontWeight: "bold",
            borderRadius: 20,
            padding: 10,
            justifyContent: "center",
            alignContent: "center",
            marginTop: 10,
            fontSize: 15,
          }}
        ></Text> */}
        <NpsSettings />
        <Text
          style={{
            color: "red",
            width: "100%",
            fontWeight: "bold",
            borderRadius: 20,
            padding: 10,
            justifyContent: "center",
            alignContent: "center",
            marginTop: 30,
            fontSize: 15,
          }}
        >
          Old versions
        </Text>
        <OldVersions />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'row',
    // backgroundColor: '#fff',
    // // alignItems: 'center',
    // justifyContent: 'space-evenly',
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
