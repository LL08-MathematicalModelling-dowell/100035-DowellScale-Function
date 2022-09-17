import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
// import Line from './components/Line';
import Drop from './components/DropDownScale';
import ScalesGridList from './components/ScalesGridList';
import ScaleHeader from './components/ScaleHeader';


export default function Scale() {
  return (
    <View style={styles.container}>
      
      <ScaleHeader />

      {/* Drop down component */}
      <Drop style={{ top: 80,}} />
      <ScalesGridList />


      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'row',
    // backgroundColor: '#fff',
    // // alignItems: 'center',
    // justifyContent: 'space-evenly',
    borderColor: 'green', 
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 20,
    margin: 5,
    marginTop: 40,
    marginBottom: 0,
    bottom: 0,
  },
});





