import React, {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TimeSelectionRanges } from './TimeField.types';
import { getSelectionRanges } from './TimeField.utils';
import useTime from './useT';

interface TimeFieldProps {
  value: string;
  onChange: (text: string) => void;
  isHour12?: boolean;
  colon?: ':' | '.';
  amPmNames?: {
    am: string;
    pm: string;
  };
}

type TimeSection = 'hour' | 'minute' | 'second' | 'amPm' | 'all';

const DEFAULT_COLON = ':';
const DEFAULT_AM_PM_NAMES = {
  am: 'AM',
  pm: 'PM',
};

const TimeField = ({
  isHour12 = false,
  value,
  onChange: updateValue,
  colon = DEFAULT_COLON,
  amPmNames = DEFAULT_AM_PM_NAMES,
  ...props
}: TimeFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  // const [ranges, setRanges] = useState<TimeSelectionRanges>();
  const [section, setSection] = useState<TimeSection>();
  const { timeText, initialTime } = useTime(value, colon, isHour12, amPmNames);
  const selectionRanges = useMemo(
    () => getSelectionRanges(timeText),
    [timeText]
  );
  console.log({ timeText, selectionRanges });

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;
    // text is empty
    if (value === '') {
      if (
        key === 'ArrowUp' ||
        key === 'ArrowDown' ||
        key === 'ArrowLeft' ||
        key === 'ArrowRight'
      ) {
        e.preventDefault();
        initialTime();
        setSection('hour');
      } else if (!isNaN(Number(key))) {
        e.preventDefault();
        initialTime();
        setSection('hour');
      }
    }
  };

  const setRange = useCallback(
    (section: TimeSection) => {
      console.log({ selectionRanges });
      if (selectionRanges === null) return;
      const selection = selectionRanges.find((r) => r.name === section);
      console.log(selection);
      if (!selection) return;
      const { start, end } = selection;
      console.log({ start, end });

      inputRef.current?.setSelectionRange(start, end);
    },
    [selectionRanges]
  );

  useEffect(() => {
    console.log(section);
    section && setRange(section);
  }, [section, setRange]);

  useEffect(() => {
    updateValue(timeText);
  }, [timeText, updateValue]);

  return (
    <input
      ref={inputRef}
      type="text"
      value={timeText}
      onChange={(e) => updateValue(timeText)}
      onKeyDown={handleKeyDown}
    />
  );
};

export default TimeField;
