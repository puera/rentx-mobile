import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useRef, useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, TextInput } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useTheme } from 'styled-components';

import { BackButton } from '../../../components/BackButton';
import { Bullet } from '../../../components/Bullet';
import { Button } from '../../../components/Button';

import { InputPassword } from '../../../components/InputPassword';
import { SignUpSecondStepProps } from '../../../routes/stack.routes';
import { api } from '../../../services/api';

import {
  Container,
  Header,
  Steps,
  Title,
  SubTitle,
  Form,
  FormTitle,
} from './styles';

export function SignUpSecondStep() {
  const passwordConfirmationRef = useRef<TextInput>(null);

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const navigation = useNavigation();
  const { params } = useRoute();

  const dataUser = params as SignUpSecondStepProps;

  const theme = useTheme();

  async function handleRegister() {
    if (!password || !passwordConfirm)
      return Alert.alert('Opa', 'Informe a senha e a confirmação.');

    if (password !== passwordConfirm)
      return Alert.alert('Opa', 'As senhas não são iguais.');

    try {
      await api.post('users', {
        name: dataUser.name,
        email: dataUser.email,
        driver_license: dataUser.cnh,
        password,
      });

      navigation.navigate('Confirmation', {
        title: 'Conta Criada!',
        message: `Agora é so fazer login\ne aproveitar. `,
        nextScreenRoute: 'SignIn',
      });
    } catch (error) {
      console.log(error.message);
      if (error.message === 'Network Error')
        return Alert.alert('Opa', 'Algum problema de conexão com o servidor');
      if (axios.isAxiosError(error)) {
        if (
          error.response.data.message
            .toLowerCase()
            .includes('user already exists')
        ) {
          Alert.alert(
            'Opa',
            'E-mail já existe na base de dados, utilize outro e-mail',
          );
        } else {
          Alert.alert(
            'Opa',
            'Não foi possível cadastrar por algum motivo, tente novamente mais tarde',
          );
        }
      } else {
        console.log(error);
        Alert.alert(
          'Opa',
          'Não foi possível cadastrar por algum motivo, tente novamente mais tarde',
        );
      }
    }
  }

  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Header>
            <BackButton onPress={() => navigation.goBack()} />
            <Steps>
              <Bullet />
              <Bullet active />
            </Steps>
          </Header>

          <Title>Crie a sua {'\n'} conta</Title>
          <SubTitle>Faça seu cadastro de {'\n'} forma rápida e fácil </SubTitle>

          <Form>
            <FormTitle>2. Senha</FormTitle>
            <InputPassword
              iconName="lock"
              placeholder="Senha"
              onChangeText={setPassword}
              value={password}
              returnKeyType="next"
              onSubmitEditing={passwordConfirmationRef.current?.focus}
            />
            <InputPassword
              ref={passwordConfirmationRef}
              iconName="lock"
              placeholder="Repetir Senha"
              onChangeText={setPasswordConfirm}
              value={passwordConfirm}
              returnKeyType="send"
              onSubmitEditing={handleRegister}
            />
          </Form>

          <Button
            title="Cadastrar"
            color={theme.colors.success}
            onPress={handleRegister}
          />
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
