// NAVIGATION
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Image } from "react-native";
// AUTH
import SigninScreen from "./screens/auth/SigninScreen";
import SignupScreen from "./screens/auth/SignupScreen";

// MAIN SCREENS
import CommentScreen from "./screens/mainScreens/CommentScreen";
import DetailScreen from "./screens/mainScreens/DetailScreen";
import NotificationScreen from "./screens/mainScreens/NotificationScreen";
import ProfileScreen from "./screens/mainScreens/ProfileScreen";
import ReportScreen from "./screens/mainScreens/ReportScreen";
import ScaleScreen from "./screens/mainScreens/ScaleScreen";
import NPSScale from "./screens/Scales/NPSscale";

const AuthStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const ScaleStack = createStackNavigator();
const ProfileStack = createStackNavigator();

const ScaleStackScreen = () => (
  <ScaleStack.Navigator>
    <ScaleStack.Screen
      name="Scale"
      component={ScaleScreen}
      options={{ headerShown: false }}
    />
    <ScaleStack.Screen name="NPSScale" component={NPSScale} />
  </ScaleStack.Navigator>
);

const ProfileStackScreen = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} />
    <ProfileStack.Screen
      name="Signin"
      component={SigninScreen}
      options={{ title: "DOWELL - LOG IN" }}
    />
    <ProfileStack.Screen
      name="Signup"
      component={SignupScreen}
      options={{ title: "DOWELL - SIGN UP" }}
    />
  </ProfileStack.Navigator>
);

const AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen
      name="Signin"
      component={SigninScreen}
      options={{ title: "DOWELL - LOG IN" }}
    />
    <AuthStack.Screen
      name="Signup"
      component={SignupScreen}
      options={{ title: "DOWELL - LOG IN" }}
    />
    <AuthStack.Screen name="ScaleScreen" component={ScaleScreen} />
  </AuthStack.Navigator>
);

export default () => (
  <NavigationContainer>
    <Tab.Navigator
      screenOptions={{
        style: {
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: "transparent",
        },
        headerStyle: {
          borderWidth: 0,
          // below four properties will remove the shadow
          borderBottomColor: "transparent",
          shadowColor: "transparent",
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          headerShadowVisible: false,
        },
      }}
      initialRouteName="SelectScale"
    >
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileStackScreen}
        options={{
          tabBarShowLabel: false, // Remove wording on tab
          headerShown: false,
          tabBarVisible: false,
          tabBarIcon: ({ size }) => {
            return (
              <Image
                style={{ width: size, height: size }}
                source={{
                  uri: "https://www.linkpicture.com/q/user-account.png",
                }}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Data Safety and Personal Privacy"
        component={DetailScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: false, // Remove wording on tab
          tabBarIcon: ({ size }) => {
            return (
              <Image
                style={{ width: size, height: size }}
                source={{
                  // uri:'../../assets/DOWELL_ICONS/user-account.png',
                  uri: "https://www.linkpicture.com/q/security-policy.jpg",
                }}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: false, // Remove wording on tab
          tabBarVisible: false,
          tabBarIcon: ({ size }) => {
            return (
              <Image
                style={{ width: size, height: size }}
                source={{
                  uri: "https://www.linkpicture.com/q/notifications_1.png",
                }}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: false, // Remove wording on tab
          tabBarVisible: false,
          tabBarIcon: ({ size }) => {
            return (
              <Image
                style={{ width: size, height: size }}
                source={{
                  uri: "https://www.linkpicture.com/q/reports.png",
                }}
              />
            );
          },
        }}
      />
      {/* InitialRouteName */}

      <Tab.Screen
        name="SelectScale"
        component={ScaleStackScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: false, // Remove wording on tab
          tabBarVisible: false,
          tabBarIcon: ({ size }) => {
            return (
              <Image
                style={{ width: size, height: size }}
                source={{
                  uri: "https://www.linkpicture.com/q/scale.png",
                }}
              />
            );
          },
        }}
      />

      <Tab.Screen
        name="Close"
        component={CommentScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: false, // Remove wording on tab
          tabBarVisible: false,
          tabBarIcon: ({ size }) => {
            return (
              <Image
                style={{ width: size, height: size }}
                source={{
                  uri: "https://www.linkpicture.com/q/logout-button.png",
                }}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  </NavigationContainer>
);
