import * as React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { Card, ListItem, Button, Icon } from "react-native-elements";

export default function InformationPage(props) {
  return (
    <ScrollView>
      <Card
        title="What is COVID-19?"
        containerStyle={{ borderRadius: 20, elevation: 20 }}
        titleStyle={{ fontSize: 18 }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{
              flex: 1,
              width: 100,
              height: 100,
              marginBottom: 10,
              marginRight: 5,
            }}
            resizeMode="cover"
            source={require("../../assets/covid.jpg")}
          />
          <Text style={{ flex: 2, marginTop: 15 }}>
            Coronavirus disease 2019 is an infectious disease caused by severe
            acute respiratory syndrome coronavirus 2.
          </Text>
        </View>
        <Button
          buttonStyle={{
            borderRadius: 20,
            marginLeft: 0,
            marginRight: 0,
            marginBottom: 0,
          }}
          title="Read more"
          onPress={() => props.navigation.navigate("What Is Covid-19?")}
        />
      </Card>
      <Card
        title="Symptoms"
        containerStyle={{ borderRadius: 20, elevation: 20 }}
        titleStyle={{ fontSize: 18 }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{
              flex: 1,
              width: 100,
              height: 100,
              marginBottom: 10,
              marginRight: 5,
            }}
            resizeMode="cover"
            source={require("../../assets/symptoms.jpg")}
          />
          <Text style={{ flex: 2, marginTop: 15 }}>
            Fever, cough and shortness of breath are the common symptoms
            reported by patients
          </Text>
        </View>
        <Button
          buttonStyle={{
            borderRadius: 20,
            marginLeft: 0,
            marginRight: 0,
            marginBottom: 0,
          }}
          title="Read more"
          onPress={() => props.navigation.navigate("Covid19 Symptoms")}
        />
      </Card>
      <Card
        title="Preventions"
        containerStyle={{ borderRadius: 20, elevation: 20 }}
        titleStyle={{ fontSize: 18 }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{
              flex: 1,
              width: 100,
              height: 100,
              marginBottom: 10,
              marginRight: 5,
            }}
            resizeMode="cover"
            source={require("../../assets/prevention.jpg")}
          />
          <Text style={{ flex: 2, marginTop: 15 }}>
            Follow the guidelines to help protect yourself from catching,
            carrying and passing on SARS-CoV-2.
          </Text>
        </View>
        <Button
          buttonStyle={{
            borderRadius: 20,
            marginLeft: 0,
            marginRight: 0,
            marginBottom: 0,
          }}
          title="Read more"
          onPress={() => props.navigation.navigate("Preventions")}
        />
      </Card>
      <Card
        title="Treatment"
        containerStyle={{ borderRadius: 20, elevation: 20 }}
        titleStyle={{ fontSize: 18 }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{
              flex: 1,
              width: 100,
              height: 100,
              marginBottom: 10,
              marginRight: 5,
            }}
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
          buttonStyle={{
            borderRadius: 20,
            marginLeft: 0,
            marginRight: 0,
            marginBottom: 0,
          }}
          title="Read more"
          onPress={() => props.navigation.navigate("Treatments")}
        />
      </Card>
    </ScrollView>
  );
}
