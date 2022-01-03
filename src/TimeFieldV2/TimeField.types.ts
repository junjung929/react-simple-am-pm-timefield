export type TimeSeparator = ':' | '.';

export type TimeSelectionName = 'hour' | 'minute' | 'second' | 'amPm' | 'all';

export interface AmPmNames {
  am: string;
  pm: string;
}

interface TimeSelectionRange {
  name: TimeSelectionName;

  // Start position of time
  start: number;

  // End position of time
  end: number;
}

interface AllTimeRange extends TimeSelectionRange {
  name: 'all';
}

interface NumberTimeRange extends TimeSelectionRange {
  value: number;
}
interface HourTimeRange extends NumberTimeRange {
  name: 'hour';
}
interface MinuteTimeRange extends NumberTimeRange {
  name: 'minute';
}
interface SecondTimeRange extends NumberTimeRange {
  name: 'second';
}
interface AmPmTimeRange extends TimeSelectionRange {
  name: 'amPm';
  value: string;
}

export type TimeSelectionRanges =
  | [
      AllTimeRange,
      HourTimeRange,
      MinuteTimeRange,
      SecondTimeRange,
      AmPmTimeRange
    ]
  | [AllTimeRange, HourTimeRange, MinuteTimeRange, SecondTimeRange];

export enum KeyEnum {
  Tab = 'Tab',
  ArrowUp = 'ArrowUp',
  ArrowDown = 'ArrowDown',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
  Escape = 'Escape',
  Backspace = 'Backspace',
  Enter = 'Enter',
}
