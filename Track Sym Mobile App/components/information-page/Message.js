import React, { Component } from "react";
import { View, Image, Dimensions, StyleSheet } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Text from "./CustomText.js";

export default class Message extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 250 }}>
          <Image
            source={require("../../assets/images/message.jpg")}
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
              fontFamily: "Robot-Black",
            }}
          >
            Message
          </Text>
          <Text
            style={{ fontSize: 12, fontWeight: "100", color: "#37474f" }}
          ></Text>
          <View style={{ flexDirection: "row", padding: 10 }}>
            <View>
              <Image
                source={require("../../assets/caution512.png")}
                style={{ width: 20, height: 20 }}
              />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                It is true that the risk of dying due to COVID-19 is
                significantly higher for 80+ age groups(as high as 14.8%) while
                it’s below 1% for age groups below 40
              </Text>
              <Text style={{ fontSize: 12, color: "#607d8b" }}>
                But this doesn’t mean that teenagers or young adults won’t be
                affected or die of this disease either because the virus is
                winning over the immune system or due to the fact that a large
                number of people are being infected and admitted to the hospital
                causing a toll on health care systems resulting in some patients
                not getting treated as effectively as they should be.
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", padding: 10 }}>
            <View>
              <FontAwesome
                name="arrow-circle-o-right"
                color="#388e3c"
                size={25}
              />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                Major concern
              </Text>
              <Text style={{ fontSize: 12, color: "#607d8b" }}>
                You should be careful not to get infected and stay safe. Even if
                you are not heavily sick, there is a big risk that you might
                pass it to your loved ones before the symptoms arise.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
