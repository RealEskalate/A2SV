import React, {useState, useEffect} from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {AsyncStorage, View, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import MainPage from './components/main-page/MainPage.js';
import SymptomPage from './components/symptom-page/SymptomPage.js';
import WhatIsCovid19 from './components/information-page/WhatIsCovid19.js';
import Symptoms from './components/information-page/Symptoms.js';
import Preventions from './components/information-page/Preventions.js';
import Treatments from './components/information-page/Treatments.js';
import Message from './components/information-page/Message.js';
import Spreads from './components/information-page/Spreads.js';
import News from './components/news-page/News.js';
import NavigatorDrawer from './components/navigation/NavigatorDrawer.js';
import GetStartedStackNavigation from './components/navigation/GetStartedStackNavigation.js';
import userIDStore from './components/data-management/user-id-data/userIDStore';
import * as actions from './components/data-management/user-id-data/userIDActions';
import DataAnalyticsMap from './components/public-data-page/DataAnalyticsMap.js';
import About from './components/about-page/About.js';
import Profile from './components/profile-page/Profile.js';
import ProfileDetail from './components/profile-page/ProfileDetail.js';

import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {default as customTheme} from './assets/themes/custom-theme.json'; // <-- Import app theme
import {ThemeContext} from './assets/themes/theme-context';
import {AuthNavigator} from './src/navigation/authNavigation';
import {AppNavigator} from './src/navigation/appNavigation.js';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function App() {
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
      userName = await AsyncStorage.getItem('userName');
      userToken = await AsyncStorage.getItem('token');
      userGender = await AsyncStorage.getItem('gender');
      userAgeGroup = await AsyncStorage.getItem('age_group');
      if (userID != null) {
        userIDStore.dispatch(
          actions.addUser(
            userID,
            userName,
            userToken,
            userAgeGroup,
            userGender,
          ),
        ); //repopulate redux state
      }
    } catch (e) {
      alert(e);
    }
    setUserId(userID);
    setLoading(false);
  };

  //check if the user has already logged in before
  useEffect(() => {
    checkLoggedIn();
  }, []);

  //progress indicator
  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  //stack navigator for the main page
  createSTNavigator = ({navigation}) => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: {backgroundColor: '#1976d2'},
          headerTintColor: '#fff',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        headerMode="float"
        animation="fade">
        <Stack.Screen
          name="Main page"
          component={MainPage}
          options={{
            headerLeft: () => (
              <Icon.Button
                name="menu"
                size={25}
                style={{marginLeft: 10}}
                backgroundColor="#1976d2"
                color="#fff"
                onPress={() => {
                  navigation.openDrawer();
                }}
              />
            ),
          }}
        />

        <Stack.Screen
          name="What Is Covid-19?"
          component={WhatIsCovid19}
          options={{headerTransparent: true, headerTitle: ''}}
        />
        <Stack.Screen
          name="Covid19 Symptoms"
          component={Symptoms}
          options={{headerTransparent: true, headerTitle: ''}}
        />
        <Stack.Screen
          name="Preventions"
          component={Preventions}
          options={{headerTransparent: true, headerTitle: ''}}
        />
        <Stack.Screen
          name="Treatments"
          component={Treatments}
          options={{headerTransparent: true, headerTitle: ''}}
        />
        <Stack.Screen
          name="Spreads"
          component={Spreads}
          options={{headerTransparent: true, headerTitle: ''}}
        />
        <Stack.Screen
          name="Message"
          component={Message}
          options={{headerTransparent: true, headerTitle: ''}}
        />
        <Stack.Screen name="Symptoms" component={SymptomPage} />
        <Stack.Screen name="Data Analytics Map" component={DataAnalyticsMap} />

        <Stack.Screen name="News" component={News} />
      </Stack.Navigator>
    );
  };

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ThemeContext.Provider value={{theme, toggleTheme}}>
        <ApplicationProvider {...eva} theme={{...eva[theme], ...customTheme}}>
          <NavigationContainer theme={navigatorTheme}>
            {userId !== '' && userId !== null ? (
              // <Drawer.Navigator
              //   drawerContent={(props) => <NavigatorDrawer {...props} />}>
              //   <Drawer.Screen name="Home" children={createSTNavigator} />
              //   <Drawer.Screen name="About" component={About} />
              //   <Drawer.Screen name="Profile" component={Profile} />
              //   <Drawer.Screen name="ProfileDetail" component={ProfileDetail} />
              // </Drawer.Navigator>
              <AppNavigator />
            ) : (
              // <GetStartedStackNavigation />
              <AuthNavigator />
            )}
          </NavigationContainer>
        </ApplicationProvider>
      </ThemeContext.Provider>
    </>
  );
}
