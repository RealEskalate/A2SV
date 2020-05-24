import React from "react";
import SignIn from "../sign-in-page/SignIn.js";
import SignUp from "../sign-up-page/SignUp.js";
import WelcomePage1 from "../welcome-page/WelcomePage1.js";
import WelcomePage2 from "../welcome-page/WelcomePage2.js";
import WelcomePage3 from "../welcome-page/WelcomePage3.js";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();
//Navigation for welcome, sign up and sign in page
const GetStartedStackNavigation = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="WelcomePage1" component={WelcomePage1} />
      <Stack.Screen name="WelcomePage2" component={WelcomePage2} />
      <Stack.Screen name="WelcomePage3" component={WelcomePage3} />
    </Stack.Navigator>
  );
};

export default GetStartedStackNavigation;
