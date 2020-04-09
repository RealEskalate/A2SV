import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";

export default function WelcomePage3({ navigation }) {
  return (
    <View style={styles.mainBackground}>
      <Card style={styles.container}>
        <Card.Cover
          source={require("../../assets/Prevention.jpg")}
          style={{ flex: 2 }}
        />
        <Card.Content style={{ flex: 1 }}>
          <Title style={styles.welcomeText}>Stay Safe and Stay Active!</Title>
          <Paragraph>
            Coronaviruses are a type of virus that can affect our lungs. These
            coronaviruses belong to a member of the coronavirus family that was
            first identified in the 1960s. They are responsible to cause a range
            of diseases in humans including the common-cold and most severe and
            life-threatening forms like SARS and MERS.
          </Paragraph>
        </Card.Content>
        <Card.Actions
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <Button
            onPress={() => navigation.navigate("Page 2", { name: "Page 2" })}
            color="#0a77aa"
          >
            Previous
          </Button>
          <Button
            onPress={() => navigation.navigate("Page 4", { name: "Page 4" })}
            color="#0a77aa"
          >
            Done
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
  },
  welcomeText: {
    justifyContent: "center",
  },
});
