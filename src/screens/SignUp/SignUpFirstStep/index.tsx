import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
import React, { useRef, useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, TextInput } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { BackButton } from '../../../components/BackButton';
import { Bullet } from '../../../components/Bullet';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';

import {
  Container,
  Header,
  Steps,
  Title,
  SubTitle,
  Form,
  FormTitle,
} from './styles';
import { formatMessagesYup } from '../../../utils/formatMessagesYup';

export function SignUpFirstStep() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cnh, setCnh] = useState('');

  const emailRef = useRef<TextInput>(null);
  const cnhRef = useRef<TextInput>(null);

  const navigation = useNavigation();

  async function handleNextStep() {
    try {
      const scheme = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório.'),
        email: Yup.string()
          .email('Digite um e-mail válido.')
          .required('E-mail é obrigatório.'),
        cnh: Yup.string().required('CNH é obrigatório.'),
      });
      await scheme.validate({ name, email, cnh }, { abortEarly: false });

      navigation.navigate('SignUpSecondStep', { name, email, cnh });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const message = formatMessagesYup(error);
        Alert.alert('Opa!', message);
      } else {
        Alert.alert('Opa!', 'Alguma coisa deu errada');
        console.log(error);
      }
    }
  }
  return (
    <KeyboardAvoidingView behavior="position">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Header>
            <BackButton onPress={() => navigation.goBack()} />
            <Steps>
              <Bullet active />
              <Bullet />
            </Steps>
          </Header>

          <Title>Crie a sua {'\n'} conta</Title>
          <SubTitle>Faça seu cadastro de {'\n'} forma rápida e fácil </SubTitle>

          <Form>
            <FormTitle>1. Dados</FormTitle>
            <Input
              iconName="user"
              placeholder="Nome"
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
              value={name}
              returnKeyType="next"
              onSubmitEditing={emailRef.current?.focus}
            />
            <Input
              ref={emailRef}
              iconName="mail"
              placeholder="E-mail"
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              value={email}
              returnKeyType="next"
              onSubmitEditing={cnhRef.current?.focus}
            />
            <Input
              ref={cnhRef}
              iconName="credit-card"
              placeholder="CNH"
              keyboardType="numeric"
              onChangeText={setCnh}
              value={cnh}
              returnKeyType="send"
              onSubmitEditing={handleNextStep}
            />
          </Form>

          <Button title="Próximo" onPress={handleNextStep} />
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
