import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Modal,
} from "react-native";
import { Recommendation } from "react-native-recommendation";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
// import axios from "axios";

let textList = [
  "FROM 9 -> 10",
  "FROM 6 -> 8",
  "FROM 5 -> 4",
  "FROM 2 -> 3",
  "FROM 0 -> 1",
];
let emojiList = [
  "FROM 9 -> 10",
  "FROM 6 -> 8",
  "FROM 5 -> 4",
  "FROM 2 -> 3",
  "FROM 😃 -> 😃",
];

const NPSscaleSettings = () => {
  const [text, onChangeText] = useState("");
  const [name, onChangeName] = useState("");
  const [scolor, onChangeScolor] = useState("");
  const [rcolor, onChangeRcolor] = useState("");
  const [fcolor, onChangeFcolor] = useState("");
  const [left, onChangeLeft] = useState("");
  const [center, onChangeCenter] = useState("");
  const [right, onChangeRight] = useState("");
  const [time, onChangeTime] = useState("");
  const [Orientation, setOrientation] = useState("");
  const [format, setFormat] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  let num = Math.floor(Math.random() * 10000);

  let settings = {
    template_name: `name${num}`,
    scolor,
    rcolor,
    fcolor,
    left,
    center,
    right,
    time,
    Orientation,
    format,
    scale_category: "nps scale",
  };

  const handleSubmit = async () => {
    const res = await axios.post(
      " https://100090.pythonanywhere.com/scaleapi/scaleapi/",
      settings
    );
    console.log(res.status === 200);

    // if (res.status === 200) ? navigation required after scale is saved (NPSscale)
  };

  const handleModal = () => {
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Settings Scale</Text>
        <Text style={{ alignItems: "center" }}>
          -----------------------------------------------------------------------
        </Text>
        <View style={styles.inputFields}>
          <Text style={styles.inputLabels}>Name of Scale</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeName}
            value={name}
          />
        </View>
        {/* Dropdown */}
        <View style={styles.inputFields}>
          <Text style={styles.inputLabels}>Orientaton</Text>
          <Picker
            style={styles.input}
            selectedValue={Orientation}
            onValueChange={(itemValue, itemIndex) => setOrientation(itemValue)}
          >
            <Picker.Item label="Horizontal" value="Horizontal" />
            <Picker.Item label="Vertical" value="Vertical" />
          </Picker>
        </View>
        <View style={styles.inputFields}>
          <Text style={styles.inputLabels}>Scale Color</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeScolor}
            value={scolor}
          />
        </View>
        <View style={styles.inputFields}>
          <Text style={styles.inputLabels}>Round Color</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeRcolor}
            value={rcolor}
          />
        </View>
        <View style={styles.inputFields}>
          <Text style={styles.inputLabels}>Font Color</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeFcolor}
            value={fcolor}
          />
        </View>
        {/* Dropdown */}
        <View style={styles.inputFields}>
          <Text style={styles.inputLabels}>Format</Text>
          <Picker
            style={styles.input}
            selectedValue={format}
            onValueChange={(itemValue, itemIndex) => setFormat(itemValue)}
          >
            <Picker.Item label="Number" value="Number" />
            <Picker.Item label="Image" value="Image" />
            <Picker.Item label="Star" value="Star" />
          </Picker>
        </View>
        <View style={styles.inputFields}>
          <Text style={styles.inputLabels}>Left</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeLeft}
            value={left}
          />
        </View>
        <View style={styles.inputFields}>
          <Text style={styles.inputLabels}>Center</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeCenter}
            value={center}
          />
        </View>
        <View style={styles.inputFields}>
          <Text style={styles.inputLabels}>Right</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeRight}
            value={right}
          />
        </View>
        <View style={styles.inputFields}>
          <Text style={styles.inputLabels}>Time</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeTime}
            value={time}
            placeholder="Time in sec"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.btns}>
          <Pressable style={styles.saveBtn} onPress={handleSubmit}>
            <Text style={styles.btnsText}>Save</Text>
          </Pressable>

          <Pressable style={styles.saveBtn} onPress={handleModal}>
            <Text style={styles.btnsText}>Preview</Text>
          </Pressable>
        </View>
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            // transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <Recommendation
                selectedColor={"#fff"}
                unSelectedColor={"blue"}
                selectedTextColor={"black"}
                unSelectedTextColor={"black"}
                selectedSize={30}
                max={10}
                reactionTextList={emojiList}
                backgroundColor={"orange"}
                selectedValue={(value) => console.log(value)}

                // Remove this to disable reaction icon and text
              />

              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NPSscaleSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    margin: 5,
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 1,
  },
  header: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    height: 40,
    padding: 10,
    margin: 12,
    borderWidth: 1,
    backgroundColor: "#fff",
    // padding: 10,
  },
  inputFields: {
    padding: 10,
  },
  inputLabels: {
    fontWeight: "bold",
    color: "#fff",
  },
  btns: {
    flexDirection: "row",
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtn: {
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 2,
    width: 130,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  btnsText: { fontWeight: "bold", color: "#000" },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    marginTop: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
