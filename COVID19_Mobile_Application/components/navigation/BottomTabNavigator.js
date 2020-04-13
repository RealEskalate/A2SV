import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";

import TabBarIcon from "./TabBarIcon.js";
import SymptomPage from "../symptom-page/SymptomPage.js";
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
        name="Links"
        component={SymptomPage}
        options={{
          title: "My Symptoms",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-person" />
          ),
        }}
      />
      <BottomTab.Screen
        name="Home"
        component={HeatMap}
        options={{
          title: "Heat Map",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-locate" />
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
      return "Heat Map";
    case "Links":
      return "Symptoms";
  }
}
