import * as React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { Card, ListItem, Button, Icon } from "react-native-elements";

// Lottie library GIF to JSON
import LottieView from "lottie-react-native";

// Styles
import Shadow from "./styles/Shadow";
import BorderRadius from "./styles/BorderRadius";
import ButtonStyle from "./styles/ButtonStyle";
import ImageStyle from "./styles/ImageStyle";

// Cosider using
// https://akveo.github.io/react-native-ui-kitten/

export default function InformationPage(props) {
  return (
    <ScrollView>
      <Card
        title={
          <Text
            style={{
              fontSize: 20,
              fontFamily: "Roboto-Black",
              textAlign: "center",
            }}
          >
            What is Corona Virus?
          </Text>
        }
        containerStyle={[Shadow.shadow, BorderRadius.borderRadius]}
      >
        <View style={{ flexDirection: "row" }}>
          <LottieView
            style={ImageStyle.imageStyle}
            source={require("./animations/covid-19-virus.json")}
            autoPlay
            loop
          />
          <Text
            style={{ flex: 2, marginTop: 15, fontFamily: "PlayfairDisplay" }}
          >
            Coronavirus disease 2019 is an infectious disease caused by severe
            acute respiratory syndrome coronavirus 2.
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Button
            buttonStyle={[ButtonStyle.buttonStyle, BorderRadius.borderRadius]}
            title="Read more"
            type="clear"
            onPress={() => props.navigation.navigate("What Is Covid-19?")}
            titleStyle={{ fontFamily: "PlayfairDisplay" }}
          />
        </View>
      </Card>

      <Card
        title={
          <Text
            style={{
              fontSize: 20,
              fontFamily: "Roboto-Black",
              textAlign: "center",
            }}
          >
            Symptoms
          </Text>
        }
        containerStyle={[Shadow.shadow, BorderRadius.borderRadius]}
      >
        <View style={{ flexDirection: "row" }}>
          <LottieView
            style={ImageStyle.imageStyle}
            source={require("./animations/sneezing.json")}
            autoPlay
            loop
          />
          <Text
            style={{ flex: 2, marginTop: 15, fontFamily: "PlayfairDisplay" }}
          >
            Fever, cough and shortness of breath are the common symptoms
            reported by patients.
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Button
            buttonStyle={[ButtonStyle.buttonStyle, BorderRadius.borderRadius]}
            title="Read more"
            type="clear"
            onPress={() => props.navigation.navigate("Covid19 Symptoms")}
            titleStyle={{ fontFamily: "PlayfairDisplay" }}
          />
        </View>
      </Card>

      <Card
        title={
          <Text
            style={{
              fontSize: 20,
              fontFamily: "Roboto-Black",
              textAlign: "center",
            }}
          >
            Preventions
          </Text>
        }
        containerStyle={[Shadow.shadow, BorderRadius.borderRadius]}
      >
        <View style={{ flexDirection: "row" }}>
          <LottieView
            style={ImageStyle.imageStyle}
            source={require("./animations/wash-your-hands.json")}
            autoPlay
            loop
          />
          <Text
            style={{ flex: 2, marginTop: 15, fontFamily: "PlayfairDisplay" }}
          >
            Follow the guidelines to help protect yourself from catching,
            carrying and passing on SARS-CoV-2.
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Button
            buttonStyle={[ButtonStyle.buttonStyle, BorderRadius.borderRadius]}
            title="Read more"
            type="clear"
            onPress={() => props.navigation.navigate("Preventions")}
            titleStyle={{ fontFamily: "PlayfairDisplay" }}
          />
        </View>
      </Card>

      <Card
        title={
          <Text
            style={{
              fontSize: 20,
              fontFamily: "Roboto-Black",
              textAlign: "center",
            }}
          >
            How Covid-19 Spreads
          </Text>
        }
        containerStyle={[Shadow.shadow, BorderRadius.borderRadius]}
        titleStyle={{ fontSize: 18 }}
      >
        <View style={{ flexDirection: "row" }}>
          <LottieView
            style={ImageStyle.imageStyle}
            source={require("./animations/socialDistancing.json")}
            autoPlay
            loop
          />
          <Text
            style={{ flex: 2, marginTop: 15, fontFamily: "PlayfairDisplay" }}
          >
            COVID-19 is thought to spread mainly from person to person, mainly
            through respiratory droplets from an infected person.
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Button
            buttonStyle={[ButtonStyle.buttonStyle, BorderRadius.borderRadius]}
            title="Read more"
            type="clear"
            onPress={() => props.navigation.navigate("Spreads")}
            titleStyle={{ fontFamily: "PlayfairDisplay" }}
          />
        </View>
      </Card>

      <Card
        title={
          <Text
            style={{
              fontSize: 20,
              fontFamily: "Roboto-Black",
              textAlign: "center",
            }}
          >
            Message
          </Text>
        }
        containerStyle={[Shadow.shadow, BorderRadius.borderRadius]}
        titleStyle={{ fontSize: 20, fontWeight: "bold" }}
      >
        <View style={{ flexDirection: "row" }}>
          <LottieView
            style={ImageStyle.imageStyle}
            source={require("./animations/stayhome.json")}
            autoPlay
            loop
          />
          <Text
            style={{ flex: 2, marginTop: 15, fontFamily: "PlayfairDisplay" }}
          >
            There's a lot of information circulating about COVID-19, so it’s
            important to know what’s true and what’s not.
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Button
            buttonStyle={[ButtonStyle.buttonStyle, BorderRadius.borderRadius]}
            title="Read more"
            type="clear"
            onPress={() => props.navigation.navigate("Message")}
            titleStyle={{ fontFamily: "PlayfairDisplay" }}
          />
        </View>
      </Card>
    </ScrollView>
  );
}
