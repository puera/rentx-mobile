import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppStackRoutes } from './app.stack.routes';
import { Profile } from '../screens/Profile';
import { MyCars } from '../screens/MyCars';
import { Home } from '../screens/Home';

const { Navigator, Screen } = createBottomTabNavigator();

export function AppTabRoutes() {
  return (
    <Navigator
      initialRouteName="AppStackRoutes"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen name="AppStackRoutes" component={AppStackRoutes} />
      <Screen name="MyCars" component={MyCars} />
      <Screen name="Profile" component={Profile} />
    </Navigator>
  );
}
