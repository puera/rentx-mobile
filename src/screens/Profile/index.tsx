import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BackButton } from '../../components/BackButton';

import {
  Container,
  Header,
  HeaderTop,
  LogoutButton,
  HeaderTitle,
  PhotoContainer,
  Photo,
  PhotoButton,
  Content,
  Options,
  Option,
  OptionTitle,
  Section,
} from './styles';
import { Input } from '../../components/Input';
import { useAuth } from '../../hooks/auth';
import { InputPassword } from '../../components/InputPassword';
import { Button } from '../../components/Button';

export function Profile() {
  const [option, setOption] = useState<'dataEdit' | 'passwordEdit'>('dataEdit');

  const theme = useTheme();
  const navigation = useNavigation();
  const { user, signOut } = useAuth();

  function handleOptionChange(optionSelected: 'dataEdit' | 'passwordEdit') {
    setOption(optionSelected);
  }

  async function handleChangeAvatar() {
    console.log('chegou aqui');
  }

  async function handleSignOut() {
    Alert.alert('Opa!', 'Deseja realmente deslogar do App?', [
      {
        text: 'Sim',
        onPress: () => signOut(),
      },
      {
        text: 'Não',
      },
    ]);
  }

  return (
    <KeyboardAvoidingView behavior="position">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Header>
            <HeaderTop>
              <BackButton
                color={theme.colors.shape}
                onPress={() => navigation.goBack()}
              />
              <HeaderTitle>Editar Perfil</HeaderTitle>
              <LogoutButton onPress={handleSignOut}>
                <Feather name="power" size={24} color={theme.colors.shape} />
              </LogoutButton>
            </HeaderTop>
            <PhotoContainer>
              {user.avatar ? (
                <Photo source={{ uri: user.avatar }} />
              ) : (
                <Photo
                  resizeMode="contain"
                  source={{
                    uri: `https://ui-avatars.com/api/?name=${user.name}`,
                  }}
                />
              )}
              <PhotoButton onPress={() => console.log('photo')}>
                <Feather name="camera" size={24} color={theme.colors.shape} />
              </PhotoButton>
            </PhotoContainer>
          </Header>
          <Content style={{ marginBottom: useBottomTabBarHeight() }}>
            <Options>
              <Option
                active={option === 'dataEdit'}
                onPress={() => handleOptionChange('dataEdit')}
              >
                <OptionTitle active={option === 'dataEdit'}>Dados</OptionTitle>
              </Option>
              <Option
                active={option === 'passwordEdit'}
                onPress={() => handleOptionChange('passwordEdit')}
              >
                <OptionTitle active={option === 'passwordEdit'}>
                  Trocar Senha
                </OptionTitle>
              </Option>
            </Options>
            {option === 'dataEdit' ? (
              <Section>
                <Input
                  iconName="user"
                  placeholder="Nome"
                  autoCorrect={false}
                  defaultValue={user.name}
                />
                <Input
                  iconName="mail"
                  editable={false}
                  defaultValue={user.email}
                />
                <Input
                  iconName="credit-card"
                  placeholder="CNH"
                  keyboardType="numeric"
                  defaultValue={user.driver_license}
                />
              </Section>
            ) : (
              <Section>
                <InputPassword iconName="lock" placeholder="Senha Atual" />
                <InputPassword iconName="lock" placeholder="Nova Senha" />
                <InputPassword iconName="lock" placeholder="Repetir Senha" />
              </Section>
            )}
            <Button
              title="Salvar alterações"
              onPress={() => console.log('botao')}
            />
          </Content>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
