import React from 'react';
import {
  Input,
  TopNavigation,
  TopNavigationAction,
  Icon,
  Spinner,
  Button,
  Divider,
  StyleService,
  Layout,
} from '@ui-kitten/components';
import {SafeAreaView, View, TouchableWithoutFeedback} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const ArrowIosBackIcon = (style) => <Icon {...style} name="arrow-ios-back" />;

const ChangePassScreen = (props) => {
  const [currPassword, setCurrPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [conNewPassword, setConNewPassword] = React.useState('');

  const [currPasswordVisible, setCurrPasswordVisible] = React.useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = React.useState(false);

  const [currPasswordStatus, setCurrPasswordStatus] = React.useState('');
  const [newPasswordStatus, setNewPasswordStatus] = React.useState('');
  const [conNewPasswordStatus, setConNewPasswordStatus] = React.useState('');

  const [currPasswordCap, setCurrPasswordCap] = React.useState('');
  const [newPasswordCap, setNewPasswordCap] = React.useState('');
  const [conNewPasswordCap, setConNewPasswordCap] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

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

  return (
    <SafeAreaView style={{flex: 1}}>
      <TopNavigation
        alignment="center"
        title="CHANGE PASSWORD"
        accessoryLeft={renderBackAction}
      />
      <Divider />
      <Layout style={{flex: 1}}>
        <KeyboardAwareScrollView>
          <View style={styles.formContainer}>
            <Input
              style={styles.formInput}
              label="CURRENT PASSWORD"
              placeholder="Password"
              caption={conNewPasswordCap}
              status={currPasswordStatus}
              secureTextEntry={!currPasswordVisible}
              value={currPassword}
              accessoryRight={renderPassIcon}
              onChangeText={(pass) => onCurrPasswordChange(pass)}
            />
            <Input
              style={styles.formInput}
              label="NEW PASSWORD"
              placeholder="Password"
              caption={newPasswordCap}
              status={newPasswordStatus}
              secureTextEntry={!newPasswordVisible}
              value={newPassword}
              accessoryRight={renderNewPassIcon}
              onChangeText={(pass) => onNewPasswordChange(pass)}
            />
            <Input
              style={styles.formInput}
              caption={conNewPasswordCap}
              placeholder="Confirm New Password"
              label="CONFIRM NEW PASSWORD"
              status={conNewPasswordStatus}
              value={conNewPassword}
              secureTextEntry={true}
              onChangeText={(pass) => onConNewPasswordChange(pass)}
            />
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

export default ChangePassScreen;

const styles = StyleService.create({
  formContainer: {
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  doneButton: {
    marginVertical: 24,
    marginHorizontal: 16,
  },
  divider: {
    flex: 1,
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
