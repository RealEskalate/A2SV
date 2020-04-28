import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomePage2 from "./WelcomePage2";

export default function WelcomePage1({ navigation }) {
  return (
    <View style={styles.mainBackground}>
      <Card style={styles.container}>
        <Card.Cover
          source={require("../../assets/covid.jpg")}
          style={{ flex: 2, borderRadius: 30 }}
        />
        <Card.Content style={{ flex: 1 }}>
          <Title style={styles.welcomeText}>
            Welcom to A2SV'S COVID-19 App!
          </Title>
          <Paragraph>
            Coronaviruses are a type of virus that can affect our lungs. These
            coronaviruses belong to a member of the coronavirus family that was
            first identified in the 1960s. They are responsible to cause a range
            of diseases in humans including the common-cold and most severe and
            life-threatening forms like SARS and MERS.
          </Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button
            onPress={() => navigation.navigate("WelcomePage2")}
            color="#0a77aa"
          >
            Next
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  mainBackground: {
    flex: 1,
    paddingTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    backgroundColor: "#3d4241",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    borderRadius: 30,
  },
  welcomeText: {
    justifyContent: "center",
  },
});
