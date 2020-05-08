import * as React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { Card, ListItem, Button, Icon } from "react-native-elements";

import Shadow from "./styles/Shadow";
import BorderRadius from "./styles/BorderRadius";
import ButtonStyle from "./styles/ButtonStyle";
import ImageStyle from "./styles/ImageStyle";

export default function InformationPage(props) {
  return (
    <ScrollView>
      <Card
        title="What is Corona Virus?"
        containerStyle={[Shadow.shadow, BorderRadius.borderRadius]}
        titleStyle={{ fontSize: 20, fontWeight: "bold" }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            style={ImageStyle.imageStyle}
            resizeMode="cover"
            source={require("../../assets/covid.jpg")}
          />
          <Text style={{ flex: 2, marginTop: 15 }}>
            Coronavirus disease 2019 is an infectious disease caused by severe
            acute respiratory syndrome coronavirus 2.
          </Text>
        </View>
        <Button
          buttonStyle={[ButtonStyle.buttonStyle, BorderRadius.borderRadius]}
          title="Read more"
          onPress={() => props.navigation.navigate("What Is Covid-19?")}
        />
      </Card>

      <Card
        title="Symptoms"
        containerStyle={[Shadow.shadow, BorderRadius.borderRadius]}
        titleStyle={{ fontSize: 18 }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            style={ImageStyle.imageStyle}
            resizeMode="cover"
            source={require("../../assets/symptoms.jpg")}
          />
          <Text style={{ flex: 2, marginTop: 15 }}>
            Fever, cough and shortness of breath are the common symptoms
            reported by patients
          </Text>
        </View>
        <Button
          buttonStyle={[ButtonStyle.buttonStyle, BorderRadius.borderRadius]}
          title="Read more"
          onPress={() => props.navigation.navigate("Covid19 Symptoms")}
        />
      </Card>

      <Card
        title="Preventions"
        containerStyle={[Shadow.shadow, BorderRadius.borderRadius]}
        titleStyle={{ fontSize: 18 }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            style={ImageStyle.imageStyle}
            resizeMode="cover"
            source={require("../../assets/Prevention.jpg")}
          />
          <Text style={{ flex: 2, marginTop: 15 }}>
            Follow the guidelines to help protect yourself from catching,
            carrying and passing on SARS-CoV-2.
          </Text>
        </View>
        <Button
          buttonStyle={[ButtonStyle.buttonStyle, BorderRadius.borderRadius]}
          title="Read more"
          onPress={() => props.navigation.navigate("Preventions")}
        />
      </Card>

      <Card
        title="Treatment"
        containerStyle={[Shadow.shadow, BorderRadius.borderRadius]}
        titleStyle={{ fontSize: 18 }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            style={ImageStyle.imageStyle}
            resizeMode="cover"
            source={require("../../assets/treatment.jpg")}
          />
          <Text style={{ flex: 2, marginTop: 15 }}>
            There currently isn’t a vaccine against developing COVID-19.
            Antibiotics are also ineffective because COVID-19 is a viral
            infection and not bacterial.
          </Text>
        </View>
        <Button
          buttonStyle={[ButtonStyle.buttonStyle, BorderRadius.borderRadius]}
          title="Read more"
          onPress={() => props.navigation.navigate("Treatments")}
        />
      </Card>
    </ScrollView>
  );
}
