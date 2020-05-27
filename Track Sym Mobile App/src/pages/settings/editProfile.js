import React from "react";
import {
  Button,
  Divider,
  Icon,
  Input,
  StyleService,
  Select,
  SelectItem,
  IndexPath,
  Spinner,
  TopNavigation,
  TopNavigationAction,
  Layout,
  Modal,
  Card,
  Text,
} from "@ui-kitten/components";
import {
  SafeAreaView,
  View,
  TouchableWithoutFeedback,
  AsyncStorage,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ProfileAvatar } from "./extra/profile-avatar.component";
import userIDStore from "../../data-management/user-id-data/userIDStore";
import * as actions from "../../data-management/user-id-data/userIDActions";

const ArrowIosBackIcon = (style) => <Icon {...style} name="arrow-ios-back" />;
const data = [
  "Update your age group",
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

const genderData = ["Update your gender", "MALE", "FEMALE"];

const EditProfileScreen = (props) => {
  const [username, setUsername] = React.useState("");
  const [usernameCap, setUsernameCap] = React.useState("");
  const [usernameStatus, setUsernameStatus] = React.useState("basic");
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedAgeIndex, setSelectedAgeIndex] = React.useState(
    new IndexPath(0)
  );
  const [selectedGenderIndex, setSelectedGenderIndex] = React.useState(
    new IndexPath(0)
  );

  const displayAgeValue = data[selectedAgeIndex.row];
  const [modalState, setModalState] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState("");
  const [modalStatus, setModalStatus] = React.useState("");

  const renderOption = (title, index) => (
    <SelectItem title={title} key={index} />
  );

  const displayGenderValue = genderData[selectedGenderIndex.row];
  const renderGenderOption = (title, index) => (
    <SelectItem title={title} key={index} />
  );

  const onUserNameChange = (name) => {
    if (name !== "") {
      setUsernameStatus("basic");
      setUsernameCap("");
    } else {
      setUsernameStatus("danger");
      setUsernameCap("required*");
    }
    setUsername(name);
  };

  const renderBackAction = () => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={props.navigation.goBack}
    />
  );

  const onGenderChange = (pass) => {
    if (pass === 0) {
      setModalMessage("Please select your gender");
      setModalState(true);
      setModalStatus("danger");
      return;
    }
    setSelectedGenderIndex(pass);
  };

  const onAgeGroupChange = (pass) => {
    if (pass === 0) {
      setModalMessage("Please enter your age group");
      setModalState(true);
      setModalStatus("danger");
      return;
    }

    setSelectedAgeIndex(pass);
  };

  const renderPassIcon = (props) => (
    <TouchableWithoutFeedback
      onPress={() => setCurrPasswordVisible(!currPasswordVisible)}
    >
      <Icon {...props} name={currPasswordVisible ? "eye-off" : "eye"} />
    </TouchableWithoutFeedback>
  );

  const renderNewPassIcon = (props) => (
    <TouchableWithoutFeedback
      onPress={() => setNewPasswordVisible(!newPasswordVisible)}
    >
      <Icon {...props} name={newPasswordVisible ? "eye-off" : "eye"} />
    </TouchableWithoutFeedback>
  );

  const CameraIcon = (style) => <Icon {...style} name="camera" />;

  const renderPhotoButton = () => (
    <Button
      style={styles.editAvatarButton}
      status="basic"
      accessoryLeft={CameraIcon}
    />
  );
  //change profile
  const updateProfile = () => {
    onUserNameChange(username);
    onAgeGroupChange(selectedAgeIndex);
    onGenderChange(selectedGenderIndex);
    if (selectedAgeIndex > 0 && selectedGenderIndex > 0 && username !== "") {
      setIsLoading(true);
      fetch("https://sym-track.herokuapp.com/api/users", {
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + userIDStore.getState().userToken,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: userIDStore.getState().userId,
          username: username,
          age_group: data[selectedAgeIndex],
          gender: genderData[selectedGenderIndex],
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          setModalMessage("You have successfully changed your profile!");
          setModalState(true);
          setIsLoading(false);
          setModalStatus("success");
          saveUser(
            username,
            data[selectedAgeIndex],
            genderData[selectedGenderIndex]
          );
          userIDStore.dispatch(
            actions.addUser(
              userIDStore.getState().userId,
              username,
              userIDStore.getState().userToken,
              data[selectedAgeIndex],
              genderData[selectedGenderIndex]
            )
          );
        })
        .catch((error) => {
          console.log(error);
          setModalMessage("Oops, couldn't update your profile! Please retry!");
          setModalState(true);
          setModalStatus("danger");
        });
    }
  };
  const saveUser = async (userName, age_group, gender) => {
    try {
      await AsyncStorage.setItem("userName", userName); //save user name on async storage
      await AsyncStorage.setItem("age_group", age_group); //save age group on async storage
      await AsyncStorage.setItem("gender", gender); //save gender on async storage
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Modal
        visible={modalState}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setModalState(false)}
      >
        <Card disabled={true} style={{ marginLeft: 10, marginRight: 10 }}>
          <Text status={modalStatus} category="h6" style={{ marginBottom: 10 }}>
            {modalMessage}
          </Text>
          <Text
            style={{ alignSelf: "flex-end", color: "#0080ff" }}
            onPress={() => {
              setModalState(false);
              setUsername("");
              setSelectedAgeIndex("");
              setSelectedGenderIndex("");
              setIsLoading(false);
            }}
          >
            Dismiss
          </Text>
        </Card>
      </Modal>
      <TopNavigation
        alignment="center"
        title="CHANGE PROFILE"
        accessoryLeft={renderBackAction}
      />
      <Divider />
      <Layout style={{ flex: 1 }}>
        <KeyboardAwareScrollView>
          <Layout level="2" style={{ padding: 10 }}>
            <ProfileAvatar
              style={styles.profileAvatar}
              source={require("../../../assets/man.png")}
              editButton={renderPhotoButton}
            />
          </Layout>
          <View style={styles.formContainer}>
            <Input
              placeholder={userIDStore.getState().userName}
              label="Username"
              caption={usernameCap}
              status={usernameStatus}
              autoCapitalize="words"
              value={username}
              onChangeText={(name) => onUserNameChange(name)}
            />
            <Select
              style={styles.select}
              label="AGE GROUP"
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
              label="GENDER"
              style={styles.formInput}
              placeholder="Default"
              value={displayGenderValue}
              selectedIndex={selectedGenderIndex}
              onSelect={(index) => setSelectedGenderIndex(index)}
            >
              {genderData.map((index, title) =>
                renderGenderOption(index, title)
              )}
            </Select>
          </View>
          <Button
            style={styles.doneButton}
            size="large"
            disabled={isLoading}
            accessoryLeft={() => (isLoading ? <Spinner /> : <></>)}
            onPress={() => updateProfile()}
          >
            DONE
          </Button>
        </KeyboardAwareScrollView>
      </Layout>
    </SafeAreaView>
  );
};

export default EditProfileScreen;

const styles = StyleService.create({
  formContainer: {
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  editAvatarButton: {
    aspectRatio: 1.0,
    height: 48,
    borderRadius: 24,
  },
  doneButton: {
    marginVertical: 24,
    marginHorizontal: 16,
  },
  divider: {
    flex: 1,
  },
  profileAvatar: {
    aspectRatio: 1.0,
    height: 124,
    alignSelf: "center",
  },
  formInput: {
    marginTop: 16,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  indicator: {
    justifyContent: "center",
    alignItems: "center",
  },
});
