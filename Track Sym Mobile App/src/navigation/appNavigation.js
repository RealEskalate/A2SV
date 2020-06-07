import React, { useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  Drawer,
  DrawerItem,
  Layout,
  Text,
  IndexPath,
  Avatar,
  Icon,
  Divider,
  StyleService,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import { StyleSheet, SafeAreaView } from 'react-native';
import { HomeStackNavigator } from './homeNavigation';
import { SettingNavigator } from '../pages/settings/settingStack';
import userIDStore from '../data-management/user-id-data/userIDStore';
import { NewsNavigator } from '../pages/news/newsStack';
import AboutPage from '../pages/about-page/About';
import { strings } from '../localization/localization';
import { LangContext } from '../../assets/lang/language-context';
import Ethiopia from '../pages/ethiopia-page/ethiopia';
import AsyncStorage from '@react-native-community/async-storage';
const { Navigator, Screen } = createDrawerNavigator();

const HomeIcon = (props) => <Icon {...props} name='home-outline' />;
const NewsIcon = (props) => <Icon {...props} name='browser-outline' />;
const InfoIcon = (props) => <Icon {...props} name='info-outline' />;
const FlagIcon = (props) => <Icon {...props} name='flag-outline' />;
const SettingIcon = (props) => <Icon {...props} name='settings-2-outline' />;
const ArrowIosBackIcon = (style) => <Icon {...style} name='arrow-ios-back' />;
const reloadIcon = (style) => <Icon {...style} name='refresh-outline' />;

export const AppNavigator = (props) => {
  //setting up the language
  const langContext = React.useContext(LangContext);
  const lang = langContext.lang;
  strings.setLanguage(lang);

  const avatars = [
    require('../../assets/images/avatars/person0-10.png'),
    require('../../assets/images/avatars/person11-29.png'),
    require('../../assets/images/avatars/person30-60.png'),
    require('../../assets/images/avatars/personold.png'),
    require('../../assets/images/avatars/w_person0-10.png'),
    require('../../assets/images/avatars/w_person11-29.png'),
    require('../../assets/images/avatars/w_person30-60.png'),
    require('../../assets/images/avatars/w_personold.png'),
  ];

  const getMyAvavtarIdx = () => {
    const userAgeGroup = props.age;
    const userGender = props.gen;

    if (userGender === 'MALE') {
      if (userAgeGroup === '0-10') {
        return 0;
      } else if (userAgeGroup === '11-20' || userAgeGroup === '21-30') {
        return 1;
      } else if (
        userAgeGroup === '31-40' ||
        userAgeGroup === '41-50' ||
        userAgeGroup === '51-60'
      ) {
        return 2;
      } else {
        return 3;
      }
    } else {
      if (userAgeGroup === '0-10') {
        return 4;
      } else if (userAgeGroup === '11-20' || userAgeGroup === '21-30') {
        return 5;
      } else if (
        userAgeGroup === '31-40' ||
        userAgeGroup === '41-50' ||
        userAgeGroup === '51-60'
      ) {
        return 6;
      } else {
        return 7;
      }
    }
  };

  const AvatarSizeShowcase = () => {
    const src = avatars[getMyAvavtarIdx()];
    return (
      <Layout style={styles.container} level='1'>
        <Avatar style={styles.avatar} size='giant' source={src} />
      </Layout>
    );
  };

  const Header = (props) => (
    <React.Fragment>
      <Layout level='3' style={[props.style, styles.header]}>
        <AvatarSizeShowcase />
        <Text> {userIDStore.getState().userName}</Text>
      </Layout>
      <Divider />
    </React.Fragment>
  );

  const Footer = (props) => (
    <React.Fragment>
      <Divider />
      <Layout level='2' style={{ padding: 10 }}>
        <Text appearance='hint'>
          ©Track Sym - V 0.1 {new Date().getFullYear()}
        </Text>
      </Layout>
    </React.Fragment>
  );

  const DrawerContent = ({ navigation, state }) => (
    <Drawer
      header={Header}
      footer={Footer}
      selectedIndex={new IndexPath(state.index)}
      onSelect={(index) => navigation.navigate(state.routeNames[index.row])}>
      <DrawerItem title={strings.Home} accessoryLeft={HomeIcon} />
      <DrawerItem title={strings.News} accessoryLeft={NewsIcon} />
      <DrawerItem title={strings.Ethiopia} accessoryLeft={FlagIcon} />
      <DrawerItem title={strings.About} accessoryLeft={InfoIcon} />
      <DrawerItem title={strings.Settings} accessoryLeft={SettingIcon} />
    </Drawer>
  );

  const GoToAboutPage = (props) => {
    const renderBackAction = () => (
      <TopNavigationAction
        icon={ArrowIosBackIcon}
        onPress={props.navigation.goBack}
      />
    );

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation
          title={strings.AboutUs}
          alignment='center'
          accessoryLeft={renderBackAction}
        />
        <Divider />
        <AboutPage />
      </SafeAreaView>
    );
  };

  const GoToEthiopia = (props) => {
    const renderBackAction = () => (
      <TopNavigationAction
        icon={ArrowIosBackIcon}
        onPress={props.navigation.goBack}
      />
    );

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation
          title={strings.Ethiopia}
          alignment='center'
          accessoryLeft={renderBackAction}
        />
        <Divider />
        <Ethiopia />
      </SafeAreaView>
    );
  };

  return (
    <Navigator
      initialRouteName='HOME'
      backBehavior='initialRoute'
      drawerContent={(props) => <DrawerContent {...props} />}>
      <Screen name='HOME' component={HomeStackNavigator} />
      <Screen name='NEWS' component={NewsNavigator} />
      <Screen name='ETHIOPIA' component={GoToEthiopia} />
      <Screen name='ABOUT' component={GoToAboutPage} />
      <Screen name='SETTINGS' component={SettingNavigator} />
    </Navigator>
  );
};

const styles = StyleService.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginRight: 8,
    borderRadius: 30,
    backgroundColor: '#5DC2FA',
  },
  avatar: {
    margin: 0,
  },
  header: {
    height: 128,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
