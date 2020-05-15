import React, { Component } from "react";
import { View, Image, Dimensions, StyleSheet } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Text from "./CustomText.js";

export default class Spreads extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 250 }}>
          <Image
            source={require("../../assets/images/spreads.jpg")}
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
            How it spreads?
          </Text>
          <Text
            style={{ fontSize: 12, fontWeight: "100", color: "#37474f" }}
          ></Text>
          <View style={{ flexDirection: "row", padding: 10 }}>
            <View>
              <Image
                source={require("../../assets/corona.png")}
                style={{ width: 25, height: 25 }}
              />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Coronavirus{" "}
              </Text>
              <Text style={{ fontSize: 12, color: "#607d8b" }}>
                Unlike most deadly viruses who quickly hospitalize their hosts
                leading to their quarantine, is able to be highly contagious and
                spread quickly because the patient may not even show any
                symptoms for days after infection.
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", padding: 10 }}>
            <View>
              <FontAwesome name="calendar-check-o" color="#388e3c" size={25} />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Most patients don’t show symptoms for up to 14 days
              </Text>
              <Text style={{ fontSize: 12, color: "#607d8b" }}>
                Since most patients don’t show symptoms for up to 14 days, it’s
                likely that they pass it to others before they are quarantined
                and treated. The coronavirus is not only able to spread to
                others by direct contacts like touching each other’s hands but
                also through indirect contacts like digital devices like phones,
                desks, chairs, stairs, and elevator buttons and then touching
                your face (eyes, nose, or mouth).
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
