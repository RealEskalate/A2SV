import React from "react";
import { StyleSheet, View, Text, Image, StatusBar } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import Icon from "react-native-vector-icons/Ionicons";
import {
  View as AnimatableView,
  Text as AnimatbleText,
} from "react-native-animatable";
import AsyncStorage from "@react-native-community/async-storage";

const slides = [
  {
    key: 1,
    title: "WELCOME TO TRACK SYM",
    text: "Check Information About Covid-19",
    subText: "Symptoms, Prevention and more...",
    image: require("../../../assets/images/slide1.png"),
    backgroundColor: "#29a2f8",
  },
  {
    key: 2,
    title: "DATA REPRESENTATION",
    text: "Graphical Representation of Covid-19 Data",
    subText: "Active, Recovered, Dealth Stats",
    image: require("../../../assets/images/slide2.png"),
    backgroundColor: "#f57f17",
  },
  {
    key: 3,
    title: "SYMPTOM TRACKING",
    text: "Track your symptoms by registering it",
    subText: "Monitor your symptoms",
    image: require("../../../assets/images/slide3.png"),
    backgroundColor: "#B72125",
  },
  {
    key: 4,
    title: "KNOW WHATS AROUND YOU",
    text: "See how many symptomatic individuals are around you",
    subText: "Choose when to go or not",
    image: require("../../../assets/images/slide4.png"),
    backgroundColor: "#43a047",
  },
  {
    key: 5,
    title: "GET INSTANT TOP NEWS",
    text: "Search any news about Covid-19",
    subText: "",
    image: require("../../../assets/images/slide5.png"),
    backgroundColor: "#29a2f8",
  },
];

export default class Introduction extends React.Component {
  _renderItem = ({ item }) => {
    return (
      <View
        style={[
          styles.slide,
          {
            backgroundColor: item.backgroundColor,
          },
        ]}
      >
        <Image source={item.image} style={styles.image} resizeMode="contain" />
        <AnimatbleText useNativeDriver style={styles.title}>
          {item.title}
        </AnimatbleText>
        <AnimatbleText
          useNativeDriver
          animation="fadeInRight"
          duration={1000}
          style={styles.text}
        >
          {item.text}
        </AnimatbleText>
        <AnimatbleText
          useNativeDriver
          animation="fadeInLeft"
          duration={1000}
          style={styles.text}
        >
          {item.subText}
        </AnimatbleText>
        <AnimatableView
          useNativeDriver
          animation="pulse"
          iterationCount="infinite"
          easing="ease-in"
          style={{
            width: 44,
            height: 44,
            position: "absolute",
            top: 50,
            right: 30,
            borderRadius: 22,
            backgroundColor: "rgba(255, 255, 255, .9)",
          }}
        />
        <AnimatableView
          useNativeDriver
          animation="pulse"
          iterationCount="infinite"
          easing="ease-in"
          style={{
            width: 30,
            height: 30,
            position: "absolute",
            top: 180,
            right: 70,
            borderRadius: 15,
            backgroundColor: "rgba(255, 255, 255, .7)",
          }}
        />
        <AnimatableView
          useNativeDriver
          animation="pulse"
          iterationCount="infinite"
          easing="ease-in"
          style={{
            width: 26,
            height: 26,
            position: "absolute",
            top: 380,
            right: 280,
            borderRadius: 13,
            backgroundColor: "rgba(255, 255, 255, .7)",
          }}
        />
        <AnimatableView
          useNativeDriver
          animation="pulse"
          iterationCount="infinite"
          easing="ease-in"
          style={{
            width: 10,
            height: 10,
            position: "absolute",
            top: 80,
            left: 40,
            borderRadius: 5,
            backgroundColor: "rgba(255, 255, 255, .7)",
          }}
        />
        <AnimatableView
          useNativeDriver
          animation="pulse"
          iterationCount="infinite"
          easing="ease-in"
          style={{
            width: 16,
            height: 16,
            position: "absolute",
            bottom: 180,
            right: 40,
            borderRadius: 8,
            backgroundColor: "rgba(255, 255, 255, .7)",
          }}
        />
      </View>
    );
  };

  _keyExtractor = (item) => item.title;

  _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="md-arrow-round-forward"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </View>
    );
  };

  _renderSkipButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Text style={{ fontSize: 15, color: "white" }}>SKIP</Text>
      </View>
    );
  };

  _renderPrevButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="md-arrow-round-back"
          size={24}
          color="rgba(255, 255, 255, .9)"
        />
      </View>
    );
  };

  _renderDoneButton = () => {
    return (
      <AnimatableView
        useNativeDriver
        style={styles.buttonCircle}
        animation="rubberBand"
        easing="ease-out"
        iterationCount="infinite"
      >
        <Icon name="md-checkmark" color="rgba(255, 255, 255, .9)" size={24} />
      </AnimatableView>
    );
  };

  saveAndGotoLogin = async () => {
    try {
      await AsyncStorage.setItem("isFirstInterance", "false");
      this.props.navigation.navigate("LoginScreen");
    } catch (er) {
      alert(er);
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <AppIntroSlider
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          renderNextButton={this._renderNextButton}
          renderPrevButton={this._renderPrevButton}
          renderSkipButton={this._renderSkipButton}
          renderDoneButton={this._renderDoneButton}
          showSkipButton
          showPrevButton
          onDone={this.saveAndGotoLogin}
          data={slides}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 220,
    height: 320,
    marginVertical: 32,
  },
  text: {
    fontSize: 17,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  title: {
    fontSize: 22,
    marginBottom: 5,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  buttonCircle: {
    width: 44,
    height: 44,
    backgroundColor: "rgba(0, 0, 0, .2)",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  skipButton: {
    width: 44,
    height: 44,
    backgroundColor: "rgba(0, 0, 0, .2)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
