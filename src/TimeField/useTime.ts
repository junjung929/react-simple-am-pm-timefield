import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AmPmNames,
  TimeSelectionNames,
  TimeSeparator,
} from './TimeField.types';
import {
  formatTimeText,
  generateDateFromTimeText,
  generateTimeTextFromDate,
} from './TimeField.utils';

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
    const date = generateDateFromTimeText(value, amPmNames);
    if (date === undefined) return;
    setTimeValue(date);
  }, [value, amPmNames]);

  // Update timeText on timeValue changed.
  useEffect(() => {
    const tText = generateTimeTextFromDate(
      timeValue,
      amPmNames,
      isHour12,
      colon
    );
    setTimeText(tText);
  }, [timeValue, colon, amPmNames, isHour12]);

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
