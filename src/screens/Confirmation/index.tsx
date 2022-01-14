import React from 'react';

import { StatusBar, useWindowDimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Container, Content, Title, Message, Footer } from './styles';
import LogoSvg from '../../assets/logo_background_gray.svg';
import DoneSvg from '../../assets/done.svg';
import { ButtonConfirmation } from '../../components/ButtonConfirmation';
import { ConfirmationProps } from '../../routes/stack.routes';

export function Confirmation() {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const { params } = useRoute();

  const { title, message, nextScreenRoute } = params as ConfirmationProps;

  function handleConfirm() {
    navigation.navigate(nextScreenRoute);
  }
  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <LogoSvg width={width} />

      <Content>
        <DoneSvg width={80} height={80} />
        <Title>{title}</Title>

        <Message>{message}</Message>
      </Content>
      <Footer>
        <ButtonConfirmation title="OK" onPress={handleConfirm} />
      </Footer>
    </Container>
  );
}
