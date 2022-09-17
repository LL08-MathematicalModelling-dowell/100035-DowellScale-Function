import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
// import Line from './components/Line';



export default function DetailHeader() {
    return (
      <View style={styles.container}>
        <Text >
        Data Safety and Personal Privacy
        </Text>
        {/* <Text style={{ flexDirection: 'row-reverse' }}>
        Icon
        </Text> */}
    </View>
    )};

    const styles = StyleSheet.create({
        container: {
          alignItems: 'baseline',
          padding: 10,
          borderBottomColor: 'green',
          borderBottomWidth: 1,
         
        },
      
      });
      
      