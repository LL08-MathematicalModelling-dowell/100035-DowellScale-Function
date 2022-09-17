import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
// import Line from './components/Line';
import Drop from './components/DropDownScale';
import ScalesGridList from './components/ScalesGridList';
import ReportHeader from './components/Reports/ReportsHeader';
import ReportTable from './components/Reports/ReportTable';

export default function Scale() {
  return (
    <View style={styles.container}>
      
      <ReportHeader />

    <ReportTable />
      {/* Drop down component */}
      <Drop style={styles.dropReport} />


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
  dropReport: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    // marginTop: 600,
    borderRadius: 0,
  },
});





