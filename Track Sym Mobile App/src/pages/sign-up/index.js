import React from "react";
import { View, TouchableWithoutFeedback, ScrollView } from "react-native";
import {
  Button,
  CheckBox,
  Divider,
  Icon,
  Input,
  Text,
  useStyleSheet,
  Select,
  SelectItem,
  IndexPath,
  Modal,
  Card,
  Spinner,
  Layout,
} from "@ui-kitten/components";
import { ImageOverlay } from "../../components/ImageOverlay/image-overlay.component";
import { BackIcon, GoogleIcon, FacebookIcon, TwitterIcon } from "./extra/icons";
import themedStyles from "./extra/themedStyles.js";
import { KeyboardAvoidingView } from "../../components/3rd-party";
import userIDStore from "../../data-management/user-id-data/userIDStore";
import * as actions from "../../data-management/user-id-data/userIDActions";
import { strings } from "../../localization/localization";
import AsyncStorage from "@react-native-community/async-storage";
import { LangContext } from "../../../assets/lang/language-context";

const data = [
  "0-10",
  "11-20",
  "21-30",
  "31-40",
  "41-50",
  "51-60",
  "61-70",
  "71-80",
  "81-90",
  ">90",
];

const genderData = [strings.Male, strings.Female];

export default ({ navigation }) => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [usernameCap, setUsernameCap] = React.useState("");
  const [passwordCap, setPasswordCap] = React.useState("");
  const [confirmPasswordCap, setConfirmPasswordCap] = React.useState("");
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [usernameStatus, setUsernameStatus] = React.useState("basic");
  const [passwordStatus, setPasswordStatus] = React.useState("basic");
  const [modalMessage, setModalMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [confirmPasswordStatus, setConfirmPasswordStatus] = React.useState(
    "basic"
  );
  const [modalState, setModalState] = React.useState(false);
  const [selectedAgeIndex, setSelectedAgeIndex] = React.useState(
    new IndexPath(0)
  );
  const [selectedGenderIndex, setSelectedGenderIndex] = React.useState(
    new IndexPath(0)
  );
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [termStat, setTermStat] = React.useState("basic");

  const styles = useStyleSheet(themedStyles);

  //setting up the language
  const langContext = React.useContext(LangContext);
  const lang = langContext.lang;
  strings.setLanguage(lang);

  const onSignUpButtonPress = () => {
    if (username === "") {
      setModalMessage(strings.PleaseEnterYourUsername);
      setModalState(true);
      setUsernameStatus("danger");
      return;
    }

    if (password === "") {
      setModalMessage(strings.PleaseEnterYourPassword);
      setModalState(true);
      setPasswordStatus("danger");
      return;
    }

    if (confirmPassword !== password) {
      setModalMessage(strings.PasswordDoesNotMatch);
      setModalState(true);
      setConfirmPasswordStatus("danger");
      return;
    }

    if (!termsAccepted) {
      setTermStat("danger");
      return;
    }

    setIsLoading(true);
    signUpRequest();
  };

  const signUpRequest = async () => {
    console.log(
      username +
        "," +
        password +
        "," +
        displayAgeValue +
        "," +
        displayGenderValue
    );
    const response = await fetch(
      "https://sym-track.herokuapp.com/api/auth/register",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          gender: genderData[selectedGenderIndex],
          age_group: data[selectedAgeIndex],
        }),
      }
    );

    if (response.status === 404) {
      setModalMessage("");
      setModalState(true);
      setIsLoading(false);
      return;
    }

    if (response.status === 500) {
      setModalMessage(strings.UsernameAlreadyExists);
      setModalState(true);
      setIsLoading(false);
      return;
    }

    if (response.status === 200) {
      login();
    }
  };

  const saveUser = async (userID, userName, token, age_group, gender) => {
    try {
      await AsyncStorage.setItem("userID", userID); //save user id on async storage
      await AsyncStorage.setItem("userName", userName); //save user name on async storage
      await AsyncStorage.setItem("token", token); //save token on async storage
      await AsyncStorage.setItem("age_group", age_group); //save age group on async storage
      await AsyncStorage.setItem("gender", gender); //save gender on async storage
      await AsyncStorage.setItem("theme", "light");
    } catch (error) {
      // console.log(error);
    }
  };

  const login = async () => {
    const response = await fetch(
      "https://sym-track.herokuapp.com/api/auth/login",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      }
    );

    const json = await response.json();
    userIDStore.dispatch(
      actions.addUser(
        json.user._id,
        json.user.username,
        json.token,
        json.user.age_group,
        json.user.gender
      )
    );
    saveUser(
      json.user._id,
      json.user.username,
      json.token,
      json.user.age_group,
      json.user.gender
    ); //storing the user id in async storage
    setIsLoading(false);
  };

  const onSignInButtonPress = () => {
    navigation && navigation.navigate("LoginScreen");
  };

  const displayAgeValue = data[selectedAgeIndex.row];
  const renderOption = (title, index) => (
    <SelectItem title={title} key={index} />
  );

  const displayGenderValue = genderData[selectedGenderIndex.row];
  const renderGenderOption = (title, index) => (
    <SelectItem title={title} key={index} />
  );

  const renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={onPasswordIconPress}>
      <Icon {...props} name={passwordVisible ? "eye-off" : "eye"} />
    </TouchableWithoutFeedback>
  );

  const onPasswordIconPress = () => {
    setPasswordVisible(!passwordVisible);
  };

  const onUserNameChange = (name) => {
    if (name !== "") {
      setUsernameStatus("basic");
      setUsernameCap("");
    } else {
      setUsernameStatus("danger");
      setUsernameCap(strings.Required);
    }
    setUsername(name);
  };

  const onPasswordChange = (pass) => {
    if (pass !== "") {
      setPasswordStatus("basic");
      setPasswordCap("");
    } else {
      setPasswordStatus("danger");
      setPasswordCap(strings.Required);
    }
    setPassword(pass);
  };

  const onConfirmPasswordChange = (pass) => {
    if (pass === password) {
      setConfirmPasswordStatus("basic");
      setConfirmPasswordCap("");
    } else {
      setConfirmPasswordStatus("danger");
      setConfirmPasswordCap(strings.PasswordDoNotMatch);
    }
    setConfirmPassword(pass);
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Modal
        visible={modalState}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setModalState(false)}
      >
        <Card disabled={true}>
          <Text status="danger" category="h6" style={{ marginBottom: 10 }}>
            {modalMessage}
          </Text>
          <Divider />
          <Text
            style={{
              alignSelf: "flex-end",
              justifyContent: "center",
              marginTop: 5,
            }}
            status="primary"
            onPress={() => setModalState(false)}
          >
            {strings.Dismiss}
          </Text>
        </Card>
      </Modal>
      <ImageOverlay
        style={styles.headerContainer}
        source={require("../../../assets/images/signupBackground.png")}
      >
        <Button
          style={styles.evaButton}
          appearance="ghost"
          status="control"
          size="large"
        >
          {strings.TrackSYM}
        </Button>
        <View style={styles.signUpContainer}>
          <View style={styles.backContainer}>
            <Button
              style={styles.signInButton}
              appearance="ghost"
              status="control"
              size="giant"
              accessoryLeft={BackIcon}
              onPress={onSignInButtonPress}
            ></Button>
          </View>
          <Text style={styles.signInLabel} category="h4" status="control">
            {strings.SignUp}
          </Text>
        </View>
      </ImageOverlay>
      <View style={[styles.container, styles.formContainer]}>
        <Input
          placeholder={strings.Username}
          label={strings.Username}
          caption={usernameCap}
          status={usernameStatus}
          autoCapitalize="words"
          value={username}
          onChangeText={(name) => onUserNameChange(name)}
        />
        <Select
          style={styles.select}
          label={strings.AgeGroup}
          style={styles.formInput}
          placeholder="Default"
          value={displayAgeValue}
          selectedIndex={selectedAgeIndex}
          onSelect={(index) => setSelectedAgeIndex(index)}
        >
          {data.map((index, title) => renderOption(index, title))}
        </Select>
        <Select
          style={styles.select}
          label={strings.Gender}
          style={styles.formInput}
          placeholder="Default"
          value={displayGenderValue}
          selectedIndex={selectedGenderIndex}
          onSelect={(index) => setSelectedGenderIndex(index)}
        >
          {genderData.map((index, title) => renderGenderOption(index, title))}
        </Select>
        <Input
          style={styles.formInput}
          label={strings.Password}
          placeholder={strings.Password}
          caption={passwordCap}
          status={passwordStatus}
          secureTextEntry={!passwordVisible}
          value={password}
          accessoryRight={renderIcon}
          onChangeText={(pass) => onPasswordChange(pass)}
        />
        <Input
          style={styles.formInput}
          caption={confirmPasswordCap}
          placeholder={strings.ConfirmPassword}
          label={strings.ConfirmPassword}
          status={confirmPasswordStatus}
          value={confirmPassword}
          secureTextEntry={true}
          onChangeText={(pass) => onConfirmPasswordChange(pass)}
        />
        <CheckBox
          style={styles.termsCheckBox}
          textStyle={styles.termsCheckBoxText}
          checked={termsAccepted}
          status={termStat}
          onChange={(checked) => {
            setTermsAccepted(checked);
            setTermStat("basic");
          }}
        >
          <Text appearance="hint" category="c1" status={termStat}>
            {strings.AgreeingTermsAndServiceOnSignUp}
          </Text>
        </CheckBox>
      </View>
      <Button
        style={styles.signUpButton}
        size="large"
        disabled={isLoading}
        accessoryLeft={() => (isLoading ? <Spinner /> : <></>)}
        onPress={onSignUpButtonPress}
      >
        {strings.SignUp}
      </Button>
      <Button
        style={styles.termsButton}
        appearance="ghost"
        status="basic"
        onPress={() => {
          navigation.navigate("TermsAndPrivacyScreen");
        }}
      >
        {strings.TermsAndPrivacy}
      </Button>
      {/* <View style={styles.orContainer}>
        <Divider style={styles.divider} />
        <Text style={styles.orLabel} category='h5'>
          OR
        </Text>
        <Divider style={styles.divider} />
      </View>
      <View style={styles.socialAuthContainer}>
        <Text style={styles.socialAuthHintText}>
          Sign with a social account
        </Text>
        <View style={styles.socialAuthButtonsContainer}>
          <Button
            appearance='ghost'
            size='giant'
            status='primary'
            accessoryLeft={GoogleIcon}
          />
          <Button
            appearance='ghost'
            size='giant'
            status='primary'
            accessoryLeft={FacebookIcon}
          />
          <Button
            appearance='ghost'
            size='giant'
            status='primary'
            accessoryLeft={TwitterIcon}
          />
        </View> */}
      {/* </View> */}
    </KeyboardAvoidingView>
  );
};
