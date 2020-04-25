import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";

import TabBarIcon from "../TabBarIcon.js";
import SymptomPage from "../symptom-page/SymptomPage.js";
import UserSymptomPage from "../symptom-page/UserSymptomPage.js";
import HeatMap from "../map-service/MapService.js";

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "Home";

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Home"
        component={HeatMap}
        options={{
          title: "Information",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-info" />
          ),
        }}
      />

      <BottomTab.Screen
        name="Public Data"
        component={HeatMap}
        options={{
          title: "Data Analysis",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-analytics" />
          ),
        }}
      />
      <BottomTab.Screen
        name="News"
        component={HeatMap}
        options={{
          title: "News",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-paper" />
          ),
        }}
      />
      <BottomTab.Screen
        name="Symptom Tracker"
        component={HeatMap}
        options={{
          title: "Symptom Tracker",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-locate" />
          ),
        }}
      />

      <BottomTab.Screen
        name="MySymptoms"
        component={SymptomPage}
        options={{
          title: "My Symptoms",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-person" />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName =
    route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case "Home":
      return "Information";
    case "Public Data":
      return "Public Data";
    case "News":
      return "News";
    case "Symptom Tracker":
      return "Symptom Tracker";
    case "MySymptoms":
      return "My Symptoms";
  }
}
