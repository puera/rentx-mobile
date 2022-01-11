import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from 'styled-components';
import { Container, CarList, MyCarsButton } from './styles';
import { Header } from '../../components/Header';
import { Car } from '../../components/Car';
import { api } from '../../services/api';
import { Loading } from '../../components/Loading';

interface AccessoriesProps {
  type: string;
  name: string;
}

export interface CarsDTO {
  id: string;
  brand: string;
  name: string;
  about: string;
  rent: {
    period: string;
    price: number;
  };
  fuel_type: string;
  thumbnail: string;
  accessories: AccessoriesProps[];
  photos: string[];
}

export function Home() {
  const [cars, setCars] = useState<CarsDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const theme = useTheme();

  function handleCarDetails(car: CarsDTO) {
    navigation.navigate('CarDetails', { car });
  }

  function handleOpenMyCars() {
    navigation.navigate('MyCars');
  }

  useEffect(() => {
    async function fetchCars() {
      try {
        setLoading(true);
        const response = await api.get<CarsDTO[]>('cars');

        setCars(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Header quantityCars={cars.length} loading={loading} />
      {loading ? (
        <Loading />
      ) : (
        <CarList
          data={cars}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Car
              brand={item.brand}
              name={item.name}
              rent={item.rent}
              thumbnail={item.thumbnail}
              fuel_type={item.fuel_type}
              onPress={() => handleCarDetails(item)}
            />
          )}
        />
      )}

      <MyCarsButton onPress={handleOpenMyCars}>
        <Ionicons name="ios-car-sport" size={32} color={theme.colors.shape} />
      </MyCarsButton>
    </Container>
  );
}
