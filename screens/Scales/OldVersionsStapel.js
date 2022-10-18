import React, { useState } from "react";
import {
  ScrollView,
  View,
  FlatList,
  StyleSheet,
  Text,
  Pressable,
  Modal,
  StatusBar,
} from "react-native";
import { Recommendation } from "react-native-recommendation";
import WebView from "../components/WebView";
import { useNavigation } from "@react-navigation/native";
import ScaleScreen from "../mainScreens/ScaleScreen";


let textList = [
  "FROM 9 -> 10",
  "FROM 6 -> 8",
  "FROM 5 -> 4",
  "FROM 2 -> 3",
  "FROM 0 -> 1",
];

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "defaultScale",
    url: "https://100035.pythonanywhere.com/nps-scale1/Test27102?brand_name=your brand&product_name=your product",
    bg: "blue",
    url_stapel: "https://100035.pythonanywhere.com/stapel/stapel-scale1/Testing9285?brand_name=your brand&product_name=your product",
    url_npslite:"https://100035.pythonanywhere.com/nps-lite/nps-lite-scale/kavin7824/?brand_name=your brand&product_name=your product",
    selectColor: "red",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "scaleAmbrose21",
    url: "https://100035.pythonanywhere.com/nps-scale1/Test2865?brand_name=your brand&product_name=your product",
    bg: "#c0392b",
    url_stapel: "https://100035.pythonanywhere.com/stapel/stapel-scale1/stapeltesting9256?brand_name=your brand&product_name=your product",
    url_npslite:"https://100035.pythonanywhere.com/nps-lite/nps-lite-scale/testnpslite3341/?brand_name=your brand&product_name=your product",
    selectColor: "red",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29dh2",
    title: "scale893dun",
    url: "https://100035.pythonanywhere.com/nps-scale1/Scaletest809?brand_name=your brand&product_name=your product",
    bg: "#3498db",
    url_stapel: "https://100035.pythonanywhere.com/stapel/stapel-scale1/Testing9729?brand_name=your brand&product_name=your product",
    url_npslite:"https://100035.pythonanywhere.com/nps-lite/nps-lite-scale/couzy1857/?brand_name=your brand&product_name=your product",
    selectColor: "#1abc9c",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d4l",
    title: "npsScalev4",
    url: "https://100035.pythonanywhere.com/nps-scale1/VOC_NPS7469?brand_name=your brand&product_name=your product",
    bg: "#9b59b6",
    url_stapel: "https://100035.pythonanywhere.com/stapel/stapel-scale1/stapeltesting12818?brand_name=your brand&product_name=your product",
    url_npslite:"https://100035.pythonanywhere.com/nps-lite/nps-lite-scale/Testing6708/?brand_name=your brand&product_name=your product",
    selectColor: "#2ecc71",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "newScale213",
    url: "https://100035.pythonanywhere.com/nps-scale1/Testing1205?brand_name=your brand&product_name=your product",
    url_npslite:"https://100035.pythonanywhere.com/nps-lite/nps-lite-scale/Ambro7931/?brand_name=your brand&product_name=your product",
    bg: "#2ecc71",
    url_stapel: "https://100035.pythonanywhere.com/stapel/stapel-scale1/stapeltesting9256?brand_name=your brand&product_name=your product",
    selectColor: "#9b59b6",
  },
];

const OldVersionsStapel = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const handleModal = () => {
    setModalVisible(true);
  };

  const Item = ({ title, indexKey, scaleUrl, backGround, sc }) => (
    <View style={styles.item} key={indexKey}>
      <Pressable  onPress={() =>
              navigation.navigate("FrameMain", { url: scaleUrl })
              // Alert.alert("Scale under construction")
            }>
        <Text style={styles.title}>{title}</Text>
      </Pressable>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item
      title={item.title}
      indexKey={item.id}
      scaleUrl={item.url_stapel}
      backGround={item.bg}
      sc={item.selectColor}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 3,
    marginHorizontal: 16,
    borderLeftColor: "green",
    borderLeftWidth: 2,
  },
  title: {},
  textWrapper: {
    marginTop: 20,
    flex: 1,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    marginTop: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  centeredViewModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    height: 50,
  },
});

export default OldVersionsStapel;
