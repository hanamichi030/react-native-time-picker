import React, { useMemo, useCallback } from 'react';
/* eslint-disable radix */
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Wheel, { WheelStyleProps } from './Wheel';

export enum DateType {
    year = 'year',
    month = 'month',
    day = 'day',
}
const DEFAULT_DATE_TYPES = [DateType.year, DateType.month, DateType.day];

const Styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
    height: 100,
    overflow: 'hidden',
    borderRadius: 4,
  },
});

function createNumberList(num: number) {
    return new Array(num).fill(0).map((_, index) => `${index}`);
}

const YEAR_OPTIONS = new Array(50).fill(0).map((_, index) => `${2001 + index}`);

interface Props {
    value: Date;
    onChange: (newValue: Date) => void;
    containerStyle?: StyleProp<ViewStyle>;
    onScroll?: (scrollState: boolean) => void;
    textStyle?: TextStyle;
    wheelProps?: WheelStyleProps;
    dateFormat?: (string | DateType)[];
}

export default function DatePicker({
    value,
    onChange,
    onScroll,
    containerStyle,
    textStyle,
    wheelProps = {},
    dateFormat = DEFAULT_DATE_TYPES,
}: Props): React.ReactElement {
    const [
      year, month, day
     ] = useMemo(() => [
       value.getFullYear(), value.getMonth() + 1, value.getDate()
     ], [value]);

     const changeDateValue = useCallback((year: number, month: number, date: number) => {
      const newDate = new Date();
      newDate.setFullYear(year);
      newDate.setMonth(month);
      newDate.setDate(date);
      onChange(newDate);
     }, [onChange])

    return (
      <View style={[Styles.container, containerStyle]}>
        {
          dateFormat.map((dateType) => {
            switch (dateType) {
              case DateType.year:
                return (
                  <Wheel key='year-wheel-pick'  value={`${year}`} values={YEAR_OPTIONS} setValue={(newValue) => 
                    changeDateValue(parseInt(newValue, 10), month, day)
                  }
                  onScroll={onScroll}
                  textStyle={textStyle}
                  {...wheelProps}
                  />
                );
              
              case DateType.month:
                return (
                  <Wheel key='month-wheel-pick'  value={`${month}`} values={
                    createNumberList(12)
                  } setValue={(newValue) => changeDateValue(year, parseInt(newValue, 10), day)}
                  onScroll={onScroll}
                  textStyle={textStyle}
                  {...wheelProps}
                  />
                );
              case DateType.day:
                return (
                  <Wheel key='day-wheel-pick' value={`${day}`} values={
                    createNumberList(31)
                  } setValue={(newValue) => changeDateValue(year, month, parseInt(newValue, 10))}
                  onScroll={onScroll}
                  textStyle={textStyle}
                  {...wheelProps} />
                );
              default:
                return <Text style={textStyle}
                  key={`label-${dateType}`}
                >{dateType}</Text>
            }
          })
        }
      </View>
    )
}