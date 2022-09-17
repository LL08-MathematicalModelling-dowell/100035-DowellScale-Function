import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import SigninScreen from './auth/SigninScreen';

export default function Profile({navigation}) {
  return (
    <View style={styles.container}>
      
      <StatusBar style="auto" />
      <Text style={{ color: 'green' }}>
        Login
      </Text>
      <Text style={{ color: 'green' }}>
       Notifications after full login/join us.{'\n'}
        Others after link based login {'\n'}
      </Text>
      <View style={{marginLeft: 10, borderRadius: 20,
                borderWidth: 1,
                borderColor: "green", }}>
                  <Button title="Proceed to Sign In" onPress={() => navigation.navigate('SigninScreen')}/>
              </View>
              <View style={{marginLeft: 10, borderRadius: 20,
                borderWidth: 1,
                borderColor: "green", }}>
                <Button title="Register a new account"/>
              </View>
              <View style={{marginLeft: 10, borderRadius: 20,
                borderWidth: 1,
                borderColor: "green", }}>
                <Button title=" 😁 "/>
              </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'green', 
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 20,
    margin: 5,
    marginTop: 38,
    marginBottom: 0,
  },
});


// onPress={()=>this.props.navigation.navigate("SigninScreen")