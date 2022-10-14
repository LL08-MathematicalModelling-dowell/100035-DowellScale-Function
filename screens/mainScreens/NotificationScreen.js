import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import NotifList from '../components/Notifications/NotifList';
import NotifHeader from '../components/Notifications/NotifHeader';
import DropSearch from '../components/Notifications/NotifDropdown';

export default function App() {
  return (
    <View style={styles.container}>
      < NotifHeader />
      <Text style={{
        backgroundColor: '#B6F5C9',
        color: 'green',
        width: '100%', 
        fontWeight: 'bold',
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'center',
        alignContent: 'center',
        alignText: 'center',
        marginTop: 10,
        fontSize: 15,}} >
        Updates on the measured data
        </Text>
      < NotifList />
      < DropSearch />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

