import React, { Component } from "react";
import { View, Image, Dimensions, StyleSheet } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Text from "./CustomText.js";

export default class WhatIsCovid19 extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 250 }}>
          <Image
            source={require("../../assets/images/prevention_methods.jpg")}
            style={{ height: 250, width: Dimensions.get("screen").width }}
            resizeMode="cover"
          />
        </View>
        <ScrollView
          style={{ padding: 10 }}
          ref="_scrollView"
          alwaysBounceVertical={true}
        >
          <Text
            style={{
              fontSize: 21,
              color: "#37474f",
              fontFamily: "Roboto-Black",
            }}
          >
            WHAT IS COVID-19?
          </Text>
          <Text style={{ fontSize: 12, fontWeight: "100", color: "#37474f" }}>
            CORONAVIRUS DESEASE 2019
          </Text>
          <Text
            style={{
              color: "#455a64",
              marginTop: 20,
              fontSize: 13,
              textAlign: "justify",
            }}
          >
            Severe Acute Respiratory Syndrome Coronavirus-2 (SARS-CoV-2) is the
            name given to the 2019 novel coronavirus. COVID-19 is the name given
            to the disease associated with the virus.{"\n"} {"\n"}
            SARS-CoV-2 is a new strain of coronavirus that has not been
            previously identified in humans. Coronaviruses are viruses that
            circulate among animals with some of them also known to infect
            humans.
            {"\n"}
          </Text>

          <Text
            style={{
              fontSize: 18,
              color: "#37474f",
              fontFamily: "Roboto-Black",
            }}
          >
            WHAT DO WE KNOW SOFAR?
          </Text>

          <View style={{ flexDirection: "row", padding: 10 }}>
            <View>
              <FontAwesome name="history" color="#388e3c" size={25} />
            </View>

            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                Brief History of Corona Virus
              </Text>
              <Text style={{ fontSize: 12, color: "#607d8b" }}>
                There is much more to coronaviruses than SARS-CoV-2.
                Coronaviruses are actually a family of hundreds of viruses. Most
                of these infect animals such as bats, chickens, camels and cats.
                {"\n"}
                {"\n"}
                Occasionally, viruses that infect one species can mutate in such
                a way that allows them to start infecting another species. This
                is called “cross-species transmission” or “spillover”.
                {"\n"}
                {"\n"}
                The first coronavirus was discovered in chickens in the 1930s.
                It was a few decades until the first human coronaviruses were
                identified in the 1960s.
                {"\n"}
                {"\n"}
                To date, seven coronaviruses have the ability to cause disease
                in humans. Four are endemic (regularly found among particular
                people or in a certain area) and usually cause mild disease, but
                three can cause much more serious and even fatal disease.
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", padding: 10 }}>
            <View>
              <MaterialCommunityIcons name="origin" color="#ffb300" size={25} />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                Where did it come from
              </Text>
              <Text style={{ fontSize: 12, color: "#607d8b" }}>
                It is said to have come from a market that sells meat and live
                animals. It is believed that the virus might have been
                transmitted through direct contact between humans and animals.
                {"\n"} {"\n"}
                Either by touching those animals or by eating them. And it can
                also spread via the air. However, the actual source of this
                disease isn’t known yet.
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", padding: 10 }}>
            <View>
              <MaterialCommunityIcons name="unreal" color="#388e3c" size={25} />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                Misconceptions
              </Text>
              <Text style={{ fontSize: 12, color: "#607d8b" }}>
                Common misconception regarding COVID-19 is that coronaviruses
                affect only old people. This is far from true and is killing
                many people from various age groups.
                {"\n"} {"\n"}
                It is true that the risk of dying due to COVID-19 is
                significantly higher for 80+ age groups(as high as 14.8%) while
                it’s below 1% for age groups below 40.
                {"\n"}
                {"\n"}
                But this doesn’t mean that teenagers won’t be affected or die.
                So these and other false facts can lead to a dangerous road.
                {"\n"}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
