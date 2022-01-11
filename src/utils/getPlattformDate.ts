import { addDays } from 'date-fns';
import { Platform } from 'react-native';

export function getPlattformDate(date: Date) {
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    return addDays(date, 1);
  }
  return date;
}
