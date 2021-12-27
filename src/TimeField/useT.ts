import { useCallback, useEffect, useState } from 'react';
import { AmPmNames, TimeSeparator } from './TimeField.types';
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

  useEffect(() => {
    // When value not set.
    if (value === '') return;

    // Get time numbers from text.
    const numbers = getTimeNumbers(value, amPmNames);

    if (numbers === null) return;

    // Save to time value
    const [h, m, s] = numbers;
    const date = new Date(0, 0, 0, h, m, s);
    setTimeValue(date);
  }, [value, amPmNames]);

  // Update timeText on timeValue changed.
  useEffect(() => {
    if (timeValue === undefined) return;

    const date = timeValue;
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();

    if (isHour12) {
      const amPm = h < 12 ? amPmNames.am : amPmNames.pm;
      const tText = timeToString(h % 12, m, s, colon) + ' ' + amPm;
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

  return { timeText, initialTime };
};

export default useTime;
