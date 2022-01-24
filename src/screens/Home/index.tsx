import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BackHandler, Button, StatusBar, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from 'styled-components';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { PanGestureHandler, RectButton } from 'react-native-gesture-handler';
import { useNetInfo } from '@react-native-community/netinfo';
import { database } from '../../database';
import { Container, CarList } from './styles';
import { Header } from '../../components/Header';
import { Car } from '../../components/Car';
import { LoadingAnimated } from '../../LoadingAnimated';
import { Car as ModelCar } from '../../database/models/Car';
import { useAuth } from '../../hooks/auth';

import { api } from '../../services/api';

const ButtonAnimated = Animated.createAnimatedComponent(RectButton);

interface AccessoriesProps {
  id: string;
  type: string;
  name: string;
}

export interface CarsDTO {
  id: string;
  brand: string;
  name: string;
  about: string;
  period: string;
  price: number;
  fuel_type: string;
  thumbnail: string;
  accessories: AccessoriesProps[];
  photos: {
    id: string;
    photo: string;
  }[];
}

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export function Home() {
  const [cars, setCars] = useState<ModelCar[]>([]);
  const [loading, setLoading] = useState(true);

  const { offlineSynchronize } = useAuth();

  const positionY = useSharedValue(0);
  const poistionX = useSharedValue(0);

  const myCarsButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: poistionX.value,
        },
        {
          translateY: positionY.value,
        },
      ],
    };
  });

  const navigation = useNavigation();
  const theme = useTheme();
  const netInfo = useNetInfo();

  const onGestureEvent = useAnimatedGestureHandler({
    onStart(_, ctx: any) {
      ctx.positionX = poistionX.value;
      ctx.positionY = positionY.value;
    },
    onActive(event, ctx: any) {
      poistionX.value = ctx.positionX + event.translationX;
      positionY.value = ctx.positionY + event.translationY;
    },
    onEnd() {
      poistionX.value = withSpring(0);
      positionY.value = withSpring(0);
    },
  });

  function handleCarDetails(car: ModelCar) {
    navigation.navigate('CarDetails', { car });
  }

  function handleOpenMyCars() {
    navigation.navigate('MyCars');
  }

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        if (isMounted) setLoading(true);
        const carCollection = database.get<ModelCar>('cars');

        const getCars = await carCollection.query().fetch();

        if (!getCars.length) {
          const response = await api.get('cars');
          return setCars(response.data);
        }
        if (isMounted) setCars(getCars);
      } catch (error) {
        console.log(error);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  useFocusEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );

    return () => backHandler.remove();
  });

  useEffect(() => {
    try {
      if (netInfo.isConnected) offlineSynchronize();
    } catch (error) {
      console.log(error);
    }
  }, [netInfo.isConnected, offlineSynchronize]);

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Header quantityCars={cars.length} loading={loading} />
      {/* <Button title="Sincronizar" onPress={offlineSynchronize} /> */}
      {loading ? (
        <LoadingAnimated />
      ) : (
        <CarList
          data={cars}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Car
              brand={item.brand}
              name={item.name}
              period={item.period}
              price={item.price}
              thumbnail={item.thumbnail}
              fuel_type={item.fuel_type}
              onPress={() => handleCarDetails(item)}
            />
          )}
        />
      )}
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View
          style={[
            myCarsButtonStyle,
            { position: 'absolute', bottom: 13, right: 22 },
          ]}
        >
          <ButtonAnimated
            onPress={handleOpenMyCars}
            style={[styles.button, { backgroundColor: theme.colors.main }]}
          >
            <Ionicons
              name="ios-car-sport"
              size={32}
              color={theme.colors.shape}
            />
          </ButtonAnimated>
        </Animated.View>
      </PanGestureHandler>
    </Container>
  );
}
