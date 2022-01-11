import { FlatList, FlatListProps } from 'react-native';
import styled from 'styled-components/native';
import { CarsDTO } from '.';

export const Container = styled.View`
  flex: 1;

  background-color: ${({ theme }) => theme.colors.background_primary};
`;

export const CarList = styled(
  FlatList as new (props: FlatListProps<CarsDTO>) => FlatList<CarsDTO>,
).attrs({
  contentContainerStyle: {
    padding: 24,
  },
  showsVerticalScrollIndicator: false,
})``;
