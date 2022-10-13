import { StatusBar } from "expo-status-bar";
import { StyleSheet, ScrollView, Text, View, Image, Pressable, Alert } from "react-native";
import DetailHeader from "../components/Detail/DetailHeader";

const onInstallpressed = () => {
  Alert.alert("Terms of service pressed");
};


export default function DetailScreen() {
  return (
    <View style={styles.container}>
      <DetailHeader />
      {/* <SafeAreaView style={styles.safeContainer}> */}
      <ScrollView style={styles.scrollView}>
        <View>
          <Text style={{ marginLeft: 20, marginTop: 30 }}>
            {/* <Image style={styles.imageStyle} source={{ uri: 'https://www.linkpicture.com/q/dataSafety.png', }} /> */}
            Data Safety
          </Text>
          <Text style={styles.textWrapper}>
            Dowell may collect certain personally identifiable information
            (“personal information”) about you when you visit our App. Examples
            of personal information we may collect include your name, address,
            telephone number, fax number, and e-mail address. We also
            automatically collect certain non-personally identifiable
            information when you visit our App, including, but not limited to,
            the location, the type of browser you are using, the type of
            operating system you are using, and the domain name of your Internet
            service provider.
          </Text>
        </View>
        <View>
          <Text style={{ marginLeft: 20 }}>
            {/* <Image style={styles.imageStyle} source={{ uri: 'https://www.linkpicture.com/q/privacy.png',}}/> */}
            Personal Privacy
          </Text>
          <Text style={styles.textWrapper}>
            {" "}
            You provide your personal information (first name, last name, email,
            phone number, company name, etc.) to us while creating an account
            with us. We store this information reliably. We use this information
            to serve you better. This information is only available to the
            employees, contractors, and subcontractors of DOWELL WIFI QR CODE
            REVIEWS and is never shared for commercial gains to unauthorized
            personnel or businesses.
          </Text>
        </View>

        <Text style={{ marginLeft: 20 }}>
          {/* <Image style={styles.imageStyle} source={{ uri: 'https://www.linkpicture.com/q/privacy.png',}}/> */}
          Disclaimer
        </Text>
        <View style={styles.textWrapper}>
          <Text>
            We may process your user Information where: you have given your
            consent; the processing is necessary for a contract between you and
            us; the processing is required by applicable law; the processing is
            necessary to protect the vital interests of any individual; or where
            we have a valid legitimate interest in the processing.
          </Text>
        </View>
        <View style={styles.textWrapper}>
          <View style={styles.appDetails}>
            <Text>App details {'\n'}
            <Image source={{ uri: 'https://www.nicepng.com/maxp/u2w7q8u2t4o0t4u2/',}}/>
            </Text>
            
          <Text style={{color: "green"}}>
          
             {'\n'}Installed version: 8.00.00 {'\n'}Installation ID: 
            1234567890 {'\n'} {'\n'}
            <Pressable
                  style={{backgroundColor: "#90EE90",
                  borderColor: "green",
                  borderWidth: 1,
                  borderRadius: 20,
                  elevation: 2,
                  width: 100,
                  padding: 5,
                  justifyContent: "center",
                  alignItems: "center",
                  margin: 5,}}
                  onPress={onInstallpressed}
                >
                  <Text style={{color: "green",
                                fontWeight: "bold",
                                textAlign: "center",}}>
       Install
      </Text>
                </Pressable>
          </Text>
         
          </View>
        </View>

        <StatusBar style="auto" />
        {/* </SafeAreaView> */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderColor: 'green',
    // borderWidth: 1,
    // borderStyle: 'solid',
    // borderRadius: 20,
    margin: 5,
    marginTop: 40,
    marginBottom: 0,
    bottom: 0,
  },
  textWrapper: {
    flexDirection: "row",
    borderColor: "green",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 20,
    margin: 10,
    padding: 10,
    bottom: 0,
    alignItems: "center",
  },
  appDetails: {
    flexDirection: "row",
    color: "green",
  },



  safeContainer: {
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  imageStyle: {
    width: 40,
    height: 40,
    marginTop: 10,
    marginLeft: 10,
   
    // display: "flex",
    // alignItems: "flex-start",
  },
});
