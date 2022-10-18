import React from "react";
import { Text ,View, StyleSheet, Navigation } from 'react-native';
import {Card, Button , Title, Paragraph } from 'react-native-paper';
import NotifScreen from "./NotifScreen"

import { useNavigation } from "@react-navigation/native";



const CreateCard = () => {
	const navigation = useNavigation();
	return(
		
	<Card style={Styles.container}>
		<Card.Content>
			<Title>Survey 1</Title>
		</Card.Content>
		<Card.Cover source={{ uri: "https://www.linkpicture.com/q/notifications_1.png", }} />
	<Card.Content>
		
		</Card.Content>
		<Card.Actions>
		<Button  onPress={() => navigation.navigate("NotifScreen")}>Open</Button>
		</Card.Actions>
	</Card>
		
	)
}
export default CreateCard;

const Styles = StyleSheet.create({
	container :{
		alignContent:'center',
		margin:37
	}
})
