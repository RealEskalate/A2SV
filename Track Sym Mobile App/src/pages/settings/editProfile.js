import React from 'react';
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
} from '@ui-kitten/components';
import {SafeAreaView, View, TouchableWithoutFeedback} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ProfileAvatar} from './extra/profile-avatar.component';

const ArrowIosBackIcon = (style) => <Icon {...style} name="arrow-ios-back" />;
const data = [
  '0-10',
  '11-20',
  '21-30',
  '31-40',
  '41-50',
  '51-60',
  '61-70',
  '71-80',
  '81-90',
  '>90',
];

const genderData = ['MALE', 'FEMALE'];

const EditProfileScreen = (props) => {
  const [username, setUsername] = React.useState('');
  const [usernameCap, setUsernameCap] = React.useState('');
  const [usernameStatus, setUsernameStatus] = React.useState('basic');
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedAgeIndex, setSelectedAgeIndex] = React.useState(
    new IndexPath(0),
  );
  const [selectedGenderIndex, setSelectedGenderIndex] = React.useState(
    new IndexPath(0),
  );

  const displayAgeValue = data[selectedAgeIndex.row];
  const renderOption = (title, index) => (
    <SelectItem title={title} key={index} />
  );

  const displayGenderValue = genderData[selectedGenderIndex.row];
  const renderGenderOption = (title, index) => (
    <SelectItem title={title} key={index} />
  );

  const onUserNameChange = (name) => {
    if (name !== '') {
      setUsernameStatus('basic');
      setUsernameCap('');
    } else {
      setUsernameStatus('danger');
      setUsernameCap('Username cannot be empty !');
    }
    setUsername(name);
  };

  const renderBackAction = () => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={props.navigation.goBack}
    />
  );

  const onCurrPasswordChange = (pass) => {
    if (pass === '') {
      setCurrPasswordStatus('danger');
      setCurrPasswordCap('Feild cannot be empty !');
    } else {
      setCurrPasswordStatus('basic');
      setCurrPasswordCap();
    }
    setCurrPassword(pass);
  };

  const onNewPasswordChange = (pass) => {
    if (pass === '') {
      setNewPasswordStatus('danger');
      setNewPasswordCap('Feild cannot be empty !');
    } else {
      setNewPasswordStatus('basic');
      setNewPasswordCap();
    }

    setNewPassword(pass);
  };

  const onConNewPasswordChange = (pass) => {
    if (pass !== newPassword) {
      setConNewPasswordStatus('danger');
      setConNewPasswordCap('Password donot match !');
    } else {
      setConNewPasswordStatus('basic');
      setConNewPasswordCap();
    }
    setConNewPassword(pass);
  };

  const renderPassIcon = (props) => (
    <TouchableWithoutFeedback
      onPress={() => setCurrPasswordVisible(!currPasswordVisible)}>
      <Icon {...props} name={currPasswordVisible ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  );

  const renderNewPassIcon = (props) => (
    <TouchableWithoutFeedback
      onPress={() => setNewPasswordVisible(!newPasswordVisible)}>
      <Icon {...props} name={newPasswordVisible ? 'eye-off' : 'eye'} />
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

  return (
    <SafeAreaView style={{flex: 1}}>
      <TopNavigation
        alignment="center"
        title="CHANGE PROFILE"
        accessoryLeft={renderBackAction}
      />
      <Divider />
      <Layout style={{flex: 1}}>
        <KeyboardAwareScrollView>
          <Layout level="2" style={{padding: 10}}>
            <ProfileAvatar
              style={styles.profileAvatar}
              source={require('../../../assets/man.png')}
              editButton={renderPhotoButton}
            />
          </Layout>
          <View style={styles.formContainer}>
            <Input
              placeholder="Ally"
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
              onSelect={(index) => setSelectedAgeIndex(index)}>
              {data.map((index, title) => renderOption(index, title))}
            </Select>
            <Select
              style={styles.select}
              label="GENDER"
              style={styles.formInput}
              placeholder="Default"
              value={displayGenderValue}
              selectedIndex={selectedGenderIndex}
              onSelect={(index) => setSelectedGenderIndex(index)}>
              {genderData.map((index, title) =>
                renderGenderOption(index, title),
              )}
            </Select>
          </View>
          <Button
            style={styles.doneButton}
            size="large"
            disabled={isLoading}
            accessoryLeft={() => (isLoading ? <Spinner /> : <></>)}
            onPress={() => {}}>
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
    alignSelf: 'center',
  },
  formInput: {
    marginTop: 16,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
