import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, Button } from "react-native";
// import Line from './components/Line';
import Drop from "../components/DropDownScale";
import ScalesGridList from "../components/ScalesGridList";
import ScaleHeader from "../components/ScaleHeader";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import axios from "axios";
import publicIP from 'react-native-public-ip';
import Geolocation from 'react-native-geolocation-service';

 

const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

// This arrangement can be altered based on how we want the date's format to appear.
let currentDate = `${day}-${month}-${year}`;

export default function ScaleScreen({ navigation }) {
  const stateUser = useSelector((state) => state.user);
  const [ipAd, setIpAd] = useState("");
  // const [location, setLocation] = useState({});
  const [location, setLocation] = useState(false);

  // Function to get permission for location
const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Can we access your location?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    console.log('granted', granted);
    if (granted === 'granted') {
      console.log('You can use Geolocation');
      return true;
    } else {
      console.log('You cannot use Geolocation');
      return false;
    }
  } catch (err) {
    return false;
  }
};

  const getLocation = () => {
    const result = requestLocationPermission();
    result.then(res => {
      console.log('res is:', res);
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            console.log(position);
            setLocation(position);
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
            setLocation(false);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    });
    console.log(location);
  };

  useEffect(() => {
    publicIP()
    .then(ip => {
      console.log(ip);
      setIpAd(ip)
      // '47.122.71.234'
    })
    .catch(error => {
      console.log(error);
      // 'Unable to get IP address.'
    });
    getLocation()

  }, []);



  const qrID = {
    Username: "user",
    OS: "linux",
    Device: "mobile",
    Browser: "chrome",
    Location: `${location.latitude} ${location.longtitude}`,
    Time: `${currentDate}`,
    Connection: "wifi",
    IP: {ipAd},
  };

  useEffect(() => {
    try {
      const handleIsUser = async () => {
        const res = await axios.post(
          "https://100014.pythonanywhere.com/api/linkbased/",
          qrID
        );
        console.log(res.data);
      };
      stateUser.currentUser === null
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
      <Drop
        style={{ top: 80 }}
        onPress={() => navigation.navigate("Scale", { screen: "NPSScale" })}
      />
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
