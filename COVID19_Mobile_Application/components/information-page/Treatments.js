import * as React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { Card, ListItem, Button, Icon } from "react-native-elements";

// Lottie library GIF to JSON
import LottieView from 'lottie-react-native';

export default function Treatments() {
  return (
    <ScrollView>
      <Card
        // // title="Treatment"
        // image={require("./icons/doctors.gif")}
        // containerStyle={{ margin: 0 }}
      >
        <ScrollView>
          <LottieView style={{ height: 200, marginBottom: 40, marginTop: -25, paddingTop: 50 }} source={require('./animations/prueba-doctores-freepik.json')} autoPlay loop />
          <Text style={{ marginBottom: 10 }}>
            There’s currently no treatment specifically approved for COVID-19,
            and no cure for an infection, although treatments and vaccines are
            currently under study. Instead, treatment focuses on managing
            symptoms as the virus runs its course. Seek medical help if you
            think you have COVID-19. Your doctor will recommend treatment for
            any symptoms or complications that develop, and let you know if you
            need to seek emergency treatment. Other coronaviruses like SARS and
            MERS are also treated by managing symptoms. In some cases,
            experimental treatments are tested to see how effective they are.
            Examples of therapies used for these illnesses include: antiviral or
            retroviral medications breathing support, such as mechanical
            ventilation steroids to reduce lung swelling blood plasma
            transfusions
          </Text>
        </ScrollView>
      </Card>
    </ScrollView>
  );
}