import React, { Component } from "react";
import { View, Image, Dimensions, StyleSheet } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Text from "./CustomText.js";

export default class Symptoms extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 250 }}>
          <Image
            source={require("../../assets/images/symptoms.jpg")}
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
            SYMPTOMS of COVID-19
          </Text>
          <Text style={{ fontSize: 12, fontWeight: "100", color: "#37474f" }}>
            COMMON SYMPTOMS OF CORONA VIRUS
          </Text>
          <Text
            style={{
              color: "#455a64",
              marginTop: 20,
              fontSize: 13,
              textAlign: "justify",
            }}
          >
            From what is known so far, a person infected with this disease may
            suffer from dry cough, mild fever, tiredness, and breathing issues
            which may go unnoticed at first.
            {"\n"}
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: "#37474f",
              fontFamily: "Roboto-Black",
            }}
          >
            WHAT MAKES THIS VIRUS UNIQUE
          </Text>

          <Text
            style={{
              color: "#455a64",
              marginTop: 10,
              fontSize: 13,
              textAlign: "justify",
            }}
          >
            What’s making the virus so difficult to contain is that Just like
            the common cold or flu and spread from people to people rather
            quickly.
            {"\n"}
            {"\n"}
            Some people will get COVID-19 but don't show any symptoms. In fact
            80% of people infected with COVID-19 recover without any special
            treatment. As people move around the world, COVID-19 has spread in
            all parts of the world and is continuing to do so.
            {"\n"}
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: "#37474f",
              fontFamily: "Roboto-Black",
            }}
          >
            THE MOST COMMON SYMPTOMS ARE:
          </Text>

          <View style={{ flexDirection: "row", padding: 10 }}>
            <View>
              <Image
                source={require("../../assets/cough512.png")}
                style={{ width: 20, height: 20 }}
              />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Dry Cough
              </Text>
              <Text style={{ fontSize: 12, color: "#607d8b" }}>
                A cough is supposed to protect you. It gets out stuff that
                doesn't belong in your lungs and windpipe, like inhaled dirt or
                food. Here are the common triggers. A virus can be one reason to
                trigger coughing
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", padding: 10 }}>
            <View>
              <Image
                source={require("../../assets/fever512.png")}
                style={{ width: 20, height: 20 }}
              />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>Fever</Text>
              <Text style={{ fontSize: 12, color: "#607d8b" }}>
                Also known as a high fever or a high temperature -- is not by
                itself an illness. It's usually a symptom of an underlying
                condition, most often an infection.
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", padding: 10 }}>
            <View>
              <Image
                source={require("../../assets/tired512.png")}
                style={{ width: 20, height: 20 }}
              />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Tiredness
              </Text>
              <Text style={{ fontSize: 12, color: "#607d8b" }}>
                Tiredness or feeling of fatigue can be one symtpom of corona
                virus.
              </Text>
            </View>
          </View>

          <Text
            style={{
              fontSize: 16,
              color: "#37474f",
              fontFamily: "Roboto-Black",
            }}
          >
            LESS COMMON SYMPTOMS
          </Text>

          <View style={{ flexDirection: "row", padding: 10 }}>
            <View>
              <Image
                source={require("../../assets/pain512.png")}
                style={{ width: 20, height: 20 }}
              />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Aches and Pain
              </Text>
              <Text style={{ fontSize: 12, color: "#607d8b" }}>
                While coronavirus can cause symptoms in your upper airways such
                as loss of smell or a blocked nose, it is usually associated
                with a high temperature, aches and pains and a cough.
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", padding: 10 }}>
            <View>
              <Image
                source={require("../../assets/sorethroat512.png")}
                style={{ width: 20, height: 20 }}
              />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Sore Throat
              </Text>
              <Text style={{ fontSize: 12, color: "#607d8b" }}>
                Sore throat most often can be caused by viral and/or bacterial
                infections like the common cold and flu or by infection with the
                streptococcus bacterium.
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", padding: 10 }}>
            <View>
              <Image
                source={require("../../assets/headache512.png")}
                style={{ width: 20, height: 20 }}
              />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Head Ache
              </Text>
              <Text style={{ fontSize: 12, color: "#607d8b" }}>
                Many viral infections can either directly or indirectly cause
                headache. The headache related to these viral infections appears
                to be related to the fever, the body’s production of interferon,
                and other elements of the immune system combating the viral
                infection.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
