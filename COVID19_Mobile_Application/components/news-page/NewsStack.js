import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import News from './News';
import NewsView from './NewsView';

const Stack = createStackNavigator();

const NewsStack = (props) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#1976d2' },
        headerTintColor: '#fff',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
      headerMode='float'
      animation='fade'>
      <Stack.Screen
        name='News'
        component={News}
        options={{ title: 'Top News' }}
      />
      <Stack.Screen 
      name='NewsView'
      component={NewsView}
      options={{title: 'News Detail'}} />
    </Stack.Navigator>
  );
};

export default NewsStack;
