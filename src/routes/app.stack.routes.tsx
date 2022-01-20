import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { CarsDTO, Home } from '../screens/Home';
import { CarDetails } from '../screens/CarDetails';
import { Scheduling } from '../screens/Scheduling';
import { SchedulingDetails } from '../screens/SchedulingDetails';
import { MyCars } from '../screens/MyCars';
import { Confirmation } from '../screens/Confirmation';
import { Splash } from '../screens/Splash';

export interface SignUpSecondStepProps {
  name: string;
  email: string;
  cnh: string;
}

export interface ConfirmationProps {
  title: string;
  message: string;
  nextScreenRoute: keyof ReactNavigation.RootParamList;
}

export interface AppRoutesParamList {
  SignIn: undefined;
  SignUpFirstStep: undefined;
  SignUpSecondStep: SignUpSecondStepProps;
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
  Confirmation: ConfirmationProps;
  MyCars: undefined;
  Profile: undefined;
}

const { Navigator, Screen } = createStackNavigator();

export function AppStackRoutes() {
  return (
    <Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Screen name="Home" component={Home} />
      <Screen name="CarDetails" component={CarDetails} />
      <Screen name="Scheduling" component={Scheduling} />
      <Screen name="SchedulingDetails" component={SchedulingDetails} />
      <Screen name="Confirmation" component={Confirmation} />
      <Screen name="MyCars" component={MyCars} />
    </Navigator>
  );
}
