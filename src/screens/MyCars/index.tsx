import { useIsFocused, useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StatusBar } from 'react-native';
import { useTheme } from 'styled-components';
import { format, parseISO } from 'date-fns';
import { BackButton } from '../../components/BackButton';
import { Car } from '../../components/Car';
import { api } from '../../services/api';

import { Car as ModelCar } from '../../database/models/Car';

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

interface DataProps {
  id: string;
  car: ModelCar;
  start_date: string;
  end_date: string;
}

export function MyCars() {
  const [cars, setCars] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const theme = useTheme();
  const navigation = useNavigation();

  const fetchMyCars = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('rentals');
      const dataFormatted = response.data.map((data: DataProps) => ({
        id: data.id,
        car: data.car,
        start_date: format(parseISO(data.start_date), 'dd/MM/yyyy'),
        end_date: format(parseISO(data.end_date), 'dd/MM/yyyy'),
      }));
      setCars(dataFormatted);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

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
                    <CarFooterDate>{item.start_date}</CarFooterDate>
                    <AntDesign
                      name="arrowright"
                      size={20}
                      color={theme.colors.title}
                      style={{
                        marginHorizontal: 10,
                      }}
                    />
                    <CarFooterDate>{item.end_date}</CarFooterDate>
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
