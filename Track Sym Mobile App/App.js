import React, { useState, useEffect } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import userIDStore from './src/data-management/user-id-data/userIDStore';
import * as actions from './src/data-management/user-id-data/userIDActions';

import * as eva from '@eva-design/eva';
import {
  ApplicationProvider,
  IconRegistry,
  Spinner,
  Layout,
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { default as customTheme } from './assets/themes/custom-theme.json'; // <-- Import app theme
import { ThemeContext } from './assets/themes/theme-context';
import { LangContext } from './assets/lang/language-context';
import { AuthNavigator } from './src/navigation/authNavigation';
import { AppNavigator } from './src/navigation/appNavigation.js';
import { default as mapping } from './assets/fonts/mapping.json'; // <-- Import app mapping
import { Image } from 'react-native';

function App() {
  const [userId, setUserId] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [theme, setTheme] = React.useState('light');
  const [lang, setLang] = React.useState('en');
  const [init, setInit] = React.useState('Welcome');

  const navigatorTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      // prevent layout blinking when performing navigation
      background: 'transparent',
    },
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  const changeLang = (langCode) => {
    setLang(langCode);
  };

  //signify whenever there is a state change in redux
  userIDStore.subscribe(async () => {
    setUserId(userIDStore.getState().userId);
    await AsyncStorage.setItem('userID', userIDStore.getState().userId);
  });

  const checkLoggedIn = async () => {
    let userID = null;
    try {
      userID = await AsyncStorage.getItem('userID');
      let userName = await AsyncStorage.getItem('userName');
      let userToken = await AsyncStorage.getItem('token');
      let userGender = await AsyncStorage.getItem('gender');
      let userAgeGroup = await AsyncStorage.getItem('age_group');
      let themeVar = await AsyncStorage.getItem('theme');
      let langVar = await AsyncStorage.getItem('lang');
      let fisrtSession = await AsyncStorage.getItem('isFirstInterance');

      if (userID != null) {
        userIDStore.dispatch(
          actions.addUser(userID, userName, userToken, userAgeGroup, userGender)
        ); //repopulate redux state
      }

      if (themeVar != null) {
        setTheme(themeVar);
      } else {
        setTheme('light');
      }

      if (langVar != null) {
        setLang(langVar);
      } else {
        setLang('en');
      }

      if (fisrtSession) {
        setInit('LoginScreen');
      }
    } catch (e) {
      alert(e);
    }
    setUserId(userID);
    setLoading(false);
  };

  //check if the user has already signed in before
  useEffect(() => {
    checkLoggedIn();
  }, []);

  //progress indicator while checking if user has already sign in or not
  if (isLoading) {
    return (
      <Layout
        level='2'
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Layout
          level='3'
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,

            elevation: 2,
            marginBottom: 30,
          }}>
          <Image
            source={require('./assets/images/app_icon.png')}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
            }}
          />
        </Layout>
        <Spinner size='medium' status='info' />
      </Layout>
    );
  }

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <LangContext.Provider value={{ lang, changeLang }}>
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
          <ApplicationProvider
            {...eva}
            theme={{ ...eva[theme], ...customTheme }}
            customMapping={mapping}>
            <NavigationContainer theme={navigatorTheme}>
              {userId !== '' && userId !== null ? (
                <AppNavigator /> // if user has already signed in go to main page
              ) : (
                <AuthNavigator init={init} /> //else go to sign in
              )}
            </NavigationContainer>
          </ApplicationProvider>
        </ThemeContext.Provider>
      </LangContext.Provider>
    </>
  );
}
export default () => (
  <ApplicationProvider {...eva} theme={eva.light}>
    <App />
  </ApplicationProvider>
);
