import React from "react";
import { Text ,View, StyleSheet, ScrollView } from 'react-native';
import {Card, Button , Title, Paragraph } from 'react-native-paper';
import NotifScreen from "./NotifScreen"

import { useNavigation } from "@react-navigation/native";



const CreateCard = () => {
	const navigation = useNavigation();
	return(
		<ScrollView>
	<Card style={Styles.container}>
		<Card.Content>
			<Title style={{ alignSelf: "center", color: "green" }}>Survey 1</Title>
		</Card.Content>
		<Card.Cover source={{ uri: "https://www.linkpicture.com/q/survey_img.png", }} style={{ alignContent: "center", }} />
	<Card.Content>
		
		</Card.Content>
		<Card.Actions>
		<Button color="white" style={{ justifyContent: "center", backgroundColor: "green"  }} onPress={() => navigation.navigate("NotifScreen")}>Open</Button>
		</Card.Actions>
	</Card>
	<Card style={Styles.container}>
		<Card.Content>
		<Title style={{ alignSelf: "center", color: "green" }}>Survey 2</Title>
		</Card.Content>
		<Card.Cover source={{ uri: "https://www.linkpicture.com/q/survey_img.png", }} style={{ alignContent: "center", }} />
	<Card.Actions>
		<Button color="white" style={{ justifyContent: "center", backgroundColor: "green", }} onPress={() => navigation.navigate("NotifScreen")}>Open</Button>
	</Card.Actions>
	</Card>
	</ScrollView>
	)
}
export default CreateCard;

const Styles = StyleSheet.create({
	container :{
		alignContent:'center',
		margin:20,
		borderRadius: 20,
	}
})
