import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import React, { useState } from 'react';

export default function ScalesGridList() {
  const [items, setItems] = React.useState([
    { name: 'NPS Scale', code: '#1abc9c' },
    { name: 'Rank Scale', code: '#2ecc71' },
    { name: 'Ratio Scale', code: '#3498db' },
    { name: 'Likert Scale', code: '#9b59b6' },
    { name: 'Scale- Save 1', code: '#9b59b6' },
    { name: 'Scale- Save 2', code: '#9b59b6' },
    { name: 'ScaleTIS', code: '#9b59b6' },
    { name: 'Scale HOLE', code: '#9b59b6' },
    { name: 'ScaleIA', code: '#9b59b6' },
    { name: 'ScaleHT BLUE', code: '#9b59b6' },
    { name: 'ScaleOWER', code: '#9b59b6' },
    { name: 'Scale', code: '#9b59b6' },
    { name: 'ScaleIN', code: '#9b59b6' },
    { name: 'Scale', code: '#9b59b6' },
    { name: 'ScaleTE', code: '#95a5a6' },
    { name: 'Scale', code: '#9b59b6' },
    { name: 'ScaleN', code: '#d35400' },
    { name: 'ScaleANATE', code: '#c0392b' },
    { name: 'Scale', code: '#bdc3c7' },
    { name: 'ScaleOS', code: '#7f8c8d' },
  ]);

  return (
    <FlatGrid
      itemDimension={130}
      data={items}
      style={styles.gridView}
      // staticDimension={300}
      // fixed
      spacing={10}
      renderItem={({ item }) => (
        <View style={[styles.itemContainer, { backgroundColor: item.code }]}>
          <Text style={styles.itemName}>{item.name}</Text>
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
    justifyContent: 'flex-start',
    borderRadius: 5,
    padding: 10,
    height: 150,
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    justifyContent:'flex-start',
    alignSelf:'flex-start',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: 'red',
  },
});