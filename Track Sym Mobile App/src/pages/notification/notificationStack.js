import React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { default as NotificationScreen } from "./notification";
import NotificationView from "./notificationView";

const { Navigator, Screen } = createStackNavigator();

export const NotificationNavigator = () => {
  const [initRouteName, setInitRouteName] = React.useState("Notification");

  return (
    <Navigator
      headerMode="none"
      initialRouteName={initRouteName}
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: "horizontal",
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Screen name="Notification" component={NotificationScreen} />
      <Screen name="NotificationView" component={NotificationView} />
    </Navigator>
  );
};
