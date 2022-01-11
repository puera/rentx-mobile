import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { CarsDTO, Home } from '../screens/Home';
import { CarDetails } from '../screens/CarDetails';
import { Scheduling } from '../screens/Scheduling';
import { SchedulingDetails } from '../screens/SchedulingDetails';
import { SchedulingComplete } from '../screens/SchedulingComplete';

export interface AppRoutesParamList {
  Home: undefined;
  CarDetails: {
    car: CarsDTO;
  };
  Scheduling: {
    car: CarsDTO;
  };
  SchedulingDetails: {
    car: CarsDTO;
    dates: string[];
  };
  SchedulingComplete: undefined;
}

const { Navigator, Screen } = createStackNavigator();

export function StackRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen name="Home" component={Home} />
      <Screen name="CarDetails" component={CarDetails} />
      <Screen name="Scheduling" component={Scheduling} />
      <Screen name="SchedulingDetails" component={SchedulingDetails} />
      <Screen name="SchedulingComplete" component={SchedulingComplete} />
    </Navigator>
  );
}
