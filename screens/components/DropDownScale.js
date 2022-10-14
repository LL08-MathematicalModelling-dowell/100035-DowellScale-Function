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
    { id: 1, label: "NPS", value: "NPSscale" },
    { id: 2, label: "Rank", value: "RankScale" },
    { id: 3, label: "Ratio", value: "RatioScale" },
    { id: 4, label: "Likert", value: "LikertScale" },
    { id: 5, label: "NPS Lite", value: "NPSLite" },
    { id: 6, label: "Stapel", value: "StapelScale" },
    { id: 7, label: "Percent", value: "PercentScale" },
    { id: 8, label: "Percent Sum", value: "PercentSum" },
    { id: 9, label: "Guttmann", value: "GuttmanScale" },
    { id: 10, label: "Mokken", value: "MokkenScale" },
    { id: 11, label: "Thurstone", value: "ThurstoneScale" },
    { id: 12, label: "Ranking", value: "RankingScale" },
    { id: 13, label: "Q sort", value: "QSort" },
  ]);
  const onListPressed = () => {
    navigation.navigate(item.value, { name: item.value })
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
