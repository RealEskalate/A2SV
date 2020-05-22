import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {
  Divider,
  BottomNavigation,
  BottomNavigationTab,
  Layout,
  Text,
  Icon,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import {SafeAreaView} from 'react-native';
import InformationScreen from '../pages/info/';
import InfoDetailScreen from '../pages/info-detail/';
import PrevDetailScreen from '../pages/info-detail/preventions';
import SymptomPage from '../../components/symptom-page/SymptomPage';
import {default as MapScreen} from '../../components/map-service/MapService';
import UserSymptomPage from '../../components/symptom-page/UserSymptomPage.js';
import DataAnalytics from '../../components/public-data-page/DataAnalytics.js';

const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();

const initialTabRoute = 'Information';

const MenuIcon = (props) => <Icon name="menu-2-outline" {...props} />;
const EditIcon = (props) => <Icon name="edit-2-outline" {...props} />;
const InfoIcon = (props) => <Icon {...props} name="info-outline" />;
const DataIcon = (props) => <Icon {...props} name="pie-chart-outline" />;
const MapIcon = (props) => <Icon {...props} name="pin-outline" />;
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
    <SafeAreaView style={{flex: 1}}>
      <TopNavigation
        title="Edit Your Simptoms"
        alignment="center"
        accessoryLeft={renderBackAction}
      />
      <Divider />
      <SymptomPage />
    </SafeAreaView>
  );
};

const HomeTabsNavigator = ({navigation}) => {
  const openDrawer = () => {
    navigation.openDrawer();
  };

  const names = ['INFO', 'DATA ANALITICS', 'MAP TRACKER', 'SYMPTOMS'];
  const [i, setI] = React.useState(0);

  const OpenDrawerAction = () => (
    <TopNavigationAction icon={MenuIcon} onPress={openDrawer} />
  );

  const EditSymptomAction = () => (
    <TopNavigationAction
      icon={EditIcon}
      onPress={() => navigation.navigate('EditSymptomScreen')}
    />
  );

  const HomeBottomNavigation = ({navigation, state}) => (
    <SafeAreaView>
      <Divider />
      <BottomNavigation
        appearance="noIndicator"
        selectedIndex={state.index}
        onSelect={(index) => {
          setI(index);
          navigation.navigate(state.routeNames[index]);
        }}>
        <BottomNavigationTab title="INFO" icon={InfoIcon} />
        <BottomNavigationTab title="DATA" icon={DataIcon} />
        <BottomNavigationTab title="MAP" icon={MapIcon} />
        <BottomNavigationTab title="SYMPTOMS" icon={PersonIcon} />
      </BottomNavigation>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <TopNavigation
        title={names[i]}
        alignment="center"
        accessoryRight={() => (i == 3 ? <EditSymptomAction /> : <></>)}
        accessoryLeft={OpenDrawerAction}
      />
      <Divider />
      <BottomTab.Navigator
        initialRouteName={initialTabRoute}
        backBehavior="initialRoute"
        tabBar={(props) => <HomeBottomNavigation {...props} />}>
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
      gestureDirection: 'horizontal',
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    }}>
    <Stack.Screen name="HomeBotttomNav" component={HomeTabsNavigator} />
    <Stack.Screen name="InfoDetailScreen" component={InfoDetailScreen} />
    <Stack.Screen name="PrevDetailScreen" component={PrevDetailScreen} />
    <Stack.Screen name="EditSymptomScreen" component={EditSymptomScreen} />
  </Stack.Navigator>
);
