import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Feather } from '@expo/vector-icons';

import { useTheme } from 'styled-components';
import { TextInput, TextInputProps } from 'react-native';
import { Container, IconContainer, InputText } from './styles';

interface InputProps extends TextInputProps {
  iconName: React.ComponentProps<typeof Feather>['name'];
}

interface InputRef {
  focus(): void;
}

const InputForward: React.ForwardRefRenderFunction<InputRef, InputProps> = (
  { iconName, value, ...rest },
  ref,
) => {
  const inputElementRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

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

  const theme = useTheme();
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
        isFocused={isFocused}
        {...rest}
      />
    </Container>
  );
};

export const Input = forwardRef(InputForward);
