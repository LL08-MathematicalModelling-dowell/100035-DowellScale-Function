import React from "react";
import {
  ScrollView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
} from "react-native";

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "defaultScale",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "scaleAmbrose21",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29dh2",
    title: "scale893dun",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d4l",
    title: "npsScalev4",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "newScale213",
  },
];

const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const OldVersions = () => {
  const renderItem = ({ item }) => <Item title={item.title} />;

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
});

export default OldVersions;
