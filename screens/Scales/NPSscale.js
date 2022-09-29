import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import { Recommendation , Rating } from 'react-native-recommendation'
// import Line from './components/Line';


export default function Scale({ navigation }) {
  return (
    <View style={styles.container}>
        <Text >
        NPS Scale
        </Text>
        {/* <Text style={{ flexDirection: 'row-reverse' }}>
        Icon
        </Text> */}
        <Recommendation/>

        <Rating/> 
        <Button
              title="Back"
              onPress={() => navigation.navigate('NPSScale')}
            />  
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



      function HomeScreen({ navigation }) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>  
            <Text>Home screen</Text>
           
          </View>
        );
      }
      