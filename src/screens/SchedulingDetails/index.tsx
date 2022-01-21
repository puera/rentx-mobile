import React, { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { Alert } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { Accessory } from '../../components/Accessory';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';

import {
  Container,
  Header,
  CarImages,
  Content,
  Details,
  Description,
  Brand,
  Name,
  Rent,
  Period,
  Price,
  Accessories,
  Footer,
  RentalPeriod,
  CalendarIcon,
  DateInfo,
  DateTitle,
  DateValue,
  RentalPrice,
  RentalPriceLabel,
  RentalPriceDetails,
  RentalPriceQuota,
  RentalPriceTotal,
} from './styles';
import { Button } from '../../components/Button';
import { CarsDTO } from '../Home';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon';
import { getPlattformDate } from '../../utils/getPlattformDate';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/auth';

interface Params {
  car: CarsDTO;
  dates: string[];
}

interface RentalPeriod {
  startFormatted: string;
  endFormatted: string;
}

export function SchedulingDetails() {
  const [carUpdated, setCarUpdated] = useState<CarsDTO>({} as CarsDTO);
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>(
    {} as RentalPeriod,
  );
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const navigation = useNavigation();
  const { params } = useRoute();
  const netInfo = useNetInfo();
  const { user } = useAuth();

  const { car, dates } = params as Params;

  const rentalTotal = Number(dates.length * car.price);

  async function handleConfirmRental() {
    setLoading(true);

    await api
      .post('rentals', {
        user_id: user.user_id,
        car_id: car.id,
        start_date: new Date(dates[0]),
        end_date: new Date(dates[dates.length - 1]),
        total: rentalTotal,
      })
      .then(() =>
        navigation.navigate('Confirmation', {
          message: `Agora você só precisa ir ${'\n'} até a concessionária da RENTX `,
          title: 'Carro alugado!',
          nextScreenRoute: 'Home',
        }),
      )
      .catch(() => {
        setLoading(false);
        Alert.alert('Não foi possível confirmar o agendamento');
      });
  }

  useEffect(() => {
    setRentalPeriod({
      startFormatted: format(
        getPlattformDate(new Date(dates[0])),
        'dd/MM/yyyy',
      ),
      endFormatted: format(
        getPlattformDate(new Date(dates[dates.length - 1])),
        'dd/MM/yyyy',
      ),
    });
  }, [dates]);

  useEffect(() => {
    if (netInfo.isConnected) {
      (async () => {
        const response = await api.get(`cars/${car.id}`);
        setCarUpdated(response.data);
      })();
    }
  }, [netInfo.isConnected, car.id]);

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()} />
      </Header>
      <CarImages>
        <ImageSlider
          imagesUrl={
            carUpdated?.photos
              ? carUpdated.photos
              : [{ id: car.thumbnail, photo: car.thumbnail }]
          }
        />
      </CarImages>
      <Content>
        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>

          <Rent>
            <Period>{car.period}</Period>
            <Price>R$ {car.price}</Price>
          </Rent>
        </Details>

        {carUpdated.accessories && (
          <Accessories>
            {carUpdated.accessories.map((accessory) => (
              <Accessory
                key={accessory.id}
                name={accessory.name}
                icon={getAccessoryIcon(accessory.type)}
              />
            ))}
          </Accessories>
        )}

        <RentalPeriod>
          <CalendarIcon>
            <Feather
              name="calendar"
              size={RFValue(24)}
              color={theme.colors.shape}
            />
          </CalendarIcon>

          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue>{rentalPeriod.startFormatted}</DateValue>
          </DateInfo>

          <Feather
            name="chevron-right"
            size={RFValue(10)}
            color={theme.colors.text}
          />

          <DateInfo>
            <DateTitle>ATÉ</DateTitle>
            <DateValue>{rentalPeriod.endFormatted}</DateValue>
          </DateInfo>
        </RentalPeriod>

        <RentalPrice>
          <RentalPriceLabel>TOTAL</RentalPriceLabel>
          <RentalPriceDetails>
            <RentalPriceQuota>{`R$ ${car.price} x${dates.length} diárias`}</RentalPriceQuota>
            <RentalPriceTotal>R$ {rentalTotal}</RentalPriceTotal>
          </RentalPriceDetails>
        </RentalPrice>
      </Content>
      <Footer>
        <Button
          title="Alugar agora"
          color={theme.colors.success}
          onPress={handleConfirmRental}
          loading={loading}
          enabled={!loading}
        />
      </Footer>
    </Container>
  );
}
