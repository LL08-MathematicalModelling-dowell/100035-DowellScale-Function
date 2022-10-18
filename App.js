// NAVIGATION
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Image } from "react-native";
// AUTH
import SigninScreen from "./screens/auth/SigninScreen";
import SignupScreen from "./screens/auth/SignupScreen";
// import ForgotPasswordScreen from "./screens/auth/ForgotPassword";

import api from "./res/api";

// MAIN SCREENS
import CommentScreen from "./screens/mainScreens/CommentScreen";
import DetailScreen from "./screens/mainScreens/DetailScreen";
import NotificationScreen from "./screens/mainScreens/NotificationScreen";
import ProfileScreen from "./screens/mainScreens/ProfileScreen";
import ReportScreen from "./screens/mainScreens/ReportScreen";
import ScaleScreen from "./screens/mainScreens/ScaleScreen";

// Nested
import NPSScale from "./screens/Scales/NPSscale";
import NPSLite from "./screens/Scales/NPSLite";
import LikertScale from "./screens/Scales/LikertScale";
import StapelScale from "./screens/Scales/StapelScale";
import RatioScale from "./screens/Scales/RatioScale";
import PercentScale from "./screens/Scales/PercentScale";
import RankScale from "./screens/Scales/RankScale";
import NotificationsCard from "./screens/components/Notifications/NotificationsCard";
import NotifScreen from "./screens/components/Notifications/NotifScreen";


// NAVIGATION
const AuthStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const ScaleStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const NotificationsStack = createStackNavigator();

// REDUX
import { Provider } from "react-redux";
import { store } from "./screens/redux/Store";

// AXIOS API CALL -AUTHENTICATION

// function getCurrentUser() {
//   console.log("getCurrentUser");
//   // return
//   api
//     .get("api/profile/")
//     .then((res) => {
//       console.log("current", res);
//     })
//     .then((response) => {
//       // return json;

//       AsyncStorage.setItem("client", JSON.stringify(response.data));
//     })
//     .catch(function (error) {
//       console.log(
//         "There has been a problem with your fetch operation: " + error.message
//       );
//       // ADD THIS THROW error
//       throw error;
//     });
// }

// async function checkUserSignedIn() {
//   // let context = this;
//   try {
//     let value = await AsyncStorage.getItem("user_token");
//     // console.log("user_token ",value);
//     if (value !== null) {
//       // do something
//       setIsSigned(true);
//       getCurrentUser();
//     } else {
//       // do something else
//       setIsSigned(false);
//     }
//   } catch (error) {
//     // Error retrieving data
//     console.log("checkUserSignedIn error", error);
//   }
// }

{
  /* {isSignedIn ? (
          <> */
}

const ScaleStackScreen = () => (
  <Provider store={store}>
    <ScaleStack.Navigator>
      <ScaleStack.Screen
        name="Scale"
        component={ScaleScreen}
        options={{ headerShown: false }}
      />
      <ScaleStack.Screen name="NPSScale" component={NPSScale} />
      <ScaleStack.Screen name="NPSLite" component={NPSLite} />
      <ScaleStack.Screen name="LikertScale" component={LikertScale} />
      <ScaleStack.Screen name="StapelScale" component={StapelScale} />
      <ScaleStack.Screen name="RatioScale" component={RatioScale} />
      <ScaleStack.Screen name="PercentScale" component={PercentScale} />
      <ScaleStack.Screen name="RankScale" component={RankScale} />

    </ScaleStack.Navigator>
  </Provider>
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
    {/* <ProfileStack.Screen
      name="ForgotPassword"
      component={ForgotPassword}
      options={{ title: "DOWELL - FORGOT PASSWORD" }}
    /> */}
  </ProfileStack.Navigator>
);

const NotificationsStackScreen = () => (
  <NotificationsStack.Navigator>
    <NotificationsStack.Screen
      name="NotifMainScreen"
      component={NotificationScreen}
      options={{
        headerShown: false,
        tabBarShowLabel: false, // Remove wording on tab
        tabBarVisible: false,
      }}
    />
    {/* <NotificationsStack.Screen
      name="NotificationsCard"
      component={NotificationsCard}
      options={{
        headerShown: false,
        tabBarShowLabel: false, // Remove wording on tab
        tabBarVisible: false,
      }}
    /> */}
    <NotificationsStack.Screen
      name="NotifScreen"
      component={NotifScreen}
      options={{ headerShown: false }}
    />
  </NotificationsStack.Navigator>
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
        component={NotificationsStackScreen}
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
