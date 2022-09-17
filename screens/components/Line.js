import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';


export default function Line() {
    return (
        <View
        // style={{
        //     borderBottomColor: 'black',
        //     borderBottomWidth: 1,
        // }}
        >
         <Text 
          style={{
            // flexDirection: 'row',
            flex: 1,
            marginBottom: 615,
            alignSelf:'flex-start',
            // margin: 0,
            // paddingTop: 10,
            color: 'green'
      }}
        >
          ________________________________________
          {"\n"}
        </Text>
     
      </View>
    )
}