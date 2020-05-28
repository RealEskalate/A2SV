import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Layout,
  Toggle,
  TopNavigationAction,
  TopNavigation,
  Divider,
  Icon,
  List,
  ListItem,
  Modal,
  Spinner,
  Card,
} from '@ui-kitten/components';
import { ThemeContext } from '../../../assets/themes/theme-context';
import * as actions from '../../data-management/user-id-data/userIDActions';
import userIDStore from '../../data-management/user-id-data/userIDStore';

const ArrowIosBackIcon = (style) => <Icon {...style} name='arrow-ios-back' />;
const EditProfile = (style) => <Icon {...style} name='edit-2-outline' />;
const ChangePasswordIcon = (style) => <Icon {...style} name='unlock-outline' />;
const TermsIcon = (style) => <Icon {...style} name='book-open-outline' />;
const DarkModeIcon = (style) => <Icon {...style} name='moon-outline' />;
const LogoutIcon = (style) => <Icon {...style} name='log-out-outline' />;

export const SettingScreen = (props) => {
  const themeContext = React.useContext(ThemeContext);
  const [visible, setVisible] = React.useState(false);

  const renderBackAction = () => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={props.navigation.goBack}
    />
  );

  const stubAction = () => {};

  const termsAction = () => {
    props.navigation.navigate('TermsAndPrivacyScreen');
  };

  const changePassAction = () => {
    props.navigation.navigate('ChangePassScreen');
  };

  const editProfAction = () => {
    props.navigation.navigate('EditProfileScreen');
  };
  const darkModeAction = () => {
    saveTheme();
    themeContext.toggleTheme();
  };

  const saveTheme = async () => {
    await AsyncStorage.setItem(
      'theme',
      themeContext.theme === 'light' ? 'dark' : 'light'
    );
  };

  const logOutAction = async () => {
    setVisible(true);
    try {
      await AsyncStorage.removeItem('userID');
      await AsyncStorage.removeItem('userName');
      await AsyncStorage.removeItem('gender');
      await AsyncStorage.removeItem('age_group');
    } catch (error) {}
    userIDStore.dispatch(actions.removeUser()); //remove user id from redux state
    props.navigation.navigate('HOME');
  };

  const data = [
    'Edit Profile',
    'Change Password',
    'Terms & Privacy',
    'Dark Mode',
    'Log Out',
  ];

  const icons = [
    EditProfile,
    ChangePasswordIcon,
    TermsIcon,
    DarkModeIcon,
    LogoutIcon,
  ];

  const settingActions = [
    editProfAction,
    changePassAction,
    termsAction,
    stubAction,
    logOutAction,
  ];

  const ListSimpleUsageShowcase = () => {
    return (
      <List
        style={styles.container}
        data={data}
        renderItem={({ item, index }) => (
          <Layout>
            <ListItem
              style={styles.setting}
              onPress={settingActions[index]}
              accessoryLeft={icons[index]}
              accessoryRight={() =>
                index === 3 ? (
                  <Toggle
                    checked={themeContext.theme == 'dark'}
                    onChange={darkModeAction}
                  />
                ) : (
                  <></>
                )
              }
              title={`${item}`}
            />
            <Divider />
          </Layout>
        )}
      />
    );
  };

  return (
    <>
      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}>
        <Card disabled={true}>
          <Spinner {...props} size='large' />
        </Card>
      </Modal>
      <SafeAreaView style={styles.container}>
        <TopNavigation
          alignment='center'
          title='Settings'
          accessoryLeft={renderBackAction}
        />
        <Divider />
        <Layout style={styles.container}>{ListSimpleUsageShowcase()}</Layout>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  setting: {
    padding: 16,
  },
  section: {
    paddingTop: 32,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
