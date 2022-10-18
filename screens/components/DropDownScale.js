import DropDownPicker from "react-native-dropdown-picker";
import { useState } from "react";
import ScaleHeader from "./ScaleHeader";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View, Image, FlatList, Alert, TouchableOpacity } from "react-native";

function DropScale() {

  const navigation = useNavigation();
  
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { id: 1, label: "NPS", name: "NPSscale" },
    { id: 2, label: "Rank", name: "RankScale" },
    { id: 3, label: "Ratio", name: "RatioScale" },
    { id: 4, label: "Likert", name: "LikertScale" },
    { id: 5, label: "NPS Lite", name: "NPSLite" },
    { id: 6, label: "Stapel", name: "StapelScale" },
    { id: 7, label: "Percent", name: "PercentScale" },
    { id: 8, label: "Percent Sum", name: "PercentSum" },
    { id: 9, label: "Guttmann", name: "GuttmanScale" },
    { id: 10, label: "Mokken", name: "MokkenScale" },
    { id: 11, label: "Thurstone", name: "ThurstoneScale" },
    { id: 12, label: "Ranking", name: "RankingScale" },
    { id: 13, label: "Q sort", name: "QSort" },
  ]);
  const onListPressed = () => {
    navigation.navigate(item.name, { name: item.name })
  };
  // NPS
  // NPS Lite
  // Stapel
  // Likert
  // Percent
  // Percent Sum
  // Guttmann
  // Mokken
  // Thurstone
  // Ranking
  // Q sort//

  return (
    <View onPress={onListPressed}>
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      // onPress={onListPressed}
      setItems={setItems}
      placeholder="Drop down (Scales)"
      containerStyle={{ width: 340, marginLeft: 10, alignItems: "center" }}
      style={{
        justifyContent: "center",
        alignSelf: "center",
        alignItems: "center",
        backgroundColor: "#fafafa",
        borderLeftColor: "green",
        borderLeftWidth: 5,
        borderRadius: 5,
        borderColor: "transparent",
        flexDirection: "row",
        alignContent: "center",
        width: 340,
        maxWidth: 400,
        margin: 10,
        // height: 30,
        color: "green",
      }}
    />
    </View>
  );
}

export default DropScale;
