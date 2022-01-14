import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useTheme } from 'styled-components';
import { BackButton } from '../../../components/BackButton';
import { Bullet } from '../../../components/Bullet';
import { Button } from '../../../components/Button';

import { InputPassword } from '../../../components/InputPassword';
import { SignUpSecondStepProps } from '../../../routes/stack.routes';

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
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const navigation = useNavigation();
  const { params } = useRoute();

  const dataUser = params as SignUpSecondStepProps;

  const theme = useTheme();

  function handleRegister() {
    if (!password || !passwordConfirm)
      return Alert.alert('Opa', 'Informe a senha e a confirmação.');

    if (password !== passwordConfirm)
      return Alert.alert('Opa', 'As senhas não são iguais.');

    navigation.navigate('Confirmation', {
      title: 'Conta Criada!',
      message: `Agora é so fazer login\ne aproveitar. `,
      nextScreenRoute: 'SignIn',
    });
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
            />
            <InputPassword
              iconName="lock"
              placeholder="Repetir Senha"
              onChangeText={setPasswordConfirm}
              value={passwordConfirm}
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
