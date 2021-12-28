import { useCallback, useEffect, useState } from 'react';
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
  const [timeValue, setTimeValue] = useState<Date>();
  const [timeText, setTimeText] = useState<string>('');
  const [isTens, setIsTens] = useState(false);
  const [isUnits, setIsUnits] = useState(false);

  useEffect(() => {
    // When value not set.
    if (value === '') return;

    // Get time numbers from text.
    const numbers = getTimeNumbers(value, amPmNames);

    if (numbers === null) return;

    // Save to time value
    const [h, m, s] = numbers;
    const date = new Date(0, 0, 0, h, m, s);
    console.log({ value, h, m, s, date });
    setTimeValue(date);
  }, [value, amPmNames]);

  // Update timeText on timeValue changed.
  useEffect(() => {
    if (timeValue === undefined) return;

    const date = timeValue;
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();
    console.log({ h, m, s });

    if (isHour12) {
      const amPm = h >= 0 && h < 12 ? amPmNames.am : amPmNames.pm;
      const hour = h % 12 === 0 ? 12 : h % 12;
      const tText = timeToString(hour, m, s, colon) + ' ' + amPm;
      return setTimeText(tText);
    }

    const tText = timeToString(h, m, s, colon);
    setTimeText(tText);
  }, [timeValue, colon, amPmNames, isHour12]);

  // Initialize timeValue with current date time.
  const initialTime = useCallback(() => {
    const date = new Date();
    setTimeValue(date);
  }, []);

  const tickTime = (
    section: TimeSelectionNames[number],
    upDown: 'up' | 'down'
  ) => {
    const newTimeValue: Date = timeValue || new Date();

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
    setTimeValue(date);
  };

  const updateTime = useCallback(
    (section: TimeSelectionNames[number], value: number) => {
      const newTimeValue: Date = timeValue || new Date();
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
      setTimeValue(date);
    },
    [timeValue]
  );

  const reset = () => {
    setTimeValue(undefined);
    setTimeText('');
  };

  return { timeText, initialTime, tickTime, updateTime, reset };
};

export default useTime;
