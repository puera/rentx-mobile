import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'react-native';

import { Container, CarList } from './styles';
import { Header } from '../../components/Header';
import { Car } from '../../components/Car';

const carData = {
  brand: 'Audi',
  name: 'RS 5 Coupé',
  rent: {
    period: 'AO DIA',
    price: 120,
  },
  thumbnail: 'https://cdn.picpng.com/audi/audi-red-a5-28597.png',
};

export function Home() {
  const navigation = useNavigation();

  function handleCarDetails() {
    navigation.navigate('CarDetails');
  }

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Header />

      <CarList
        data={[1, 2, 3, 4, 5, 6, 7]}
        keyExtractor={(item) => String(item)}
        renderItem={({ item }) => (
          <Car
            brand={carData.brand}
            name={carData.name}
            rent={carData.rent}
            thumbnail={carData.thumbnail}
            onPress={handleCarDetails}
          />
        )}
      />
    </Container>
  );
}
