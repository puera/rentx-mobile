import React from 'react';
import { Feather } from '@expo/vector-icons';
import {
  Calendar as CustomCalendar,
  DateData,
  LocaleConfig,
} from 'react-native-calendars';
import { useTheme } from 'styled-components';

import localeConfig from './localeConfig';

LocaleConfig.locales['pt-br'] = localeConfig;
LocaleConfig.defaultLocale = 'pt-br';

interface MarkedDatesProps {
  [date: string]: {
    color: string;
    textColor: string;
    disable?: boolean;
    disableTouchEvent?: boolean;
  };
}

interface CalendarProps {
  markedDates: MarkedDatesProps;
  onDayPress: (date: DateData) => void;
}

interface DayProps {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
}

function Calendar({ markedDates, onDayPress }: CalendarProps) {
  const theme = useTheme();
  return (
    <CustomCalendar
      renderArrow={(direction) => (
        <Feather
          name={direction === 'right' ? 'chevron-right' : 'chevron-left'}
          size={24}
          color={theme.colors.text}
        />
      )}
      headerStyle={{
        backgroundColor: theme.colors.background_secondary,
        borderBottomWidth: 0.5,
        borderBottomColor: theme.colors.text_detail,
        paddingBottom: 10,
        marginBottom: 10,
      }}
      theme={{
        textDayFontFamily: theme.fonts.primary_400,
        textDayHeaderFontFamily: theme.fonts.primary_500,
        textMonthFontFamily: theme.fonts.secondary_600,
        textDayFontSize: 10,
        textMonthFontSize: 20,
        monthTextColor: theme.colors.title,
        arrowStyle: {
          marginHorizontal: -15,
        },
      }}
      firstDay={1}
      minDate={`${new Date()}`}
      markingType="period"
      markedDates={markedDates}
      onDayPress={onDayPress}
    />
  );
}

export { Calendar, MarkedDatesProps, DayProps };
