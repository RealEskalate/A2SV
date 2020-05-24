import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  Drawer,
  DrawerItem,
  Layout,
  Text,
  IndexPath,
  Avatar,
  Icon,
  Divider,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import { StyleSheet, SafeAreaView } from "react-native";
import { HomeStackNavigator } from "./homeNavigation";
import { SettingNavigator } from "../pages/settings/settingStack";
import userIDStore from "../data-management/user-id-data/userIDStore";
import NewsNavigator from "../pages/news/news";
import AboutPage from "../pages/about-page/About";

const { Navigator, Screen } = createDrawerNavigator();

const HomeIcon = (props) => <Icon {...props} name="home-outline" />;
const NewsIcon = (props) => <Icon {...props} name="browser-outline" />;
const InfoIcon = (props) => <Icon {...props} name="info-outline" />;
const FlagIcon = (props) => <Icon {...props} name="flag-outline" />;
const SettingIcon = (props) => <Icon {...props} name="settings-2-outline" />;
const ArrowIosBackIcon = (style) => <Icon {...style} name="arrow-ios-back" />;

export const AvatarSizeShowcase = () => (
  <Layout style={styles.container} level="1">
    <Avatar
      style={styles.avatar}
      size="giant"
      source={require("../../assets/man.png")}
    />
  </Layout>
);

const Header = (props) => (
  <React.Fragment>
    <Layout style={[props.style, styles.header]}>
      <AvatarSizeShowcase />
      <Text> {userIDStore.getState().userName}</Text>
    </Layout>
    <Divider />
  </React.Fragment>
);

const Footer = (props) => (
  <React.Fragment>
    <Divider />
    <Layout level="2" style={{ padding: 10 }}>
      <Text appearance="hint">©2020 Track Sym - V 0.1</Text>
    </Layout>
  </React.Fragment>
);

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
        title="Ethiopia"
        alignment="center"
        accessoryLeft={renderBackAction}
      />
      <Divider />
      <Layout
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text category="h1">Coming Soon!!</Text>
      </Layout>
    </SafeAreaView>
  );
};

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
        title="About us"
        alignment="center"
        accessoryLeft={renderBackAction}
      />
      <Divider />
      <AboutPage />
    </SafeAreaView>
  );
};

const DrawerContent = ({ navigation, state }) => (
  <Drawer
    header={Header}
    footer={Footer}
    selectedIndex={new IndexPath(state.index)}
    onSelect={(index) => navigation.navigate(state.routeNames[index.row])}
  >
    <DrawerItem title="HOME" accessoryLeft={HomeIcon} />
    <DrawerItem title="NEWS" accessoryLeft={NewsIcon} />
    <DrawerItem title="ETHIOPIA" accessoryLeft={FlagIcon} />
    <DrawerItem title="ABOUT" accessoryLeft={InfoIcon} />
    <DrawerItem title="SETTINGS" accessoryLeft={SettingIcon} />
  </Drawer>
);

export const AppNavigator = () => (
  <Navigator drawerContent={(props) => <DrawerContent {...props} />}>
    <Screen name="HOME" component={HomeStackNavigator} />
    <Screen name="NEWS" component={NewsNavigator} />
    <Screen name="ETHIOPIA" component={GoToEthiopia} />
    <Screen name="ABOUT" component={GoToAboutPage} />
    <Screen name="SETTINGS" component={SettingNavigator} />
  </Navigator>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginRight: 8,
  },
  avatar: {
    margin: 0,
  },
  header: {
    height: 128,
    flexDirection: "row",
    alignItems: "center",
  },
});
