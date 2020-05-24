import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Text from "./CustomText.js";

const About = (props) => {
  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
      <View style={{ height: 230 }}>
        <Image
          source={require("../../../assets/images/tracker.png")}
          style={{ height: 220, width: Dimensions.get("screen").width }}
          resizeMode="cover"
        />
      </View>
      <View style={{ paddingLeft: 10, paddingRight: 10 }}>
        <Text
          style={{
            fontSize: 18,
            color: "#37474f",
            fontFamily: "Roboto-Black",
          }}
        >
          TRACK SYM
        </Text>
        <Text
          style={{
            color: "#455a64",
            marginTop: 10,
            marginBottom: 10,
            fontSize: 13,
            textAlign: "justify",
          }}
        >
          It is a non-commercial COVID-19 symptom tracking app that uses
          crowd-sourcing to collect and visualize the density of the relevant
          symptoms. Users can anonymously report their symptoms and choose a
          location to see the density of symptoms in a map view. The data is
          aggregated by places, therefore, the app can help people avoid
          visiting a grocery store, a gas station, or any other place that is
          heavily used by symptomatic people
        </Text>
      </View>
      <View style={{ height: 230 }}>
        <Image
          source={require("../../../assets/images/team.jpg")}
          style={{ height: 230, width: Dimensions.get("screen").width }}
          resizeMode="cover"
        />
      </View>
      <View style={{ paddingLeft: 10, paddingRight: 10 }}>
        <Text
          style={{
            fontSize: 18,
            color: "#37474f",
            fontFamily: "Roboto-Black",
          }}
        >
          WHO ARE WE?
        </Text>
        <Text
          style={{
            color: "#455a64",
            marginTop: 10,
            marginBottom: 10,
            fontSize: 13,
            textAlign: "justify",
          }}
        >
          A2SV - Africa to Silicon Valley is a team of highly motivated and
          talented students from Ethiopia, led by an ex-Google and Palantir
          Software/ML engineer.
        </Text>
      </View>
      <View style={{ height: 220 }}>
        <Image
          source={require("../../../assets/images/file.jpg")}
          style={{ height: 230, width: Dimensions.get("screen").width }}
          resizeMode="cover"
        />
      </View>
      <View style={{ padding: 10 }}>
        <Text
          style={{
            fontSize: 18,
            color: "#37474f",
            fontFamily: "Roboto-Black",
          }}
        >
          YOUR DATA
        </Text>
        <Text
          style={{
            color: "#455a64",
            marginTop: 10,
            fontSize: 13,
            textAlign: "justify",
          }}
        >
          Your data will be used anonymously for the purpose of data science and
          statistics, meaning any info generated isn’t traced back to a single
          user. This is a non-commercial project with no intention of profit.
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#bbdefb",
            padding: 5,
            marginTop: 10,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 5,
          }}
          onPress={() => Linking.openURL("http://www.a2sv.org")}
        >
          <Text>CHECK OUT OUR WEBSITE</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default About;
