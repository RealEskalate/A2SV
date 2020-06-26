import React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { default as NewsScreen } from "./newsClass";
import NewsView from "./NewsView";

const { Navigator, Screen } = createStackNavigator();

export const NewsNavigator = () => {
  const [initRouteName, setInitRouteName] = React.useState("News");

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
      <Screen name="News" component={NewsScreen} />
      <Screen name="NewsView" component={NewsView} />
    </Navigator>
  );
};
