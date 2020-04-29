import * as React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { Card, ListItem, Button, Icon } from "react-native-elements";
import ImageStyle from './styles/ImageStyle'

export default function WhatIsCovid19() {
  return (
    <ScrollView>
      <Card
        // title="What is COVID-19?"
        image={
          require("./icons/corona-red.gif")
        }
        containerStyle={{ margin: 0 }}
      >
        <ScrollView>
          <Text style={{ marginBottom: 10 }}>
            Coronavirus disease 2019 is an infectious disease caused by severe
            acute respiratory syndrome coronavirus 2. The disease was first
            identified in December 2019 in Wuhan, the capital of China's Hubei
            province, and has since spread globally, resulting in the ongoing
            2019–20 coronavirus pandemic. As of 27 April 2020, more than 2.97
            million cases have been reported across 185 countries and
            territories, resulting in more than 206,000 deaths. More than
            868,000 people have recovered. Common symptoms include fever, cough,
            fatigue, shortness of breath and loss of smell. While the majority
            of cases result in mild symptoms, some progress to viral pneumonia,
            multi-organ failure, or cytokine storm. More concerning symptoms
            include difficulty breathing, persistent chest pain, confusion,
            difficulty waking, and bluish skin. The time from exposure to onset
            of symptoms is typically around five days but may range from two to
            fourteen days
          </Text>
        </ScrollView>
      </Card>
    </ScrollView>
  );
}