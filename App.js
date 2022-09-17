import CommentScreen from './screens/CommentScreen';
import DetailScreen from './screens/DetailScreen';
import NotificationScreen from './screens/NotificationScreen';
import ProfileScreen from './screens/ProfileScreen';
import ReportScreen from './screens/ReportScreen';
import ScaleScreen from './screens/ScaleScreen';

import { NavigationContainer } from '@react-navigation/native'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Image} from 'react-native' ;


const Tab = createBottomTabNavigator();


// Home Screen

export default function App() {
  return (
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


        <Tab.Screen name="Select Scale" component={ScaleScreen} 
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
  );
}

