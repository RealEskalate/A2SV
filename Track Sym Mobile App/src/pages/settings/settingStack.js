import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { SettingScreen } from './settings';
import ChangePassScreen from './changePassword';
import EditProfileScreen from './editProfile';
import TermsAndPrivacyScreen from './terms';

const { Navigator, Screen } = createStackNavigator();

export const SettingNavigator = (props) => {
  const [initRouteName, setInitRouteName] = React.useState('index');

  return (
    <Navigator
      headerMode='none'
      initialRouteName={initRouteName}
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Screen name='index' component={SettingScreen} />
      <Screen name='ChangePassScreen' component={ChangePassScreen} />
      <Screen name='EditProfileScreen' component={EditProfileScreen} />
      <Screen name='TermsAndPrivacyScreen' component={TermsAndPrivacyScreen} />
    </Navigator>
  );
};
