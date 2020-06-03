import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import {
  Divider,
  BottomNavigation,
  BottomNavigationTab,
  Layout,
  Text,
  Icon,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import { SafeAreaView } from "react-native";
import InformationScreen from "../pages/info/";
import InfoDetailScreen from "../pages/info-detail/";
import PrevDetailScreen from "../pages/info-detail/preventions";
import SymptomPage from "../pages/symptom-page/SymptomPage";
import { default as MapScreen } from "../pages/map-service/MapService";
import UserSymptomPage from "../pages/symptom-page/UserSymptomPage.js";
import DataAnalytics from "../pages/public-data-page/DataAnalytics.js";
import DataAnalyticsMap from "../pages/public-data-page/DataAnalyticsMap.js";
import SymDetailScreen from "../pages/info-detail/symptoms.js";
import SpdDetailScreen from "../pages/info-detail/spread.js";
import MsgDetailScreen from "../pages/info-detail/message.js";
import { strings } from "../localization/localization";
import { LangContext } from "../../assets/lang/language-context";

const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();

const initialTabRoute = "Information";

const MenuIcon = (props) => <Icon name="menu-2-outline" {...props} />;
const EditIcon = (props) => <Icon name="edit-2-outline" {...props} />;
const InfoIcon = (props) => <Icon {...props} name="info-outline" />;
const DataIcon = (props) => <Icon {...props} name="pie-chart-outline" />;
const MapIcon = (props) => <Icon {...props} name="pin-outline" />;
const MapOutLine = (props) => <Icon {...props} name="map-outline" />;
const PersonIcon = (props) => <Icon {...props} name="person-outline" />;
const ArrowIosBackIcon = (style) => <Icon {...style} name="arrow-ios-back" />;

const EditSymptomScreen = (props) => {
  const renderBackAction = () => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={props.navigation.goBack}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        title={strings.EditYourSymptoms}
        alignment="center"
        accessoryLeft={renderBackAction}
      />
      <Divider />
      <SymptomPage />
    </SafeAreaView>
  );
};

const DataMap = (props) => {
  const renderBackAction = () => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={props.navigation.goBack}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        title={strings.Data}
        alignment="center"
        accessoryLeft={renderBackAction}
      />
      <Divider />
      <DataAnalyticsMap />
    </SafeAreaView>
  );
};

const HomeTabsNavigator = ({ navigation }) => {
  //setting up the language
  const langContext = React.useContext(LangContext);
  const lang = langContext.lang;
  strings.setLanguage(lang);
  const openDrawer = () => {
    navigation.openDrawer();
  };

  const names = [
    strings.Information,
    strings.Data,
    strings.Map,
    strings.MySymptoms,
  ];
  const [i, setI] = React.useState(0);

  const OpenDrawerAction = () => (
    <TopNavigationAction icon={MenuIcon} onPress={openDrawer} />
  );

  const EditSymptomAction = () => (
    <TopNavigationAction
      icon={EditIcon}
      onPress={() => navigation.navigate("EditSymptomScreen")}
    />
  );

  const GoToDataAnalyticsMap = () => (
    <TopNavigationAction
      icon={MapOutLine}
      onPress={() => navigation.navigate("DataAnalyticsMap")}
    />
  );

  const HomeBottomNavigation = ({ navigation, state }) => (
    <SafeAreaView>
      <Divider />
      <BottomNavigation
        appearance="noIndicator"
        selectedIndex={state.index}
        onSelect={(index) => {
          setI(index);
          navigation.navigate(state.routeNames[index]);
        }}
      >
        <BottomNavigationTab title={strings.Information} icon={InfoIcon} />
        <BottomNavigationTab title={strings.Data} icon={DataIcon} />
        <BottomNavigationTab title={strings.Map} icon={MapIcon} />
        <BottomNavigationTab title={strings.Symptoms} icon={PersonIcon} />
      </BottomNavigation>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        title={names[i]}
        alignment="center"
        accessoryRight={() =>
          i == 3 ? (
            <EditSymptomAction />
          ) : i == 1 ? (
            <GoToDataAnalyticsMap />
          ) : (
            <></>
          )
        }
        accessoryLeft={OpenDrawerAction}
      />
      <Divider />
      <BottomTab.Navigator
        initialRouteName={initialTabRoute}
        backBehavior="initialRoute"
        tabBar={(props) => <HomeBottomNavigation {...props} />}
      >
        <BottomTab.Screen name="Information" component={InformationScreen} />
        <BottomTab.Screen name="Data" component={DataAnalytics} />
        <BottomTab.Screen name="Map" component={MapScreen} />
        <BottomTab.Screen name="Symptoms" component={UserSymptomPage} />
      </BottomTab.Navigator>
    </SafeAreaView>
  );
};

export const HomeStackNavigator = (props) => (
  <Stack.Navigator
    {...props}
    headerMode="none"
    screenOptions={{
      gestureEnabled: true,
      gestureDirection: "horizontal",
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    }}
  >
    <Stack.Screen name="HomeBotttomNav" component={HomeTabsNavigator} />
    <Stack.Screen name="InfoDetailScreen" component={InfoDetailScreen} />
    <Stack.Screen name="PrevDetailScreen" component={PrevDetailScreen} />
    <Stack.Screen name="SymDetailScreen" component={SymDetailScreen} />
    <Stack.Screen name="SpdDetailScreen" component={SpdDetailScreen} />
    <Stack.Screen name="MsgDetailScreen" component={MsgDetailScreen} />
    <Stack.Screen name="EditSymptomScreen" component={EditSymptomScreen} />
    <Stack.Screen name="DataAnalyticsMap" component={DataMap} />
  </Stack.Navigator>
);
