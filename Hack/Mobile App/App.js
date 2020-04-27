import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomePage1 from "./components/welcome-page/WelcomePage1.js";
import WelcomePage2 from "./components/welcome-page/WelcomePage2.js";
import WelcomePage3 from "./components/welcome-page/WelcomePage3.js";
import SignIn from "./components/sign-in-page/SignIn.js";
import SignUp from "./components/sign-up-page/SignUp.js";
import MainPage from "./components/main-page/MainPage.js";
import SymptomPage from "./components/symptom-page/SymptomPage.js";
import UserSymptomPage from "./components/symptom-page/UserSymptomPage.js";
import MapService from "./components/map-service/MapService.js";
import Information from "./components/information-page/InformationPage.js";
import News from "./components/news-page/News.js";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NavigatorDrawer from "./components/navigation/NavigatorDrawer.js";

import { createDrawerNavigator } from "@react-navigation/drawer";

const Drawer = createDrawerNavigator();

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <NavigatorDrawer {...props} />}
      >
        <Drawer.Screen name="Home" children={createSTNavigator} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
createSTNavigator = ({ navigation }) => {
  return (
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
      <Stack.Screen
        name="Symptoms"
        component={SymptomPage}
        options={{ headerShown: true }}
      />
      <Stack.Screen name="Page 8" component={MapService} />
      <Stack.Screen name="Page 9" component={UserSymptomPage} />
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
      <Stack.Screen name="Page 10" component={News} />
      <Stack.Screen name="Page 11" component={Information} />
      <Stack.Screen name="Page 12" component={NavigatorDrawer} />
    </Stack.Navigator>
  );
};
