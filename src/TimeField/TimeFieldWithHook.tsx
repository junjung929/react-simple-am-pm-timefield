import React, {
  KeyboardEvent,
  memo,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TimeSelectionNames } from './TimeField.types';
import { getSelectionRanges } from './TimeField.utils';
import useTime from './useT';
import useTimeNumber from './useTimeNumber';

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

type TimeSection = TimeSelectionNames[number];

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
  const [section, setSection] = useState<TimeSection>();

  const [hourDigit, setHourDigit, isHourUpdated] = useTimeNumber(
    'hour',
    isHour12
  );

  const [minuteDigit, setMinuteDigit, isMinuteUpdated] = useTimeNumber(
    'minute',
    isHour12
  );

  const [secondDigit, setSecondDigit, isSecondUpdated] = useTimeNumber(
    'second',
    isHour12
  );

  const { timeText, initialTime, tickTime, updateTime, reset } = useTime(
    value,
    colon,
    isHour12,
    amPmNames
  );

  const selectionRanges = useMemo(
    () => getSelectionRanges(timeText),
    [timeText]
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const key = e.key;
    // text is empty
    if (timeText === '') {
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
        setHourDigit(Number(key));
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
        e.preventDefault();
        forwardSection();
      } else if (key === 'ArrowRight' || key === 'ArrowLeft') {
        const { selectionStart, selectionEnd } = e.currentTarget;
        if (selectionStart === null || selectionEnd === null) return;
        if (key === 'ArrowRight') {
          const cursorPosition = selectionEnd + 1;
          const cursorSection = findCursorSection(
            cursorPosition,
            cursorPosition
          );
          setSection(cursorSection);
        } else {
          const cursorPosition = selectionStart - 1;
          const cursorSection = findCursorSection(
            cursorPosition,
            cursorPosition
          );
          setSection(cursorSection);
        }
      } else if (key === 'ArrowUp' || key === 'ArrowDown') {
        e.preventDefault();
        if (!section) return;
        // Increase section
        if (key === 'ArrowUp') {
          tickTime(section, 'up');
        }
        // Decrease section
        else {
          tickTime(section, 'down');
        }
      } else if (key === 'Escape' || key === 'Backspace') {
        reset();
      } else if (key === 'Enter') {
        inputRef.current?.blur();
      } else if (!isNaN(Number(key))) {
        e.preventDefault();
        if (!section) return;
        if (section === 'minute') {
          setMinuteDigit(Number(key));
        } else if (section === 'second') {
          setSecondDigit(Number(key));
        } else {
          setSection('hour');
          setHourDigit(Number(key));
        }
      }
    }
  };

  const handleSelect = (e: MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (value === '') return;

    const { selectionStart, selectionEnd } = e.currentTarget;
    if (selectionStart === null || selectionEnd === null) return;
    const section = findCursorSection(selectionStart, selectionEnd);
    setSection(section);
  };

  const findCursorSection = (
    start: number,
    end: number
  ): TimeSection | undefined => {
    if (selectionRanges === null) return undefined;

    // Normalize value to avoid overflow
    start = start > timeText.length ? timeText.length : start < 0 ? 0 : start;

    end = end > timeText.length ? timeText.length : end < 0 ? 0 : end;

    const [allRange, ...ranges] = selectionRanges;
    const sectionRange = ranges.find((r) => start >= r.start && end <= r.end);

    if (sectionRange) {
      return sectionRange.name;
    }

    return allRange.name;
  };

  const forwardSection = useCallback(() => {
    if (section === 'all') {
      setSection('hour');
    } else if (section === 'hour') {
      setSection('minute');
    } else if (section === 'minute') {
      setSection('second');
    } else if (section === 'second') {
      if (isHour12) {
        setSection('amPm');
      } else {
        inputRef.current?.blur();
      }
    } else {
      inputRef.current?.blur();
    }
  }, [section, isHour12]);

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
    if (isHourUpdated) {
      forwardSection();
    }
    if (hourDigit === undefined) return;
    updateTime('hour', hourDigit);
  }, [hourDigit, updateTime, forwardSection, isHourUpdated]);

  useEffect(() => {
    if (isMinuteUpdated) {
      forwardSection();
    }
    if (minuteDigit === undefined) return;
    updateTime('minute', minuteDigit);
  }, [minuteDigit, updateTime, forwardSection, isMinuteUpdated]);

  useEffect(() => {
    console.log({ isSecondUpdated, secondDigit });
    if (isSecondUpdated) {
      console.log('selected');
      forwardSection();
    }
    if (secondDigit === undefined) return;
    updateTime('second', secondDigit);
  }, [secondDigit, updateTime, forwardSection, isSecondUpdated, isHour12]);

  useEffect(() => {
    console.log('field value', value);
  }, [value]);

  return (
    <input
      ref={inputRef}
      type="text"
      value={timeText}
      onChange={(e) => {
        e.stopPropagation();
        console.log('change first', e.target.value);
        updateValue(e.target.value);
      }}
      onKeyDown={handleKeyDown}
      onBlur={(e) => {
        e.stopPropagation();
        setSection(undefined);
        setTimeout(() => {
          updateValue(e.target.value);
        }, 1);
      }}
      onSelect={handleSelect}
    />
  );
};

export default memo(TimeField);
