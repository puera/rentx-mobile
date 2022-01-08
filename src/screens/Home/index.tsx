import { StatusBar } from 'react-native';
import React from 'react';

import { Container } from './styles';
import { Header } from '../../components/Header';

export function Home() {
  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Header />
    </Container>
  );
}
