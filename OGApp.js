import CommentScreen from './screens/mainScreens/CommentScreen';
import DetailScreen from './screens/mainScreens/DetailScreen';
import NotificationScreen from './screens/mainScreens/NotificationScreen';
import ProfileScreen from './screens/mainScreens/ProfileScreen';
import ReportScreen from './screens/mainScreens/ReportScreen';
import ScaleScreen from './screens/mainScreens/ScaleScreen';
// import ScaleStackScreen from './screens/ScaleScreen';
import NPSScale from './screens/Scales/NPSscale';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Image} from 'react-native' ;
// UI KITTEN
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';

const ScaleStack = createStackNavigator();
function ScaleStackScreen({navigation}) {
    return (
      <ScaleStack.Navigator screenOptions={{
        headerShown: false
      }}>
       <ScaleStack.Screen name="Scale Grid" component={ScaleScreen} />  
       <ScaleStack.Screen name="NPS Scale" component={NPSScale} />           
      </ScaleStack.Navigator>
     );
   }
  

const Tab = createBottomTabNavigator();


// Home Screen

export default function App({navigation}) {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
    <NavigationContainer>
     <Tab.Navigator
     screenOptions={{
      style: {
        borderTopWidth: 0,
        elevation: 0,
        backgroundColor: 'transparent',
      },
      headerStyle: { 
        borderWidth: 0,
        // below four properties will remove the shadow
        borderBottomColor: "transparent",
        shadowColor: 'transparent',
        borderBottomWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        headerShadowVisible: false,
      },
  
      
    }} 
    initialRouteName="SelectScale"
     >
      
        <Tab.Screen name="Profile" component={ProfileScreen}
         options={{
          tabBarShowLabel: false,  // Remove wording on tab
          headerShown: false,
          tabBarVisible: false,
          tabBarIcon: ({size}) => {
            return (
              <Image
                style={{ width: size, height: size }}
                source={{
                  uri: 'https://www.linkpicture.com/q/user-account.png',
                }}
              />
              );
            },
          }}
        />
        <Tab.Screen name="Data Safety and Personal Privacy" component={DetailScreen}
         options={{
          headerShown: false,
          tabBarShowLabel: false,  // Remove wording on tab
          tabBarIcon: ({size}) => {
            return (
              <Image
                style={{ width: size, height: size }}
                source={{
                  // uri:'../../assets/DOWELL_ICONS/user-account.png',
                  uri: 'https://www.linkpicture.com/q/security-policy.jpg',
                }}
              />
              );
            },
          }}
        />
        <Tab.Screen name="Notifications" component={NotificationScreen}
         options={{
          headerShown: false,
          tabBarShowLabel: false,  // Remove wording on tab
          tabBarVisible: false,
          tabBarIcon: ({size}) => {
            return (
              <Image
                style={{ width: size, height: size }}
                source={{
                  uri: 'https://www.linkpicture.com/q/notifications_1.png',
                }}
              />
              );
            },
          }}
        />
        <Tab.Screen name="Reports" component={ReportScreen}
         options={{
          headerShown: false,
          tabBarShowLabel: false,  // Remove wording on tab
          tabBarVisible: false,
          tabBarIcon: ({size}) => {
            return (
              <Image
                style={{ width: size, height: size }}
                source={{
                  uri: 'https://www.linkpicture.com/q/reports.png',
                }}
              />
              );
            },
          }}
        />
        {/* InitialRouteName */}


        <Tab.Screen name="SelectScale" component={ScaleStackScreen} 
         options={{
          headerShown: false,
          tabBarShowLabel: false,  // Remove wording on tab
          tabBarVisible: false,
          tabBarIcon: ({size}) => {
            return (
              <Image
                style={{ width: size, height: size }}
                source={{
                  uri: 'https://www.linkpicture.com/q/scale.png',
                }}
              />
              );
            },
          }}
        />

        <Tab.Screen name="NPSScale" component={NPSScale} 
         options={{
          headerShown: false,
           // Remove wording on tab
          tabBarVisible: false,
          // tabBarIcon: ({size}) => {
          //   return (
          //     <Image
          //       style={{ width: size, height: size }}
          //       source={{
          //         uri: 'https://www.linkpicture.com/q/scale.png',
          //       }}
          //     />
          //     );
          //   },
          }}
        />

        <Tab.Screen name='Close' component={CommentScreen} 
          options={{
            headerShown: false,
            tabBarShowLabel: false,  // Remove wording on tab
            tabBarVisible: false,
            tabBarIcon: ({size}) => {
              return (
                <Image
                  style={{ width: size, height: size }}
                  source={{
                    uri: 'https://www.linkpicture.com/q/logout-button.png',
                  }}
                />
                );
              },
            }}
          />
      </Tab.Navigator>
    </NavigationContainer>
    </ApplicationProvider>
  );
}

