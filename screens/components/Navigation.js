import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button } from 'react-native';

import ProfileScreen from './screens/ProfileScreen';
import ReportScreen from './screens/ReportScreen';
import ScaleScreen from './screens/ScaleScreen';
import { NavigationContainer } from '@react-navigation/native';
import NPSScale from './screens/Scales/NPSscale';
import { createStackNavigator } from "@react-navigation/stack";

const ScaleStack = createStackNavigator();
function ScaleStackScreen() {
    return (
      <ScaleStack.Navigator>
       <ScaleStack.Screen name="Scale Grid" component={ScaleScreen} />  
       <ScaleStack.Screen name="NPS Scale" component={NPSScale} />           
      </ScaleStack.Navigator>
     );
   }
  
export default function ScaleStackScreen() {
  return (
    <NavigationContainer>
      <ScaleStackScreen />
    </NavigationContainer>
  );
}