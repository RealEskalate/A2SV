import React from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import {
  Button,
  Input,
  Layout,
  Text,
  useStyleSheet,
  Icon,
  Modal,
  Card,
  Spinner,
  Divider,
} from "@ui-kitten/components";
import { ImageOverlay } from "../../components/ImageOverlay/image-overlay.component";
import userIDStore from "../../data-management/user-id-data/userIDStore";
import * as actions from "../../data-management/user-id-data/userIDActions";
import AsyncStorage from "@react-native-community/async-storage";
import themedStyles from "./extra/themedStyles";
import { KeyboardAvoidingView } from "../../components/3rd-party";
import { strings } from "../../localization/localization";

const PersonIcon = (style) => <Icon {...style} name="person" />;

export default ({ navigation }) => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [usernameCap, setUsernameCap] = React.useState("");
  const [passwordCap, setPasswordCap] = React.useState("");
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [usernameStatus, setUsernameStatus] = React.useState("basic");
  const [passwordStatus, setPasswordStatus] = React.useState("basic");
  const [modalState, setModalState] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const styles = useStyleSheet(themedStyles);

  const onSignUpButtonPress = () => {
    navigation && navigation.navigate("SignUpScreen");
  };

  const onPasswordIconPress = () => {
    setPasswordVisible(!passwordVisible);
  };

  const renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={onPasswordIconPress}>
      <Icon {...props} name={passwordVisible ? "eye-off" : "eye"} />
    </TouchableWithoutFeedback>
  );

  const LoadingIndicator = (props) => {
    return (
      <View style={[props.style, styles.indicator]}>
        <Spinner size="small" />
      </View>
    );
  };

  const onUserNameChange = (name) => {
    if (name !== "") {
      setUsernameStatus("basic");
      setUsernameCap("");
    } else {
      setUsernameStatus("danger");
      setUsernameCap("User name is required");
    }
    setUsername(name);
  };

  const onPasswordChange = (pass) => {
    if (pass !== "") {
      setPasswordStatus("basic");
      setPasswordCap("");
    } else {
      setPasswordStatus("danger");
      setPasswordCap("Please enter your password!");
    }
    setPassword(pass);
  };

  const onSubmitForm = () => {
    if (username === "") {
      setUsernameStatus("danger");
      setModalMessage("Please enter your user name!");
      setModalState(true);
      return;
    }

    if (password === "") {
      setPasswordStatus("danger");
      setModalMessage("Password cannot be empty!");
      setModalState(true);
      return;
    }

    setIsLoading(true);
    login();
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

  //Log in authentication
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

    console.log(response);
    if (!response) {
      setModalMessage("Check your internet connection and try again!");
      setModalState(true);
      setIsLoading(false);
      return;
    }

    if (response.status === 404) {
      setModalMessage(
        "You have entered wrong username or password,\nPlease try again!"
      );
      setModalState(true);
      setIsLoading(false);
    }

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
            Dismiss
          </Text>
        </Card>
      </Modal>

      <ImageOverlay
        style={styles.headerContainer}
        source={require("../../../assets/images/signinBackground.png")}
      >
        <Text
          style={{ alignSelf: "flex-start", marginLeft: 20 }}
          category="h1"
          status="control"
        >
          {strings.Welcome}
        </Text>
        <Text
          style={{ alignSelf: "flex-start", marginLeft: 20 }}
          category="s1"
          status="control"
        >
          Sign in to your account
        </Text>
      </ImageOverlay>

      <Layout style={styles.formContainer} level="1">
        <Input
          placeholder={strings.Username}
          status={usernameStatus}
          accessoryRight={PersonIcon}
          value={username}
          caption={usernameCap}
          onChangeText={onUserNameChange}
        />
        <Input
          style={styles.passwordInput}
          status={passwordStatus}
          placeholder={strings.Password}
          caption={passwordCap}
          accessoryRight={renderIcon}
          value={password}
          secureTextEntry={!passwordVisible}
          onChangeText={onPasswordChange}
          onIconPress={onPasswordIconPress}
        />
      </Layout>
      <Button
        style={styles.signInButton}
        size="large"
        disabled={isLoading}
        accessoryLeft={() => (isLoading ? <LoadingIndicator /> : <></>)}
        onPress={() => onSubmitForm()}
      >
        {strings.SignIn}
      </Button>
      <Button
        style={styles.signUpButton}
        appearance="ghost"
        status="basic"
        onPress={onSignUpButtonPress}
      >
        Don't have an account? Sign up
      </Button>
    </KeyboardAvoidingView>
  );
};
