/* eslint-disable no-nested-ternary */
import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';

import { Container, HeaderContent, TotalCars } from './styles';

import Logo from '../../assets/logo.svg';

interface Props {
  quantityCars: number;
  loading: boolean;
}

export function Header({ quantityCars, loading }: Props) {
  return (
    <Container>
      <HeaderContent>
        <Logo width={RFValue(108)} height={RFValue(12)} />
        <TotalCars>
          {!loading &&
            (quantityCars === 0
              ? `Não há nenhum ${'\n'} carro disponível`
              : quantityCars === 1
              ? `Total de ${quantityCars} carro`
              : `Total de ${quantityCars} carros`)}
        </TotalCars>
      </HeaderContent>
    </Container>
  );
}
