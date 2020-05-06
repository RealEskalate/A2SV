import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { AsyncStorage, View, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import MainPage from "./components/main-page/MainPage.js";
import SymptomPage from "./components/symptom-page/SymptomPage.js";
import UserSymptomPage from "./components/symptom-page/UserSymptomPage.js";
import MapService from "./components/map-service/MapService.js";
import Information from "./components/information-page/InformationPage.js";
import WhatIsCovid19 from "./components/information-page/WhatIsCovid19.js";
import Symptoms from "./components/information-page/Symptoms.js";
import Preventions from "./components/information-page/Preventions.js";
import Treatments from "./components/information-page/Treatments.js";
import News from "./components/news-page/News.js";
import NavigatorDrawer from "./components/navigation/NavigatorDrawer.js";
import GetStartedStackNavigation from "./components/navigation/GetStartedStackNavigation.js";
import userIDStore from "./components/data-management/user-id-data/userIDStore";
import * as actions from "./components/data-management/user-id-data/userIDActions";
import { Header } from "react-native-elements";
import NewsStack from "./components/news-page/NewsStack.js";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function App() {
  const [userId, setUserId] = useState("");
  const [isLoading, setLoading] = useState(true);

  //signify whenever there is a state change in redux
  userIDStore.subscribe(async () => {
    setUserId(userIDStore.getState().userId);
    await AsyncStorage.setItem("userID", userIDStore.getState().userId);
  });

  const checkLoggedIn = async () => {
    let userToken = null;
    try {
      userToken = await AsyncStorage.getItem("userID");
      userName = await AsyncStorage.getItem("userName");
      if (userToken != null) {
        userIDStore.dispatch(actions.addUser(userToken, userName)); //repopulate redux state
      }
    } catch (e) {
      alert(e);
    }
    setUserId(userToken);
    setLoading(false);
  };

  //check if the user has already logged in before
  useEffect(() => {
    checkLoggedIn();
  }, []);

  //progress indicator
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  //stack navigator for the main page
  createSTNavigator = ({ navigation }) => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: "#1976d2" },
          headerTintColor: "#fff",
          gestureEnabled: true,
          gestureDirection: "horizontal",
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        headerMode="float"
        animation="fade"
      >
        <Stack.Screen
          name="Main page"
          component={MainPage}
          options={{
            headerLeft: () => (
              <Icon.Button
                name="menu"
                size={25}
                style={{ marginLeft: 10 }}
                backgroundColor="#1976d2"
                color="#fff"
                onPress={() => {
                  navigation.openDrawer();
                }}
              />
            ),
          }}
        />

        <Stack.Screen name="What Is Covid-19?" component={WhatIsCovid19} />
        <Stack.Screen name="Covid19 Symptoms" component={Symptoms} />
        <Stack.Screen name="Preventions" component={Preventions} />
        <Stack.Screen name="Treatments" component={Treatments} />
        <Stack.Screen name="Symptoms" component={SymptomPage} />
      </Stack.Navigator>
    );
  };

  return (
    <NavigationContainer>
      {userId !== "" && userId !== null ? (
        <Drawer.Navigator
          drawerContent={(props) => <NavigatorDrawer {...props} />}
        >
          <Drawer.Screen name="Home" children={createSTNavigator} />
          <Drawer.Screen name="News" component={NewsStack} />
        </Drawer.Navigator>
      ) : (
        <GetStartedStackNavigation />
      )}
    </NavigationContainer>
  );
}
