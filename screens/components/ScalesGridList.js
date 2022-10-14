import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, FlatList, Alert, TouchableOpacity } from "react-native";
import { FlatGrid } from "react-native-super-grid";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";


export default function ScalesGridList() {
  const [items, setItems] = React.useState([
    // /Users/duncan/Downloads/Dowell-scales-beta-v2/assets/DOWELL_ICONS/Likert-scale (1).jpg
    { name: "NPSScale", code: "#1", image: "https://www.linkpicture.com/q/nps-scale_1.png" } ,
    { name: "RankScale", code: "#2", image: "https://www.linkpicture.com/q/nps-scale_1.png"},
    { name: "RatioScale", code: "#3", image: "https://www.linkpicture.com/q/nps-scale_1.png" },
    { name: "LikertScale", code: "#4", image: "https://www.linkpicture.com/q/Likert-scale-1_1.jpg" },
    { name: "NPSLite", code: "#5", image: "https://www.linkpicture.com/q/npsite-scale.jpg" },
    { name: "RatioScale", code: "#6", image: "https://www.linkpicture.com/q/scale_1.png" },
    { name: "StapelScale", code: "#7", image: "https://www.linkpicture.com/q/staple-scale_1.jpg" },
    { name: "PercentScale", code: "#8", image: "https://www.linkpicture.com/q/nps-scale_1.png" },
    { name: "PercentSum", code: "#9", image: "https://www.linkpicture.com/q/nps-scale_1.png" },
    { name: "GuttmanScale", code: "#10", image: "https://www.linkpicture.com/q/nps-scale_1.png" },
    { name: "MokkenScale", code: "#11", image: "https://www.linkpicture.com/q/nps-scale_1.png" },
    { name: "Thurstone Scale", code: "#12", image: "https://www.linkpicture.com/q/nps-scale_1.png" },
    { name: "Ranking", code: "#13", image: "https://www.linkpicture.com/q/nps-scale_1.png" },
    { name: "Q Sort", code: "#14", image: "https://www.linkpicture.com/q/nps-scale_1.png" },
    { name: "ScaleTE", code: "15", image: "https://www.linkpicture.com/q/nps-scale_1.png" },
    { name: "Scale", code: "#16", image: "https://www.linkpicture.com/q/nps-scale_1.png" },
    { name: "ScaleN", code: "#17", image: "https://www.linkpicture.com/q/nps-scale_1.png" },
    { name: "ScaleANATE", code: "#18", image: "https://www.linkpicture.com/q/nps-scale_1.png" },
    { name: "Scale", code: "#19", image: "https://www.linkpicture.com/q/nps-scale_1.png" },
    { name: "ScaleOS", code: "#20", image: "https://www.linkpicture.com/q/nps-scale_1.png" },
  ]);
  const navigation = useNavigation();
  return (
    <FlatGrid
      itemDimension={130}
      data={items}
      style={styles.gridView}
      // staticDimension={300}
      // fixed
      spacing={10}
      renderItem={({ item }) => (
        <View style={[styles.itemContainer, {backgroundColor: "green", background: item.image}]}>
          <TouchableOpacity style={{ flexWrap: "wrap" }}  >
            <Text
            style={styles.itemName}
            onPress={() =>
              navigation.navigate(item.name, { name: item.name })
              // Alert.alert("Scale under construction")
            }
          > 
            
          {item.name} {'\n'}</Text>
          <Image 
          style={{width: 140, height: 60, justifyContent: "space-around", alignSelf: "center",  }}
          source={{uri: item.image}} />
         
          </TouchableOpacity>
          {/* <Text style={styles.itemCode}>{item.code}</Text> */}
        </View>
      )}
    />
  );
}


const styles = StyleSheet.create({
  gridView: {
    marginTop: 10,
    flex: 1,
  },
  itemContainer: {
    // justifyContent: "center",
    borderRadius: 5,
    padding: 10,
    // height: "auto",
  },
  itemName: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    justifyContent: "center",
    alignSelf: "center",
  },
  itemCode: {
    fontWeight: "600",
    fontSize: 12,
    color: "red",
  },
});
