import { useCallback, useEffect, useState } from 'react';
import {
  AmPmNames,
  TimeSelectionNames,
  TimeSeparator,
} from './TimeField.types';
import { getTimeNumbers, timeToString } from './TimeField.utils';

/**
 * Control time text
 *
 * @param value Text value of time field.
 * @param colon Separator between numbers.
 * @param isHour12 Indicator if the time format is 12 or 24 hours.
 * @param amPmNames Names of am/pm.
 */
const useTime = (
  value: string,
  colon: TimeSeparator,
  isHour12: boolean,
  amPmNames: AmPmNames
) => {
  // Store date type version of the given value.
  const [timeValue, setTimeValue] = useState<Date>();

  // Store the temporary time text from timeValue.
  const [timeText, setTimeText] = useState<string>('');

  // Update timeValue on value change
  useEffect(() => {
    // When value not set.
    if (value === '') return;

    // Get time numbers from text.
    const numbers = getTimeNumbers(value, amPmNames);

    if (numbers === null) return;

    // Save to time value as date type
    const [h, m, s] = numbers;
    const date = new Date(0, 0, 0, h, m, s);
    setTimeValue(date);
  }, [value, amPmNames]);

  // Update timeText on timeValue changed.
  useEffect(() => {
    // When value not set.
    if (timeValue === undefined) return;

    const date = timeValue;
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();

    // If it's 12 hour format.
    if (isHour12) {
      // Set am when hour between 0 - 11.
      // Set pm when hour between 12 - 23.
      const amPm = h >= 0 && h < 12 ? amPmNames.am : amPmNames.pm;

      // Normalize hour number to 12 hour format.
      const hour = h % 12 === 0 ? 12 : h % 12;
      const tText = timeToString(hour, m, s, colon) + ' ' + amPm;
      return setTimeText(tText);
    }

    // If it's 24 hour format.
    const tText = timeToString(h, m, s, colon);
    setTimeText(tText);
  }, [timeValue, colon, amPmNames, isHour12, timeText]);

  // Initialize timeValue with current date time.
  const initialTime = useCallback(() => {
    const date = new Date();
    setTimeValue(date);
  }, []);

  // Increase or decrease timeValue by 1 depending on selected section.
  const tickTime = useCallback(
    (
      // Selected section: hour, minute, second or amPm
      section: TimeSelectionNames[number],

      // Increase when set to up
      // Decrease when set to down
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
    },
    [timeValue]
  );

  // Update time number to the given value
  const updateTime = useCallback(
    (
      // Selected section: hour, minute, second or amPm
      section: TimeSelectionNames[number],
      // Desired number to be set
      value: number
    ) => {
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

  // Reset timeText and TimeValue to default.
  const reset = () => {
    setTimeText('');
    setTimeValue(undefined);
  };

  return { timeText, initialTime, tickTime, updateTime, reset };
};

export default useTime;
