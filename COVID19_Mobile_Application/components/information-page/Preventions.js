import React, { Component } from "react";
import { View, Image, Dimensions, StyleSheet } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Text from "./CustomText.js";

export default class Symptoms extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 250 }}>
          <Image
            source={require("../../assets/images/prevention.jpg")}
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
            PREVENTION METHODS
          </Text>
          <Text style={{ fontSize: 12, fontWeight: "100", color: "#37474f" }}>
            PREVENTION IS BETTER THAN CURE!
          </Text>
          <View style={{ flexDirection: "row", padding: 10 }}>
            <View>
              <FontAwesome name="hand-rock-o" color="#388e3c" size={25} />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Wash your hands frequently
              </Text>
              <Text style={{ fontSize: 12, color: "#607d8b" }}>
                Regularly and thoroughly clean your hands with an alcohol-based
                hand{"\n"} rub or wash them with soap and water.
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", padding: 10 }}>
            <View>
              <Image
                source={require("../../assets/keepdistance512.png")}
                style={{ width: 20, height: 20 }}
              />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Maintain social distancing
              </Text>
              <Text style={{ fontSize: 12, color: "#607d8b" }}>
                Maintain at least 2 meters (6 feet) distance between yourself
                and{"\n"} anyone who is coughing or sneezing.
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", padding: 10 }}>
            <View>
              <Image
                source={require("../../assets/notouch512.png")}
                style={{ width: 20, height: 20 }}
              />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Avoid touching eyes, nose and mouth
              </Text>
              <Text style={{ fontSize: 12, color: "#607d8b" }}>
                Why? Hands touch many surfaces and can pick up viruses. Once
                contaminated, hands can transfer the virus to your eyes, nose,
                or mouth. From there, the virus can enter your body and can make
                you sick.
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", padding: 10 }}>
            <View>
              <Image
                source={require("../../assets/respiratoryhygiene512.png")}
                style={{ width: 20, height: 20 }}
              />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Practice respiratory hygiene
              </Text>
              <Text style={{ fontSize: 12, color: "#607d8b" }}>
                Make sure you, and the people around you, follow good
                respiratory hygiene. This means covering your mouth and nose
                with your bent elbow or tissue when you cough or sneeze. Then
                dispose of the used tissue immediately.
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", padding: 10 }}>
            <View>
              <FontAwesome name="info" color="#ffb300" size={25} />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Stay informed and follow the advice given by your healthcare
                provider
              </Text>
              <Text style={{ fontSize: 12, color: "#607d8b" }}>
                Stay informed on the latest developments about COVID-19. Follow
                the advice given by your healthcare provider, your national and
                local public health authority, or your employer on how to
                protect yourself and others from COVID-19.
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", padding: 10, marginBottom: 20 }}>
            <View>
              <FontAwesome name="hospital-o" color="#388e3c" size={25} />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                If you have fever, cough and difficulty breathing, seek medical
                care early
              </Text>
              <Text style={{ fontSize: 12, color: "#607d8b" }}>
                Stay home if you feel unwell. If you have a fever, cough and
                difficulty breathing, seek medical attention, and call in
                advance. Follow the directions of your local health authority.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
