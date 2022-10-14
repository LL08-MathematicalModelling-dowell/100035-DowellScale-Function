import React from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar } from 'react-native';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'UI',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'what is',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29dh2',
    title: 'UX and',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d4l',
    title: 'Estimate',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Differ',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29e99',
    title: 'Customer',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29a19',
    title: 'Experience',
  },
  {
    id: '20684a7f-3da1-471f-bd96-145571e29d72',
    title: 'Layout',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e09d74',
    title: 'ddddd',
  },
  {
    id: '213564a0f-3da1-471f-bd96-145571e19d72',
    title: 'Layout',
  },
  {
    id: '58694a0f-3da1-441f-bd96-145571e29d32',
    title: 'Layout',
  },
  {
    id: '582134a0f-3da1-421f-bd96-145571e29d72',
    title: 'Layout',
  },
  {
    id: '58694a0f-3cv4-471f-bd96-145571e29d52',
    title: 'Layout',
  },
  {
    id: '58694a0f-0000-471f-bd96-145571e29d72',
    title: 'Layout',
  },

];

const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const NotifList = () => {
  const renderItem = ({ item }) => <Item title={item.title} />;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList data={DATA} renderItem={renderItem} keyExtractor={item => item.id} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 2,
    marginHorizontal: 16,
    borderLeftColor: 'green',
    borderLeftWidth: 4,
  },
  title: {
    
  },
});

export default NotifList;