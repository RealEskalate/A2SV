import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import LoginScreen from '../pages/sign-in';
import SignUpScreen from '../pages/sign-up';
import { ViewPagerSimpleUsageShowcase } from '../pages/welcome/ViewPagerSimpleUsageShowcase';
import { default as IntroductionPage } from '../pages/intro/';
import TermsAndPrivacyScreen from '../pages/settings/terms';

const { Navigator, Screen } = createStackNavigator();

export const AuthNavigator = (props) => {
  return (
    <Navigator
      headerMode='none'
      initialRouteName={props.init}
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Screen name='Welcome' component={IntroductionPage} />
      <Screen name='LoginScreen' component={LoginScreen} />
      <Screen name='SignUpScreen' component={SignUpScreen} />
      <Screen name='TermsAndPrivacyScreen' component={TermsAndPrivacyScreen} />
    </Navigator>
  );
};
