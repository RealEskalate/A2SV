import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import userIDStore from "../data-management/user-id-data/userIDStore";
import * as actions from "../data-management/user-id-data/userIDActions";
import Text from "./CustomText.js";

const Profile = (props) => {
  const [userName, setUserName] = useState("");
  const [ageGroup, setUserAgeGroup] = useState("");
  const [gender, setUserGender] = useState("");

  const setUserProfile = () => {
    setUserName(userIDStore.getState().userName);
    setUserAgeGroup(userIDStore.getState().userAgeGroup);
    setUserGender(userIDStore.getState().gender);
  };

  useEffect(() => {
    setUserProfile();
  }, []);

  return (
    <View>
      <View style={{ height: 150 }}>
        <Image
          source={require("../../assets/images/user.jpg")}
          style={{ height: 140, width: Dimensions.get("screen").width }}
          resizeMode="cover"
        />
      </View>
      <View style={{ paddingLeft: 10, paddingRight: 10, alignItems: "center" }}>
        <Text style={styles.name}>{userName}</Text>
      </View>

      <ScrollView>
        <View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Username</Text>
            <Text style={styles.sectionDescription}>{userName}</Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Gender</Text>
            <Text style={styles.sectionDescription}>{gender}</Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Age Group</Text>
            <Text style={styles.sectionDescription}>{ageGroup}</Text>
          </View>

          <View style={styles.sectionContainer}>
            <TouchableOpacity
              style={{
                margin: 10,
                padding: 10,
                alignItems: "center",
                borderRadius: 10,
                backgroundColor: "#bbdefb",
              }}
              activeOpacity={0.7}
              onPress={() => {
                props.navigation.navigate("ProfileDetail");
              }}
            >
              <Text>CHNAGE MY INFO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  name: {
    fontSize: 18,
    color: "#37474f",

    fontFamily: "Roboto-Black",
  },
  username: {
    color: "#455a64",
    marginBottom: 10,
    fontSize: 13,
    textAlign: "justify",
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3c3c3c",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "400",
    color: "#3c3c3c",
  },
  highlight: {
    fontWeight: "700",
  },
});
