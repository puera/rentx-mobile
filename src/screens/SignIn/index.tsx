import React, { useEffect, useRef, useState } from 'react';
import * as LocalAuthetication from 'expo-local-authentication';
import * as Yup from 'yup';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  StatusBar,
  TextInput,
  View,
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useTheme } from 'styled-components';
import { useNavigation } from '@react-navigation/native';
import { useNetInfo } from '@react-native-community/netinfo';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { InputPassword } from '../../components/InputPassword';

import {
  Container,
  Header,
  SubTitle,
  Title,
  Form,
  Footer,
  OfflineInfo,
} from './styles';
import { formatMessagesYup } from '../../utils/formatMessagesYup';
import { useAuth } from '../../hooks/auth';

export function SignIn() {
  const { user, handleOptionBio } = useAuth();
  const passwordRef = useRef<TextInput>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const theme = useTheme();
  const navigation = useNavigation();
  const { signIn } = useAuth();
  const netInfo = useNetInfo();

  async function handleSignIn() {
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .required('O e-mail é obrigatório')
          .email('Digite um e-mail válido'),
        password: Yup.string().required('A senha é obrigatória'),
      });

      await schema.validate({ email, password }, { abortEarly: false });

      await signIn({ email, password });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const message = formatMessagesYup(error);
        return Alert.alert('Opa!', message);
      }
    }
  }

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthetication.hasHardwareAsync();

      if (user.id && compatible) {
        const result = await LocalAuthetication.authenticateAsync();

        if (result.success) return handleOptionBio(true);
      }
    })();
  }, [user.id, handleOptionBio]);

  return (
    <KeyboardAvoidingView behavior="position">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <StatusBar
            backgroundColor="transparent"
            barStyle="dark-content"
            translucent
          />
          <Header>
            <Title>Estamos {'\n'} quase lá.</Title>
            <SubTitle>
              Faça seu login para começar {'\n'} uma experiência incrível.
            </SubTitle>
          </Header>

          <Form>
            <View style={{ marginBottom: 8 }}>
              <Input
                iconName="mail"
                placeholder="E-mail"
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={setEmail}
                returnKeyType="next"
                onSubmitEditing={passwordRef.current?.focus}
                value={email}
              />
            </View>
            <InputPassword
              ref={passwordRef}
              iconName="lock"
              placeholder="Senha"
              onChangeText={setPassword}
              returnKeyType="send"
              onSubmitEditing={handleSignIn}
              value={password}
            />
          </Form>

          {netInfo.isConnected === false && (
            <OfflineInfo>
              Conecte-se a internet para logar ou criar a conta.
            </OfflineInfo>
          )}

          <Footer>
            <View style={{ marginBottom: 8 }}>
              <Button
                title="Login"
                onPress={handleSignIn}
                enabled={!!netInfo.isConnected}
                loading={false}
              />
            </View>
            <Button
              title="Criar conta gratuita"
              onPress={() => navigation.navigate('SignUpFirstStep')}
              light
              color={theme.colors.background_secondary}
              enabled={!!netInfo.isConnected}
              loading={false}
            />
          </Footer>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
