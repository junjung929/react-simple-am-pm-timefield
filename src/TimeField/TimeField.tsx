import React, {
  ChangeEvent,
  CSSProperties,
  FocusEvent,
  KeyboardEvent,
  memo,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { KeyEnum, TimeSelectionName } from './TimeField.types';
import { formatTimeText, getSelectionRanges } from './TimeField.utils';
import useTime from './hooks/useTime';
import useTimeNumber from './hooks/useTimeNumber';

interface TimeFieldProps {
  value: string;
  onChange: (text: string) => void;
  isHour12?: boolean;
  colon?: ':' | '.';
  amPmNames?: {
    am: string;
    pm: string;
  };
  id?: string;
  className?: string;
  style?: CSSProperties;
  placeHolder?: string;
  title?: string;
}

type TimeSection = TimeSelectionName;

type EventFlg = 'onBlur' | 'onKeyDown' | 'onChange' | 'onSelect' | '';

const DEFAULT_COLON = ':';
const DEFAULT_AM_PM_NAMES = {
  am: 'AM',
  pm: 'PM',
};

const TimeField = ({
  // Element ID.
  id,

  // Element class.
  className,

  // CSS style object.
  style,

  // Time text.
  value,

  // Indicator for time format either 12 or 24 hour.
  isHour12 = false,

  // Separator between numbers.
  colon = DEFAULT_COLON,

  // Names for am/pm.
  amPmNames = DEFAULT_AM_PM_NAMES,

  // Update time text.
  onChange,

  placeHolder,

  title,
}: TimeFieldProps) => {
  // Input element reference.
  const inputRef = useRef<HTMLInputElement>(null);

  // Section for the selected ranged of time numbers.
  const [section, setSection] = useState<TimeSection>();

  // Indicator for where the event was triggered.
  const [eventFlag, setEventFlag] = useState<EventFlg>('');

  // Always save value as 24 hour format even though it can be displayed in 12 hour format.
  // Use with onChange handler.
  const formatTimeTextTo24Hour = useCallback(
    (value: string) => formatTimeText(value, amPmNames, false, DEFAULT_COLON),
    [amPmNames]
  );

  // Hooks to track the hour number change.
  const [hourDigit, setHourDigit, isHourUpdated, resetHour] = useTimeNumber(
    'hour',
    isHour12
  );

  // Hooks to track the minute number change.
  const [minuteDigit, setMinuteDigit, isMinuteUpdated, resetMinute] =
    useTimeNumber('minute');

  // Hooks to track the second number change.
  const [secondDigit, setSecondDigit, isSecondUpdated, resetSecond] =
    useTimeNumber('second');

  // Hooks to control the timeText to display
  const { timeText, initialTime, tickTime, updateTime, setAmPm, reset } =
    useTime(value, colon, isHour12, amPmNames);

  // Array of range info for each time number: all, hour, minute, second and amPm.
  const selectionRanges = useMemo(
    () => getSelectionRanges(timeText),
    [timeText]
  );

  // Handle timeText when input.
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();

    setEventFlag('onKeyDown');

    const key = e.key;

    // When text is empty.
    if (timeText === '') {
      // Initialize time to current time on arrow keys.
      if (
        key === KeyEnum.ArrowUp ||
        key === KeyEnum.ArrowDown ||
        key === KeyEnum.ArrowLeft ||
        key === KeyEnum.ArrowRight
      ) {
        e.preventDefault();
        initialTime();
        setSection('hour');
      }

      // Initialize time with hour on any number key.
      else if (!isNaN(Number(key))) {
        e.preventDefault();
        setHourDigit(Number(key));
        setSection('hour');
      }
      // Pass.
    }

    // If not empty
    else {
      // Move selectionRange to previous section.
      if (e.shiftKey && key === KeyEnum.Tab) {
        if (!(section === 'hour' || section === 'all')) {
          e.preventDefault();
          backwardSection();
        }
      }

      // Move selectionRange to next section.
      else if (key === KeyEnum.Tab) {
        if (
          (isHour12 && section !== 'amPm') ||
          (!isHour12 && section !== 'second')
        ) {
          e.preventDefault();
          forwardSection();
        }
      }

      // Move selectionRange to previous or next section.
      else if (key === KeyEnum.ArrowRight || key === KeyEnum.ArrowLeft) {
        const { selectionStart, selectionEnd } = e.currentTarget;
        if (selectionStart === null || selectionEnd === null) return;

        // Move selectionRange to next section.
        if (key === KeyEnum.ArrowRight) {
          const cursorPosition = selectionEnd + 1;
          const cursorSection = findCursorSection(
            cursorPosition,
            cursorPosition
          );
          setSection(cursorSection);
        }

        // Move selectionRange to previous section.
        else {
          const cursorPosition = selectionStart - 1;
          const cursorSection = findCursorSection(
            cursorPosition,
            cursorPosition
          );
          setSection(cursorSection);
        }
      }

      // Increase or decrease the selected time number.
      else if (key === KeyEnum.ArrowUp || key === KeyEnum.ArrowDown) {
        e.preventDefault();
        if (!section) return;

        // Increase number.
        if (key === KeyEnum.ArrowUp) {
          tickTime(section, 'up');
        }

        // Decrease number.
        else {
          tickTime(section, 'down');
        }
      }

      // Reset value to empty.
      else if (key === KeyEnum.Escape || key === KeyEnum.Backspace) {
        resetHour();
        resetMinute();
        resetSecond();
        reset();
      }

      // Finish update.
      else if (key === KeyEnum.Enter) {
        inputRef.current?.blur();
      }

      // Handling number keys.
      else if (!isNaN(Number(key))) {
        e.preventDefault();
        if (!section) return;

        // Get minute value.
        if (section === 'minute') {
          setMinuteDigit(Number(key));
        }

        // Get second value.
        else if (section === 'second') {
          setSecondDigit(Number(key));
        }

        // Keep the current value and move on.
        else if (section === 'amPm') {
          forwardSection();
        }

        // Get hour value.
        else {
          setSection('hour');
          setHourDigit(Number(key));
        }
      }

      // Handle am pm values in special cases
      if (isHour12) {
        // Update am pm value to am
        if (
          section === 'amPm' &&
          !e.ctrlKey &&
          !e.shiftKey &&
          !e.altKey &&
          amPmNames.am.toLocaleLowerCase().startsWith(key)
        ) {
          e.preventDefault();
          setAmPm(amPmNames.am);
        }

        // Update am pm value to am
        else if (
          section === 'amPm' &&
          !e.ctrlKey &&
          !e.shiftKey &&
          !e.altKey &&
          amPmNames.pm.toLocaleLowerCase().startsWith(key)
        ) {
          e.preventDefault();
          setAmPm(amPmNames.pm);
        }

        // Handling exceptional cases
        else if (
          section === 'amPm' &&
          !e.ctrlKey &&
          !e.shiftKey &&
          !e.altKey &&
          amPmNames.pm.toLocaleLowerCase().includes(key)
        ) {
          e.preventDefault();
        }

        // Handling exceptional cases
        else if (
          section === 'amPm' &&
          !e.ctrlKey &&
          !e.shiftKey &&
          !e.altKey &&
          String(key).length === 1
        ) {
          e.preventDefault();
        }
      }
    }
  };

  // Handle time number section on cursor change.
  const handleSelect = (e: MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setEventFlag('onSelect');

    if (value === '') return;

    // Set new time number section depending on the current selection.
    const { selectionStart, selectionEnd } = e.currentTarget;
    if (selectionStart === null || selectionEnd === null) return;
    const section = findCursorSection(selectionStart, selectionEnd);
    setSection(section);
  };

  /**
   * Find the corresponding time number section to the given selection range.
   * @param start The start position of the selected range.
   * @param end The end position of the selected range.
   * @returns {string} Name of the time number section.
   */
  const findCursorSection = (
    start: number,
    end: number
  ): TimeSection | undefined => {
    if (selectionRanges === null) return undefined;

    // Normalize value to avoid overflow.
    start = start > timeText.length ? timeText.length : start < 0 ? 0 : start;
    end = end > timeText.length ? timeText.length : end < 0 ? 0 : end;

    // Find the corresponding range to the start and the end positions.
    const [allRange, ...ranges] = selectionRanges;
    const sectionRange = ranges.find((r) => start >= r.start && end <= r.end);

    if (sectionRange) {
      return sectionRange.name;
    }

    return allRange.name;
  };

  // Move to the next time number section.
  const forwardSection = useCallback(() => {
    if (section === 'all') {
      setSection('hour');
    }

    // Hour to minute.
    else if (section === 'hour') {
      setSection('minute');
    }

    // Minute to second.
    else if (section === 'minute') {
      setSection('second');
    }

    // Second to amPm or , focus out.
    else if (section === 'second') {
      // If hour format is 12 hour, continue with amPm.
      if (isHour12) {
        setSection('amPm');
      }
      // If hour format is 24 hour, focus out.
      else {
        inputRef.current?.blur();
      }
    }

    // Focus out.
    else {
      inputRef.current?.blur();
    }
  }, [section, isHour12]);

  // Move to the previous time number section.
  const backwardSection = () => {
    // Minute to hour.
    if (section === 'minute') {
      setSection('hour');
    }

    // Second to minute.
    else if (section === 'second') {
      setSection('minute');
    }

    // AmPm to second.
    else if (section === 'amPm') {
      setSection('second');
    }

    // Focus out.
    else {
      inputRef.current?.blur();
    }
  };

  // Update selection range regarding to the selected time section.
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

  // Handle updating selection range on the selected time section change.
  useEffect(() => {
    section && setRange(section);
  }, [section, setRange]);

  // Handle on hour digit number change.
  useEffect(() => {
    // Move to minute.
    if (isHourUpdated) {
      forwardSection();
    }

    if (hourDigit === undefined) return;

    updateTime('hour', hourDigit);
  }, [hourDigit, updateTime, forwardSection, isHourUpdated]);

  // Handle on minute digit number change.
  useEffect(() => {
    // Move to second.
    if (isMinuteUpdated) {
      forwardSection();
    }
    if (minuteDigit === undefined) return;

    updateTime('minute', minuteDigit);
  }, [minuteDigit, updateTime, forwardSection, isMinuteUpdated]);

  // Handle on second digit number change.
  useEffect(() => {
    // Move to amPm or focus out.
    if (isSecondUpdated) {
      forwardSection();
    }

    if (secondDigit === undefined) return;

    updateTime('second', secondDigit);
  }, [secondDigit, updateTime, forwardSection, isSecondUpdated, isHour12]);

  // Handle on timeText change.
  useEffect(() => {
    // Update value only if timeText was updated by keyDown event.
    if (eventFlag === 'onKeyDown') {
      const text = formatTimeTextTo24Hour(timeText);
      if (text !== null) {
        onChange(text);
      }
    }
  }, [eventFlag, timeText, onChange, formatTimeTextTo24Hour]);

  // Handle when the element is focused out.
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setEventFlag('onBlur');

    // Queue update into stack so it is triggered after default action.
    setTimeout(() => {
      setSection(undefined);

      // Reformat time text to 24 hour format.
      const text = formatTimeTextTo24Hour(e.target.value);
      if (text !== null) {
        onChange(text);
      }
    }, 1);
  };

  // Handle when input value is changed.
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setEventFlag('onChange');

    // Reformat time text to 24 hour format.
    const text = formatTimeTextTo24Hour(e.target.value);
    if (text !== null) {
      onChange(text);
    }
  };

  return (
    <input
      id={id}
      className={className}
      style={style}
      placeholder={placeHolder}
      title={title}
      ref={inputRef}
      type="text"
      value={timeText}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onSelect={handleSelect}
    />
  );
};

export default memo(TimeField);
