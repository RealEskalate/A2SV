import React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { SettingScreen } from "./settings";
//import ProfileDetail from '../../../components/profile-page/ProfileDetail';
import { SafeAreaView } from "react-native";
import {
  TopNavigation,
  TopNavigationAction,
  Icon,
  Divider,
} from "@ui-kitten/components";
import ChangePassScreen from "./changePassword";
import EditProfileScreen from "./editProfile";

const { Navigator, Screen } = createStackNavigator();
const ArrowIosBackIcon = (style) => <Icon {...style} name="arrow-ios-back" />;

export const SettingNavigator = (props) => {
  // const ProfileScreen = (props) => {
  //   const renderBackAction = () => (
  //     <TopNavigationAction
  //       icon={ArrowIosBackIcon}
  //       onPress={props.navigation.goBack}
  //     />
  //   );

  //   return (
  //     <SafeAreaView style={{flex: 1}}>
  //       <TopNavigation
  //         title="Edit Profile"
  //         alignment="center"
  //         accessoryLeft={renderBackAction}
  //       />
  //       <Divider />
  //       <ProfileDetail />
  //     </SafeAreaView>
  //   );
  // };

  const [initRouteName, setInitRouteName] = React.useState("index");

  return (
    <Navigator
      headerMode="none"
      initialRouteName={initRouteName}
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: "horizontal",
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Screen name="index" component={SettingScreen} />
      {/* <Screen name="ProfileScreen" component={ProfileScreen} /> */}
      <Screen name="ChangePassScreen" component={ChangePassScreen} />
      <Screen name="EditProfileScreen" component={EditProfileScreen} />
    </Navigator>
  );
};
