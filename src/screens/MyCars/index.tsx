import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StatusBar } from 'react-native';
import { useTheme } from 'styled-components';
import { BackButton } from '../../components/BackButton';
import { Car } from '../../components/Car';
import { api } from '../../services/api';
import { CarsDTO } from '../Home';

import {
  Container,
  Header,
  SubTitle,
  Title,
  Content,
  Appointments,
  AppointmentsTitle,
  AppointmentsQuantity,
  CarWrapper,
  CarFooter,
  CarFooterTitle,
  CarFooterDate,
  CarFooterPeriod,
} from './styles';
import { LoadingAnimated } from '../../LoadingAnimated';

interface CarProps {
  id: string;
  user_id: string;
  car: CarsDTO;
  startDate: string;
  endDate: string;
}

export function MyCars() {
  const [cars, setCars] = useState<CarProps[]>([]);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const navigation = useNavigation();

  const fetchMyCars = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/schedules_byuser?user_id=1');
      setCars(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyCars();
  }, [fetchMyCars]);
  return (
    <Container>
      <Header>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        <BackButton
          onPress={() => navigation.goBack()}
          color={theme.colors.shape}
        />

        <Title>
          Escolha uma {'\n'}
          data de início e {'\n'}
          fim do aluguel
        </Title>

        <SubTitle>Conforto, segurança e praticidade.</SubTitle>
      </Header>

      {loading ? (
        <LoadingAnimated />
      ) : (
        <Content>
          {!!cars.length && (
            <Appointments>
              <AppointmentsTitle>Agendamentos Feitos</AppointmentsTitle>
              <AppointmentsQuantity>{cars.length}</AppointmentsQuantity>
            </Appointments>
          )}

          <FlatList
            data={cars}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <CarWrapper>
                <Car
                  name={item.car.name}
                  brand={item.car.brand}
                  fuel_type={item.car.fuel_type}
                  period={item.car.period}
                  price={item.car.price}
                  thumbnail={item.car.thumbnail}
                />
                <CarFooter>
                  <CarFooterTitle>Período</CarFooterTitle>
                  <CarFooterPeriod>
                    <CarFooterDate>{item.startDate}</CarFooterDate>
                    <AntDesign
                      name="arrowright"
                      size={20}
                      color={theme.colors.title}
                      style={{
                        marginHorizontal: 10,
                      }}
                    />
                    <CarFooterDate>{item.endDate}</CarFooterDate>
                  </CarFooterPeriod>
                </CarFooter>
              </CarWrapper>
            )}
          />
        </Content>
      )}
    </Container>
  );
}
