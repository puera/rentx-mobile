import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useRef, useState } from 'react';
import { useTheme } from 'styled-components';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNetInfo } from '@react-native-community/netinfo';
import axios from 'axios';
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
import { formatMessagesYup } from '../../utils/formatMessagesYup';
import { api } from '../../services/api';

export function Profile() {
  const cnhRef = useRef<TextInput>(null);

  const newPasswordRef = useRef<TextInput>(null);
  const confirmPaswordRef = useRef<TextInput>(null);

  const { user, signOut, updateUser } = useAuth();

  const [option, setOption] = useState<'dataEdit' | 'passwordEdit'>('dataEdit');
  const [avatar, setAvatar] = useState(user.avatar);
  const [name, setName] = useState(user.name);
  const [driverLicense, setDriverLicense] = useState(user.driver_license);

  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const theme = useTheme();
  const navigation = useNavigation();
  const netInfo = useNetInfo();

  function handleOptionChange(optionSelected: 'dataEdit' | 'passwordEdit') {
    if (!netInfo.isConnected && optionSelected === 'passwordEdit') {
      Alert.alert('Opa!', 'Para mudar a senha, conecte-se a internet');
    } else {
      setOption(optionSelected);
    }
  }

  async function handleGalery() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      const { uri } = result as ImagePicker.ImageInfo;
      setAvatar(uri);
    }
  }

  async function handleCamera() {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      const { uri } = result as ImagePicker.ImageInfo;
      setAvatar(uri);
    }
  }

  async function handleChangeAvatar() {
    Alert.alert('Opa!', 'Escolha uma op????o desejada', [
      {
        text: 'Galeria',
        onPress: () => handleGalery(),
      },
      {
        text: 'C??mera',
        onPress: () => handleCamera(),
      },
      {
        text: 'Cancelar',
      },
    ]);
  }

  async function handleSignOut() {
    Alert.alert('Opa!', 'Deseja realmente deslogar do App?', [
      {
        text: 'Sim',
        onPress: () => signOut(),
      },
      {
        text: 'N??o',
      },
    ]);
  }

  async function handleProfileUpdate() {
    if (option === 'dataEdit') {
      try {
        const schema = Yup.object({
          driverLicense: Yup.string().required('CNH ?? obrigat??ria'),
          name: Yup.string().required('Nome ?? Obrigat??rio'),
        });
        await schema.validate({ name, driverLicense }, { abortEarly: false });

        await updateUser({
          id: user.id,
          user_id: user.user_id,
          email: user.email,
          name,
          driver_license: driverLicense,
          avatar,
          token: user.token,
        });

        Alert.alert('Perfil atualizado com sucesso!');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const message = formatMessagesYup(error);
          Alert.alert('Opa!', message);
        } else
          Alert.alert('Opa!', 'Algo deu errado, tente novamente mais tarde');
      }
    } else {
      try {
        const schema = Yup.object({
          password: Yup.string(),
          newPassword: Yup.string().when('password', {
            is: (value) => !!value.length,
            then: Yup.string().required('Nova senha ?? obrigat??ria'),
            otherwise: Yup.string(),
          }),
          confirmPassword: Yup.string()
            .when('password', {
              is: (value) => !!value.length,
              then: Yup.string().required('Repetir senha ?? obrigat??ria'),
              otherwise: Yup.string(),
            })
            .oneOf(
              [Yup.ref('newPassword'), null],
              'Repetir senha n??o ?? igual a nova senha',
            ),
        });

        await schema.validate(
          { password, newPassword, confirmPassword },
          { abortEarly: false },
        );

        await api.put('users/change-password  ', {
          password,
          new_password: newPassword,
        });

        Alert.alert(
          'Tudo certo!',
          'Sua senha foi trocada com sucesso! Voc?? ser?? deslogado',
          [
            {
              text: 'Sim',
              onPress: () => signOut(),
            },
          ],
        );
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const message = formatMessagesYup(error);
          Alert.alert('Opa!', message);
        } else if (axios.isAxiosError(error)) {
          if (
            error.response.data.message.toLowerCase() ===
            'old password does not match'
          )
            return Alert.alert(
              'Opa!',
              'Sua senha antiga foi digitado incorretamente!',
            );
        } else {
          return Alert.alert(
            'Opa!',
            'Algum problema acontenceu, tente novamente mais tarde',
          );
        }
      }
    }
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
              {avatar ? (
                <Photo source={{ uri: avatar }} />
              ) : (
                <Photo
                  resizeMode="contain"
                  source={{
                    uri: `https://ui-avatars.com/api/?name=${user.name}`,
                  }}
                />
              )}
              <PhotoButton onPress={handleChangeAvatar}>
                <Feather name="camera" size={24} color={theme.colors.shape} />
              </PhotoButton>
            </PhotoContainer>
          </Header>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Content style={{ marginBottom: useBottomTabBarHeight() }}>
              <Options>
                <Option
                  active={option === 'dataEdit'}
                  onPress={() => handleOptionChange('dataEdit')}
                >
                  <OptionTitle active={option === 'dataEdit'}>
                    Dados
                  </OptionTitle>
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
                    onChangeText={setName}
                    returnKeyType="next"
                    onSubmitEditing={cnhRef.current?.focus}
                  />
                  <Input
                    iconName="mail"
                    editable={false}
                    defaultValue={user.email}
                  />
                  <Input
                    ref={cnhRef}
                    iconName="credit-card"
                    placeholder="CNH"
                    keyboardType="numeric"
                    defaultValue={user.driver_license}
                    onChangeText={setDriverLicense}
                    returnKeyType="send"
                    onSubmitEditing={handleProfileUpdate}
                  />
                </Section>
              ) : (
                <Section>
                  <InputPassword
                    iconName="lock"
                    placeholder="Senha Atual"
                    onChangeText={setPassword}
                    returnKeyType="next"
                    onSubmitEditing={newPasswordRef.current?.focus}
                  />
                  <InputPassword
                    ref={newPasswordRef}
                    iconName="lock"
                    placeholder="Nova Senha"
                    onChangeText={setNewPassword}
                    returnKeyType="next"
                    onSubmitEditing={confirmPaswordRef.current?.focus}
                  />
                  <InputPassword
                    ref={confirmPaswordRef}
                    iconName="lock"
                    placeholder="Repetir Senha"
                    returnKeyType="send"
                    onSubmitEditing={handleProfileUpdate}
                    onChangeText={setConfirmPassword}
                  />
                </Section>
              )}
              <Button
                enabled={
                  option === 'dataEdit'
                    ? true
                    : !!(option === 'passwordEdit' && !!password)
                }
                title="Salvar altera????es"
                onPress={handleProfileUpdate}
              />
            </Content>
          </ScrollView>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
