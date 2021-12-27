import React, {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getRanges, initialTime } from './TimeField.utils';

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
  const ranges = useMemo(() => getRanges(value), [value]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [section, setSection] = useState<TimeSection>();

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
        const timeString = initialTime(isHour12, amPmNames, ':');
        updateValue(timeString);
        setSection('hour');
      } else if (!isNaN(Number(key))) {
        e.preventDefault();
        const timeString = initialTime(true, amPmNames, ':');
        updateValue(timeString);
        setSection('hour');
      }
    } else {
      if (e.shiftKey && key === 'Tab') {
        if (
          section === 'minute' ||
          section === 'second' ||
          section === 'amPm'
        ) {
          e.preventDefault();
          backwardSection();
        }
      } else if (key === 'Tab') {
        if (
          section === 'hour' ||
          section === 'minute' ||
          section === 'second'
        ) {
          e.preventDefault();
          forwardSection();
        }
      } else if (key === 'ArrowRight' || key === 'ArrowLeft') {
        const { selectionStart, selectionEnd } = e.currentTarget;
        if (key === 'ArrowRight') {
          if (selectionEnd === null) return;
          const cursorSection = findCursorSection(selectionEnd + 1);
          setSection(cursorSection);
        } else {
          if (selectionStart === null) return;
          const cursorSection = findCursorSection(selectionStart - 1);
          setSection(cursorSection);
        }
      } else if (key === 'ArrowUp' || key === 'ArrowDown') {
        e.preventDefault();
        if (!section) return;
        // Increase section
        // Decrease section

        if (section === 'amPm') {
          if (ranges === null) return;
          const oldAmPm = ranges[section].value as string;
          const newAmPm =
            oldAmPm === amPmNames.am ? amPmNames.pm : amPmNames.am;
        }
      }
    }
  };

  const findCursorSection = (cursorPosition: number): TimeSection => {
    for (const key in ranges) {
      if (Object.prototype.hasOwnProperty.call(ranges, key)) {
        const range = ranges[key];
        if (cursorPosition >= range.start && cursorPosition <= range.end) {
          return key as TimeSection;
        }
      }
    }
    return 'all';
  };

  const forwardSection = () => {
    if (section === 'hour') {
      setSection('minute');
    } else if (section === 'minute') {
      setSection('second');
    } else if (section === 'second') {
      setSection('amPm');
    }
  };

  const backwardSection = () => {
    if (section === 'minute') {
      setSection('hour');
    } else if (section === 'second') {
      setSection('minute');
    } else if (section === 'amPm') {
      setSection('second');
    }
  };

  const setRange = useCallback(
    (section: TimeSection) => {
      if (!ranges) return;
      const { start, end } = ranges[section];
      inputRef.current?.setSelectionRange(start, end);
    },
    [ranges]
  );

  const handleClick = (e: MouseEvent<HTMLInputElement>) => {
    if (value === '') {
      return;
    }

    const cursorPosition = e.currentTarget.selectionStart;
    if (cursorPosition === null) return;
    for (const key in ranges) {
      if (Object.prototype.hasOwnProperty.call(ranges, key)) {
        const range = ranges[key];
        if (cursorPosition >= range.start && cursorPosition <= range.end) {
          setSection(key as TimeSection);
          break;
        }
      }
    }
  };

  useEffect(() => {
    if (value === '') {
      setSection(undefined);
    }
  }, [value]);

  useEffect(() => {
    section && setRange(section);
  }, [section]);

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onKeyDown={handleKeyDown}
      onChange={(e) => updateValue(e.target.value)}
      onClick={handleClick}
      onBlur={(e) => {
        e.preventDefault();
        setSection(undefined);
      }}
    />
  );
};

export default TimeField;
