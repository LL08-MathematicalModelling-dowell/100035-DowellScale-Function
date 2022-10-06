import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
// import Line from './components/Line';



export default function Notifications() {
    return (
      <View style={styles.container}>
        <Text style={{alignContent: "flex-start"}}>
        Notifications
        </Text>
        {/* <Text style={{ flexDirection: 'row-reverse' }}>
        Icon
        </Text> */}
        {/* <View>
          <Image source={{uri: 'https://reactjs.org/logo-og.png'}}
       style={{width: 50, height: 50, marginTop: 20}} />
        </View> */}
      </View>
    )};

    const styles = StyleSheet.create({
        container: {
          alignItems: 'baseline',
          padding: 10,
          borderBottomColor: 'green',
          borderBottomWidth: 1,
          flexDirection: "row", justifyContent: "space-between"
        },
      
      });
      
      