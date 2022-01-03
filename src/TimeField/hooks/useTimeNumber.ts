import { useEffect, useState } from 'react';

import { TimeSelectionName } from '../TimeField.types';

/**
 * Control time number.
 *
 * @param section Selected section: hour, minute, or second.
 * @param isHour12 Indicator if the time format is 12 or 24 hours.
 */
const useTimeNumber = (
  section: Omit<TimeSelectionName, 'all' | 'amPm'>,
  isHour12: boolean = false
): [number | undefined, (v: number) => void, boolean, () => void] => {
  // Time number.
  const [number, setNumber] = useState<number>();

  // Indicator if the number is updated.
  const [isUpdated, setIsUpdated] = useState(false);

  // Indicator if the tens digit is set.
  const [isTensDigitReady, setIsTensDigitReady] = useState(false);

  // Indicator if the units digit is set.
  const [isUnitsDigitReady, setIsUnitsDigitReady] = useState(false);

  useEffect(() => {
    // If number is updated, set to default value.
    if (number === undefined) {
      setIsUpdated(false);
    }
  }, [number]);

  // Check if the number is ready to update.
  useEffect(() => {
    // Restart if input delay is over.
    const inputTimerId = setTimeout(() => {
      setIsTensDigitReady(false);
      setIsUnitsDigitReady(false);
      setNumber(undefined);
    }, 1000);

    // Update if both digits are given.
    // Then reset number to default.
    if (isTensDigitReady && isUnitsDigitReady) {
      setIsTensDigitReady(false);
      setIsUnitsDigitReady(false);
      setIsUpdated(true);
      setNumber(undefined);
    }

    // Cleanup timer.
    return () => {
      clearTimeout(inputTimerId);
    };
  }, [isTensDigitReady, isUnitsDigitReady]);

  /**
   * Update time number.
   *
   * @param value Desired number to be set.
   */
  const updateTime = (value: number) => {
    // Limit both digits depending on time format.
    // Hour limit: 1 - 12 or 0 - 23.
    // Minute and second limit: 0 - 59.
    const upBound = section === 'hour' ? (isHour12 ? 12 : 23) : 59;
    const tensDigitLimit = Math.floor(upBound / 10); // Hour: 1 or 2, minute and second: 5.
    const unitsDigitLimit = upBound % 10; // Hour: 2 or 3, minute and second: 9.

    let num = number || 0;

    // If both digits not set
    if (!isTensDigitReady && !isUnitsDigitReady) {
      // If tens digit is 0 and 12 hour format, make sure not to set to 0.
      if (value === 0 && isHour12) {
        num = Math.floor(num / 10) || 1;
      }

      // Set tens digit if the given number is smaller than limit.
      else if (value <= tensDigitLimit) {
        num = (num % 10) + value * 10;

        // Set only tens digit is ready.
        setIsTensDigitReady(true);
        setIsUnitsDigitReady(false);
      }

      // Set units digit if the given number is larger than limit.
      else {
        num = value;

        // Set both digits are ready.
        setIsTensDigitReady(true);
        setIsUnitsDigitReady(true);
      }
    }

    // Set units digit if only tens digit is ready.
    else if (isTensDigitReady && !isUnitsDigitReady) {
      // Get tens digit number.
      const tensDigit = Math.floor(num / 10);

      // If the tens digit number is same as limit.
      if (tensDigit === tensDigitLimit) {
        // Set units digit number if it's not bigger than limit.
        if (value <= unitsDigitLimit) {
          num = tensDigit * 10 + value;
        }

        // Set number to the given value if it's bigger than limit.
        else {
          num = value;
        }
      }

      // Set units digit number if the tens digit number is smaller than limit.
      else {
        num = tensDigit * 10 + value;
      }

      // Set both digits are ready.
      setIsTensDigitReady(true);
      setIsUnitsDigitReady(true);
    }
    setNumber(num);
  };

  const reset = () => {
    setIsTensDigitReady(false);
    setIsUnitsDigitReady(false);
    setNumber(undefined);
  };

  return [number, updateTime, isUpdated, reset];
};

export default useTimeNumber;
