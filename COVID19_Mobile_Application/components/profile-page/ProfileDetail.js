import React, { useState, useEffect } from "react";
import {
  View,
<<<<<<< Updated upstream
  Text,
=======
>>>>>>> Stashed changes
  TouchableOpacity,
  StyleSheet,
  Platform,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import userIDStore from "../data-management/user-id-data/userIDStore";
<<<<<<< Updated upstream
=======
import Text from "./CustomText.js";
>>>>>>> Stashed changes

const ProfileDetail = (props) => {
  const [data, setData] = React.useState({
    check_textInputChange: false,
    passVisibility: true,
    buttonPressed: false,
  });
  const [userName, setUserName] = useState("");
  const [ageGroup, setUserAgeGroup] = useState("");
  const [gender, setUserGender] = useState("");
  const [pass, setPass] = useState("");

  const setUserProfile = () => {
    setUserName(userIDStore.getState().userName);
    setUserAgeGroup(userIDStore.getState().userAgeGroup);
    setUserGender(userIDStore.getState().gender);
  };

  useEffect(() => {
    setUserProfile();
  }, []);

  const updateProfile = () => {
    fetch("https://sym-track.herokuapp.com/api/users", {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + userIDStore.getState().userToken,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: userIDStore.getState().userId,
        username: userName,
        password: pass,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("success");
        props.navigation.navigate("Profile");
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Poor connection", "Couldn't resgister, please try again!");
      });
  };

  const onTogglePasswordVisiblity = () => {
    setData((prevState) => ({
      ...prevState,
      passVisibility: !prevState.passVisibility,
    }));
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.footer}>
          <Text style={styles.text_footer}>Username</Text>
          <View style={styles.action}>
            <FontAwesome name="user-o" color="#05375a" size={20} />
            <TextInput
              placeholder={userName}
              onChangeText={(val) => setUserName(val)}
              style={styles.textInput}
              editable={false}
            />
          </View>
          <Text style={[styles.text_footer, { marginTop: 30 }]}>GENDER</Text>
          <View style={styles.action}>
            <FontAwesome name="users" color="#05375a" size={20} />
            <TextInput
              placeholder={gender}
              onChangeText={(val) => setUserGender(val)}
              style={styles.textInput}
              editable={false}
            />
          </View>
          <Text style={[styles.text_footer, { marginTop: 30 }]}>AGE GROUP</Text>
          <View style={styles.action}>
            <FontAwesome name="sort-numeric-desc" size={20} color="#05375a" />
            <TextInput
              placeholder={ageGroup}
              onChangeText={(val) => setUserAgeGroup(val)}
              style={styles.textInput}
              editable={false}
            />
          </View>

          <Text style={[styles.text_footer, { marginTop: 30 }]}>Password</Text>
          <View style={styles.action}>
            <FontAwesome name="lock" color="#05375a" size={20} />
            <TextInput
              placeholder="Your new password"
              onChangeText={(val) => setPass(val)}
              secureTextEntry={data.passVisibility}
              style={styles.textInput}
            />
            <TouchableOpacity
              style={{ width: 30, height: 30 }}
              onPress={() => onTogglePasswordVisiblity()}
            >
              {data.passVisibility ? (
                <Feather name="eye-off" color="grey" size={20} />
              ) : (
                <Feather name="eye" color="grey" size={20} />
              )}
            </TouchableOpacity>
          </View>

          {/* <Text style={[styles.text_footer, { marginTop: 30 }]}>
            Confirm Pass
          </Text>
          <View style={styles.action}>
            <FontAwesome name="lock" color="#05375a" size={20} />
            <TextInput
              placeholder="Your pass"
              onChangeText={(val) => onPassTextChange(val)}
              secureTextEntry={data.passVisibility}
              style={styles.textInput}
            />
            <TouchableOpacity
              style={{ width: 30, height: 30 }}
              onPress={() => onTogglePassVisiblity()}
            >
              {data.passVisibility ? (
                <Feather name="eye-off" color="grey" size={20} />
              ) : (
                <Feather name="eye" color="grey" size={20} />
              )}
            </TouchableOpacity>
          </View> */}

          <View style={[styles.sbutton]}>
            <TouchableOpacity
              style={styles.signIn}
              onPress={() => updateProfile()}
            >
              <Text style={([styles.textSign], { color: "#1565c0" })}>
                DONE
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1565c0",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: "#fff",
<<<<<<< Updated upstream
    fontWeight: "bold",
    fontSize: 30,
=======
    fontFamily: "Roboto-Black",
>>>>>>> Stashed changes
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#1565c0",
    borderRadius: 50,
    marginTop: 50,
  },
  sbutton: {
    alignItems: "center",
    borderColor: "#1565c0",
    borderWidth: 1,
    borderRadius: 50,
    marginTop: 20,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  signUp: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
