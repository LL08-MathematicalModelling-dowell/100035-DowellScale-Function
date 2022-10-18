import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import NotifHeader from '../components/Notifications/NotifHeader';
import NotificationsCard from '../components/Notifications/NotificationsCard';


export default function App() {
  return (
    <View style={styles.container}>
       < NotifHeader />
      <NotificationsCard />
     
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
