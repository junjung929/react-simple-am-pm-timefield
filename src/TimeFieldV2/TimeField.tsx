import React, {
  ChangeEvent,
  CSSProperties,
  ForwardedRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { TimeSelectionName, TimeSelectionRanges } from './TimeField.types';
import { formatTimeText, getSelectionRanges } from './TimeField.utils';

interface TimeFieldProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>, value: string) => void;
  isHour12?: boolean;
  colon?: ':' | '.';
  amPmNames?: {
    am: string;
    pm: string;
  };
  id?: string;
  className?: string;
  style?: CSSProperties;
  placeholder?: string;
  title?: string;
  forwardedRef?: ForwardedRef<HTMLInputElement>;
  ref: ForwardedRef<HTMLInputElement>;
}

type TimeSection = TimeSelectionName;

const DEFAULT_COLON = ':';
const DEFAULT_AM_PM_NAMES = {
  am: 'AM',
  pm: 'PM',
};

const TimeField = ({
  onChange,
  value,
  amPmNames = DEFAULT_AM_PM_NAMES,
  className,
  colon = DEFAULT_COLON,
  forwardedRef,
  id,
  isHour12 = false,
  placeholder,
  style,
  title,
}: TimeFieldProps) => {
  // Input element reference.
  const inputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (forwardedRef) {
      if (typeof forwardedRef === 'function') {
        forwardedRef(inputRef.current);
      } else {
        (forwardedRef as any).current = inputRef.current;
      }
    }
  }, [inputRef, forwardedRef]);

  const [inputText, setInputText] = useState('');

  const [ranges, setRanges] = useState<TimeSelectionRanges | null>(null);

  const [section, setSection] = useState<TimeSection>();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    const { selectionStart, selectionEnd } = e.currentTarget;
    console.log({ selectionEnd, selectionStart });

    const timeText = formatTimeText(newText, amPmNames, false, DEFAULT_COLON);
    if (timeText) {
      setInputText(timeText);
    }
  };

  useEffect(() => {
    setSection('hour');
  }, []);

  useEffect(() => {
    const timeText = formatTimeText(inputText, amPmNames, isHour12, colon);
    if (timeText) {
      setInputText(timeText);
    }
  }, [inputText, amPmNames, isHour12, colon]);

  useEffect(() => {
    const r = getSelectionRanges(inputText);
    setRanges(r);
  }, [inputText]);

  useEffect(() => {
    if (ranges === null || section === undefined) {
      return;
    }
    const range = ranges.find((r) => r.name === section);
    if (range) {
      inputRef.current?.setSelectionRange(range.start, range.end);
    }
  }, [ranges, section]);

  return (
    <input
      type="text"
      ref={inputRef}
      onChange={handleChange}
      value={inputText}
      {...{ style, title, id, className, placeholder }}
    />
  );
};

export default React.forwardRef<HTMLInputElement, TimeFieldProps>(
  (props, ref) => <TimeField {...props} forwardedRef={ref} />
);
