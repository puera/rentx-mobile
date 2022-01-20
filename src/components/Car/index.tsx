import React from 'react';

import { RectButtonProps } from 'react-native-gesture-handler';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon';
import {
  Container,
  Details,
  Brand,
  Name,
  About,
  Rent,
  Period,
  Price,
  Type,
  CarImage,
} from './styles';

type CarProps = {
  brand: string;
  name: string;
  period: string;
  price: number;
  thumbnail: string;
  fuel_type: string;
} & RectButtonProps;

export function Car({
  name,
  brand,
  period,
  price,
  thumbnail,
  fuel_type,
  ...rest
}: CarProps) {
  const MotorIcon = getAccessoryIcon(fuel_type);
  return (
    <Container {...rest}>
      <Details>
        <Brand>{brand}</Brand>
        <Name>{name}</Name>

        <About>
          <Rent>
            <Period>{period}</Period>
            <Price>{`R$ ${price}`}</Price>
          </Rent>

          <Type>
            <MotorIcon />
          </Type>
        </About>
      </Details>

      <CarImage source={{ uri: thumbnail }} resizeMode="contain" />
    </Container>
  );
}
