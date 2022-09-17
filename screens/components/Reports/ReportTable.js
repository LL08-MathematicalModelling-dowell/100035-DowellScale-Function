import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import ReportRadio from './ReportRadio.js';


// import Line from './components/Line';
// import Drop from './components/DropDownScale';
// import ScalesGridList from './components/ScalesGridList';
// import ScaleHeader from './components/ScaleHeader';


export default function ReportTable() {
  return (
    <View style={styles.container}>
      
      <Text style={styles.ReportText} >
        Report 
        </Text>

        {/* Text inside the table */}
    
            <Text style={{padding: 10, }} >
            UI designing {'\n'} 
            is simple
            
            </Text>
            {/* <Text style={{padding: 10, alignSelf: 'center', alignContent: 'flex-end'}} >
              00112
            </Text>
            <Text style={{ left: 50,  padding: 10, alignSelf: 'flex-end', alignContent: 'flex-end'}} >
            01022
            </Text> */}
      
        <Text style={{padding: 10}}>
        UI with UX designing {'\n'}
        is simple
        </Text>
      {/* <ScaleHeader /> */}

      {/* Drop down component */}
      {/* <Drop style={{ top: 80,}} />
      <ScalesGridList /> */}
    

      <StatusBar style="auto" />
      <View >
        <ReportRadio />
        </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    // alignItems: 'baseline',
    // justifyContent: 'flex-start',
    borderColor: 'green', 
    borderWidth: 1,
    borderStyle: 'solid',

    margin: 5,
    marginTop: 40,
    marginBottom: 0,
    bottom: 0,
  },
    ReportText: {
        backgroundColor: '#B6F5C9',
        color: 'green',
        width: '100%', 
        fontWeight: 'bold',
        borderRadius: 20, 
        padding: 10,
        fontSize: 20,
    },

});





