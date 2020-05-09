import React, { Component } from "react";
import { View, Text, Image, Dimensions, StyleSheet } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import FontAwesome from "react-native-vector-icons/FontAwesome";

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
              fontFamily: "sans-serif-light",
              fontWeight: "bold",
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
            Coronavirus disease 2019 (COVID-19) is an infectious disease caused
            by severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2). It
            was first identified in December 2019 in Wuhan, China, and has since
            spread globally, resulting in an ongoing pandemic. As of 9 May 2020,
            more than 3.93 million cases have been reported across 187 countries
            and territories, resulting in more than 274,000 deaths. More than
            1.31 million people have recovered.
          </Text>
          <View style={{ flexDirection: "row", padding: 10 }}>
            <View>
              <FontAwesome name="user" color="#388e3c" size={25} />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 12, fontWeight: "bold" }}>COUGH</Text>
              <Text style={{ fontSize: 12, color: "#607d8b" }}>
                Coughing is one of thr major syptoms
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", padding: 10 }}>
            <View>
              <FontAwesome name="user" color="#ffb300" size={25} />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 12, fontWeight: "bold" }}>COUGH</Text>
              <Text style={{ fontSize: 12, color: "#607d8b" }}>
                Coughing is one of thr major syptoms
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", padding: 10 }}>
            <View>
              <FontAwesome name="user" color="#388e3c" size={25} />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 12, fontWeight: "bold" }}>COUGH</Text>
              <Text style={{ fontSize: 12, color: "#607d8b" }}>
                Coughing is one of thr major syptoms
              </Text>
            </View>
          </View>
          <Text
            style={{
              color: "#455a64",
              marginTop: 20,
              fontSize: 13,
              textAlign: "justify",
            }}
          >
            Coronavirus disease 2019 (COVID-19) is an infectious disease caused
            by severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2). It
            was first identified in December 2019 in Wuhan, China, and has since
            spread globally, resulting in an ongoing pandemic. As of 9 May 2020,
            more than 3.93 million cases have been reported across 187 countries
            and territories, resulting in more than 274,000 deaths. More than
            1.31 million people have recovered.
          </Text>
          <View style={{ flexDirection: "row", padding: 10 }}>
            <View>
              <FontAwesome name="user" color="#388e3c" size={25} />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 12, fontWeight: "bold" }}>COUGH</Text>
              <Text style={{ fontSize: 12, color: "#607d8b" }}>
                Coughing is one of thr major syptoms
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", padding: 10 }}>
            <View>
              <FontAwesome name="user" color="#ffb300" size={25} />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 12, fontWeight: "bold" }}>COUGH</Text>
              <Text style={{ fontSize: 12, color: "#607d8b" }}>
                Coughing is one of thr major syptoms
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", padding: 10, marginBottom: 20 }}>
            <View>
              <FontAwesome name="user" color="#388e3c" size={25} />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 12, fontWeight: "bold" }}>COUGH</Text>
              <Text style={{ fontSize: 12, color: "#607d8b" }}>
                Coughing is one of thr major syptoms
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
