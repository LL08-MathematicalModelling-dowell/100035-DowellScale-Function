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
      <Drop style={{ top: 80 }}  onPress={() => navigation.navigate('Scale', { screen: 'NPSScale' })} />
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


