import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, Button } from "react-native";
// import Line from './components/Line';
import Drop from "../components/DropDownScale";
import ScalesGridList from "../components/ScalesGridList";
import ScaleHeader from "../components/ScaleHeader";
import { useSelector } from "react-redux";
import React, { useEffect } from "react";
import axios from "axios";

const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

// This arrangement can be altered based on how we want the date's format to appear.
let currentDate = `${day}-${month}-${year}`;

const qrID = {
  Username: "exampleuser",
  OS: "linux",
  Device: "mobile",
  Browser: "chrome",
  Location: "Kochi",
  Time: `${currentDate}`,
  Connection: "wifi",
  IP: "198.162.1.1",
};

export default function ScaleScreen({ navigation }) {
  const stateUser = useSelector((state) => state.user);

  useEffect(() => {
    console.log("first");
    try {
      const handleIsUser = async () => {
        const res = await axios.post(
          "https://100014.pythonanywhere.com/api/linkbased/",
          qrID
        );
        console.log(res.data);
      };
      stateUser.currentUser === "null"
        ? handleIsUser()
        : console.log("User available");
    } catch (err) {
      console.log("Failed to generate qrID");
    }
  }, []);
  return (
    <View style={styles.container}>
      <ScaleHeader />
      {/* <Button
              title="NPS Scale"
              onPress={() => navigation.navigate('Scale', { screen: 'NPSScale' })}
            />   */}
      {/* Drop down component */}
      <Drop style={{ top: 80 }} />
      <ScalesGridList />

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
    borderColor: "green",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 20,
    margin: 5,
    marginTop: 40,
    marginBottom: 0,
    bottom: 0,
  },
});

// const ScaleStack = createStackNavigator();
// const SearchStack = createStackNavigator();

// const ScaleStackScreen = () => (
//   <ScaleStack.Navigator>
//     <ScaleStack.Screen name="Scale" component={Scale} />
//     <ScaleStack.Screen
//       name="NPSScale"
//       component={NPSScale}
//       options={({ route }) => ({
//         title: route.params.name
//       })}
//     />
//   </ScaleStack.Navigator>
// );

// const NPSScaleStackScreen = () => (
//   <SearchStack.Navigator>
//     <SearchStack.Screen name="Search" component={NPSScale} />
//     <SearchStack.Screen name="Search2" component={Search2} />
//   </SearchStack.Navigator>
// );

// const ProfileStack = createStackNavigator();
// const ProfileStackScreen = () => (
//   <ProfileStack.Navigator>
//     <ProfileStack.Screen name="Profile" component={Profile} />
//   </ProfileStack.Navigator>
// );

// export const Scale = ({ navigation }) => (
//   <ScreenContainer>
//     <Text>Master List Screen</Text>
//     <Button
//       title="React Native by Example"
//       onPress={() =>
//         navigation.push("NPSScale", { name: "React Native by Example " })
//       }
//     />
//     <Button
//       title="React Native School"
//       onPress={() =>
//         navigation.push("NPSScale", { name: "React Native School" })
//       }
//     />
//     {/* <Button title="Drawer" onPress={() => navigation.toggleDrawer()} /> */}
//   </ScreenContainer>
// );

// const ScaleStackScreen = () => (
//   <ScaleStack.Navigator>
//     <ScaleStack.Screen name="Scale" component={Scale} />
//     <ScaleStack.Screen
//       name="NPSScale"
//       component={NPSScale}
//       options={({ route }) => ({
//         title: route.params.name
//       })}
//     />
//   </ScaleStack.Navigator>
// );

// const NPSScaleStack = createStackNavigator();
// const LikertScaleStack = createStackNavigator();
