import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Feather } from '@expo/vector-icons';

import { useTheme } from 'styled-components';
import { TextInput, TextInputProps } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { Container, IconContainer, InputText } from './styles';

interface InputProps extends TextInputProps {
  iconName: React.ComponentProps<typeof Feather>['name'];
}

interface InputRef {
  focus(): void;
}

const InputPasswordFoward: ForwardRefRenderFunction<InputRef, InputProps> = (
  { iconName, value, ...rest },
  ref,
) => {
  const inputElementRef = useRef<TextInput>(null);

  const [isPasswordVisible, setIsPasswordVisible] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const theme = useTheme();

  function handleFocus() {
    setIsFocused(true);
  }

  function handleBlur() {
    setIsFocused(false);
    setIsFilled(!!value);
  }

  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus();
    },
  }));

  return (
    <Container>
      <IconContainer isFocused={isFocused}>
        <Feather
          name={iconName}
          size={24}
          color={
            isFocused || isFilled ? theme.colors.main : theme.colors.text_detail
          }
        />
      </IconContainer>

      <InputText
        ref={inputElementRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
        secureTextEntry={isPasswordVisible}
        isFocused={isFocused}
        {...rest}
      />

      <BorderlessButton
        onPress={() => setIsPasswordVisible((prevState) => !prevState)}
      >
        <IconContainer isFocused={isFocused}>
          <Feather
            name={isPasswordVisible ? 'eye-off' : 'eye'}
            size={24}
            color={theme.colors.text_detail}
          />
        </IconContainer>
      </BorderlessButton>
    </Container>
  );
};

export const InputPassword = forwardRef(InputPasswordFoward);
