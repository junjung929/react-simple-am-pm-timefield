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
        // TODO: initialize time depending on input number
        initialTime();
        setSection('hour');
      }
    }
    // If not empty
    else {
      // Move selectionRange
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
          console.log({ cursorSection });
          setSection(cursorSection);
        } else {
          if (selectionStart === null) return;
          const cursorSection = findCursorSection(selectionStart - 1);
          console.log({ cursorSection });
          setSection(cursorSection);
        }
      }
    }
  };

  const findCursorSection = (
    cursorPosition: number
  ): TimeSection | undefined => {
    if (selectionRanges === null) return undefined;

    cursorPosition =
      cursorPosition > timeText.length
        ? timeText.length
        : cursorPosition < 0
        ? 0
        : cursorPosition;

    console.log({ cursorPosition });

    const sectionRange = selectionRanges.find(
      (r) => cursorPosition >= r.start && cursorPosition <= r.end
    );
    if (sectionRange) {
      return sectionRange.name;
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
      if (selectionRanges === null) return;
      const selection = selectionRanges.find((r) => r.name === section);
      if (!selection) return;
      const { start, end } = selection;

      inputRef.current?.setSelectionRange(start, end);
    },
    [selectionRanges]
  );

  useEffect(() => {
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
      onBlur={(e) => {
        e.preventDefault();
        setSection(undefined);
      }}
    />
  );
};

export default TimeField;
