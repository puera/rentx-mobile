import React, { useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BackHandler, StatusBar, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from 'styled-components';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { PanGestureHandler, RectButton } from 'react-native-gesture-handler';
import { Container, CarList } from './styles';
import { Header } from '../../components/Header';
import { Car } from '../../components/Car';
import { api } from '../../services/api';
import { LoadingAnimated } from '../../LoadingAnimated';

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
  const [cars, setCars] = useState<CarsDTO[]>([]);
  const [loading, setLoading] = useState(true);

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

  function handleCarDetails(car: CarsDTO) {
    console.log('chegou aqui');
    navigation.navigate('CarDetails', { car });
  }

  function handleOpenMyCars() {
    navigation.navigate('MyCars');
  }

  useEffect(() => {
    let isMounted = true;
    async function fetchCars() {
      try {
        if (isMounted) setLoading(true);
        const response = await api.get<CarsDTO[]>('cars');

        if (isMounted) setCars(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        if (isMounted) setLoading(false);
      }
      return () => {
        isMounted = false;
      };
    }
    fetchCars();
  }, []);

  useFocusEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );

    return () => backHandler.remove();
  });

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Header quantityCars={cars.length} loading={loading} />
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
