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
  Avatar,
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { default as customTheme } from './assets/themes/custom-theme.json'; // <-- Import app theme
import { ThemeContext } from './assets/themes/theme-context';
import { AuthNavigator } from './src/navigation/authNavigation';
import { AppNavigator } from './src/navigation/appNavigation.js';
import { default as mapping } from './assets/fonts/mapping.json'; // <-- Import app mapping

function App() {
  const [userId, setUserId] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [theme, setTheme] = React.useState('light');

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
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Avatar
          size='giant'
          source={require('./assets/images/app_icon.png')}
          style={{ marginBottom: 50 }}
        />
        <Spinner size='large' color='#1976d2' />
      </Layout>
    );
  }

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <ApplicationProvider
          {...eva}
          theme={{ ...eva[theme], ...customTheme }}
          customMapping={mapping}>
          <NavigationContainer theme={navigatorTheme}>
            {userId !== '' && userId !== null ? (
              <AppNavigator /> // if user has already signed in go to main page
            ) : (
              <AuthNavigator /> //else go to sign in
            )}
          </NavigationContainer>
        </ApplicationProvider>
      </ThemeContext.Provider>
    </>
  );
}
export default () => (
  <ApplicationProvider {...eva} theme={eva.light}>
    <App />
  </ApplicationProvider>
);
