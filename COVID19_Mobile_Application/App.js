import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SignIn from "./components/sign-in-page/SignIn.js";
import SignUp from "./components/sign-up-page/SignUp.js";
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
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NavigatorDrawer from "./components/navigation/NavigatorDrawer.js";
import GetStartedStackNavigation from "./components/navigation/GetStartedStackNavigation.js";
import userIDStore from "./components/data-management/user-id-data/userIDStore";
import * as actions from "./components/data-management/user-id-data/userIDActions";
import { AsyncStorage, View, ActivityIndicator } from "react-native";

import { createDrawerNavigator } from "@react-navigation/drawer";

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
  //check if the user has already logged in before
  useEffect(() => {
    setTimeout(async () => {
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
    }, 2000);
  }, []);
  //progress indicator
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userId !== "" && userId !== null ? (
        <Drawer.Navigator
          drawerContent={(props) => <NavigatorDrawer {...props} />}
        >
          <Drawer.Screen name="Home" children={createSTNavigator} />
          <Drawer.Screen
            name="News"
            component={News}
            options={{ drawerLabel: "News" }}
          />
          <Drawer.Screen
            name="SignIn"
            component={SignIn}
            options={{ drawerLabel: "News" }}
          />
        </Drawer.Navigator>
      ) : (
        <GetStartedStackNavigation />
      )}
    </NavigationContainer>
  );
}
//stack navigator for the main page
createSTNavigator = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
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
              color="#ffffff"
              onPress={() => {
                navigation.openDrawer();
              }}
            />
          ),
          headerShown: true,
          headerStyle: { backgroundColor: "#1976d2" },
          headerTintColor: "#ffffff",
        }}
      />
      <Stack.Screen
        name="Symptoms"
        component={SymptomPage}
        options={{ headerShown: true }}
      />
      <Stack.Screen name="Page 8" component={MapService} />
      <Stack.Screen name="Page 9" component={UserSymptomPage} />

      <Stack.Screen name="Page 11" component={Information} />
      <Stack.Screen name="Page 12" component={NavigatorDrawer} />
      <Stack.Screen
        name="What Is Covid-19?"
        component={WhatIsCovid19}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Covid19 Symptoms"
        component={Symptoms}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Preventions"
        component={Preventions}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Treatments"
        component={Treatments}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
};
