import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomePage1 from "./components/welcome-page/WelcomePage1.js";
import WelcomePage2 from "./components/welcome-page/WelcomePage2.js";
import WelcomePage3 from "./components/welcome-page/WelcomePage3.js";
import SignIn from "./components/sign-in-page/SignIn.js";
import SignUp from "./components/sign-up-page/SignUp.js";

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Page 1" component={WelcomePage1} />
        <Stack.Screen name="Page 2" component={WelcomePage2} />
        <Stack.Screen name="Page 3" component={WelcomePage3} />
        <Stack.Screen name="Page 4" component={SignIn} />
        <Stack.Screen name="Page 5" component={SignUp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
