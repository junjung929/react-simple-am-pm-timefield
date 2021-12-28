import { useEffect, useState } from 'react';
import { TimeSelectionNames } from './TimeField.types';

/**
 * Control time number.
 *
 * @param section Selected section: hour, minute, or second.
 * @param isHour12 Indicator if the time format is 12 or 24 hours.
 */
const useTimeNumber = (
  section: Omit<TimeSelectionNames[number], 'all' | 'amPm'>,
  isHour12: boolean = false
): [number | undefined, (v: number) => void, boolean] => {
  // Time number.
  const [number, setNumber] = useState<number>();

  // Indicator if the number is updated.
  const [isUpdated, setIsUpdated] = useState(false);

  // Indicator if the tens digit is set.
  const [isTensDigit, setIsTensDigit] = useState(false);

  // Indicator if the units digit is set.
  const [isUnitsDigit, setIsUnitsDigit] = useState(false);

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
      setIsTensDigit(false);
      setIsUnitsDigit(false);
    }, 1000);

    // Update if both digits are given.
    // Then reset number to default.
    if (isTensDigit && isUnitsDigit) {
      setIsTensDigit(false);
      setIsUnitsDigit(false);
      setIsUpdated(true);
      setNumber(undefined);
    }

    // Cleanup timer.
    return () => {
      clearTimeout(inputTimerId);
    };
  }, [isTensDigit, isUnitsDigit]);

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
    if (!isTensDigit && !isUnitsDigit) {
      // Set tens digit if the given number is smaller than limit.
      if (value <= tensDigitLimit) {
        num = (num % 10) + value * 10;

        // Set only tens digit is ready.
        setIsTensDigit(true);
        setIsUnitsDigit(false);
      }

      // Set units digit if the given number is larger than limit.
      else {
        num = value;

        // Set both digits are ready.
        setIsTensDigit(true);
        setIsUnitsDigit(true);
      }
    }

    // Set units digit if only tens digit is ready.
    else if (isTensDigit && !isUnitsDigit) {
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
      setIsTensDigit(true);
      setIsUnitsDigit(true);
    }
    setNumber(num);
  };

  return [number, updateTime, isUpdated];
};

export default useTimeNumber;