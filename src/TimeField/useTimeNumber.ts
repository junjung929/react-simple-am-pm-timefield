import { useEffect, useState } from 'react';
import { TimeSelectionNames } from './TimeField.types';

const useTimeNumber = (
  section: TimeSelectionNames[number],
  isHour12: boolean = false
) => {
  const [number, setNumber] = useState<number>();
  const [isUpdated, setIsUpdated] = useState(false);
  const [isTensDigit, setIsTensDigit] = useState(false);
  const [isUnitsDigit, setIsUnitsDigit] = useState(false);

  useEffect(() => {
    if (number === undefined) {
      setIsUpdated(false);
    }
  }, [number]);
  useEffect(() => {
    const inputTimerId = setTimeout(() => {
      setIsTensDigit(false);
      setIsUnitsDigit(false);
    }, 1000);

    if (isTensDigit && isUnitsDigit) {
      setIsTensDigit(false);
      setIsUnitsDigit(false);
      setIsUpdated(true);
      setNumber(undefined);
    }
    return () => {
      clearTimeout(inputTimerId);
    };
  }, [isTensDigit, isUnitsDigit]);

  const updateTime = (value: number) => {
    const upBound = section === 'hour' ? (isHour12 ? 12 : 23) : 59;
    const tensDigitLimit = Math.floor(upBound / 10); // 1 or 2
    const unitsDigitLimit = upBound % 10; // 2 or 4

    let h = number || 0;

    if (!isTensDigit && !isUnitsDigit) {
      // set tens digit
      if (value <= tensDigitLimit) {
        h = (h % 10) + value * 10;
        setIsTensDigit(true);
        setIsUnitsDigit(false);

        // set units digit
      } else {
        h = value;
        setIsTensDigit(true);
        setIsUnitsDigit(true);
      }
    }
    // set units digit
    else if (isTensDigit && !isUnitsDigit) {
      const tD = Math.floor(h / 10);
      if (tD === tensDigitLimit) {
        if (value <= unitsDigitLimit) {
          h = tD * 10 + value;
        } else {
          h = value;
        }
      } else {
        h = tD * 10 + value;
      }
      setIsTensDigit(true);
      setIsUnitsDigit(true);
    }
    setNumber(h);
  };
  return [number, updateTime, isUpdated] as [
    number,
    (v: number) => void,
    boolean
  ];
};

export default useTimeNumber;
