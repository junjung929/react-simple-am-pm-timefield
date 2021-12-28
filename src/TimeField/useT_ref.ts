import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AmPmNames,
  TimeSelectionNames,
  TimeSeparator,
} from './TimeField.types';
import { getTimeNumbers, timeToString } from './TimeField.utils';

const useTime = (
  // Text value of time field
  value: string,
  // Separator between numbers
  colon: TimeSeparator,
  // Indicator if the time format is 12 or 24 hours
  isHour12: boolean,
  // Names of am/pm
  amPmNames: AmPmNames
) => {
  const timeValueRef = useRef<Date>();
  const timeTextRef = useRef('');

  useEffect(() => {
    console.log('value, amPmNames, oldValue useEffect', {
      value,
      amPmNames,
    });
    // When value not set.
    if (value === '') return;

    // Get time numbers from text.
    const numbers = getTimeNumbers(value, amPmNames);

    if (numbers === null) return;

    // Save to time value
    const [h, m, s] = numbers;
    const date = new Date(0, 0, 0, h, m, s);
    timeValueRef.current = date;
  }, [value, amPmNames]);

  // Update timeTextRef.current  on timeValueRef.current changed.
  useEffect(() => {
    console.log(
      'timeValueRef.current, colon, amPmNames, isHour12, timeTextRef.current ',
      {
        timeValueRef,
        colon,
        amPmNames,
        isHour12,
        timeTextRef,
      }
    );
    if (timeValueRef.current === undefined) return;

    const date = timeValueRef.current;
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();

    if (isHour12) {
      const amPm = h >= 0 && h < 12 ? amPmNames.am : amPmNames.pm;
      const hour = h % 12 === 0 ? 12 : h % 12;
      const tText = timeToString(hour, m, s, colon) + ' ' + amPm;
      timeTextRef.current = tText;
      return;
    }

    const tText = timeToString(h, m, s, colon);
    timeTextRef.current = tText;
  }, [colon, amPmNames, isHour12]);

  // Initialize timeValueRef.current with current date time.
  const initialTime = useCallback(() => {
    const date = new Date();
    timeValueRef.current = date;
  }, []);

  const tickTime = useCallback(
    (section: TimeSelectionNames[number], upDown: 'up' | 'down') => {
      const newTimeValue: Date = timeValueRef.current || new Date();

      const dValue = upDown === 'up' ? 1 : -1;

      if (section === 'hour') {
        const h = newTimeValue.getHours();
        newTimeValue.setHours(h + dValue);
      } else if (section === 'minute') {
        const m = newTimeValue.getMinutes();
        newTimeValue.setMinutes(m + dValue);
      } else if (section === 'amPm') {
        const h = newTimeValue.getHours();
        newTimeValue.setHours(h + 12);
      } else {
        const s = newTimeValue.getSeconds();
        newTimeValue.setSeconds(s + dValue);
      }
      const date = new Date(newTimeValue);
      timeValueRef.current = date;
    },
    []
  );

  const updateTime = useCallback(
    (section: TimeSelectionNames[number], value: number) => {
      const newTimeValue: Date = timeValueRef.current || new Date();
      if (section === 'hour') {
        const h = newTimeValue.getHours();
        if (h === value) return;
        newTimeValue.setHours(value);
      } else if (section === 'minute') {
        const m = newTimeValue.getMinutes();
        if (m === value) return;
        newTimeValue.setMinutes(value);
      } else if (section === 'second') {
        const s = newTimeValue.getSeconds();
        if (s === value) return;
        newTimeValue.setSeconds(value);
      }
      const date = new Date(newTimeValue);
      timeValueRef.current = date;
    },
    []
  );

  const reset = () => {
    console.log('reset');
    timeTextRef.current = '';
    timeValueRef.current = undefined;
  };

  return {
    timeText: timeTextRef.current,
    initialTime,
    tickTime,
    updateTime,
    reset,
  };
};

export default useTime;
