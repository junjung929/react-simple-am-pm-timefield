export type TimeSeparator = ':' | '.';

export type TimeSelectionNames = ['hour', 'minute', 'second', 'amPm'];

export interface TimeFieldSelection {
  start: number;
  end: number;
  name: TimeSelectionNames[number];
}
export interface TimePeriod {
  am: string;
  pm: string;
}

export interface TimeFormatOptions {
  separator?: TimeSeparator;
  isHour12?: boolean;
  periods: TimePeriod; // text for indicating am/pm
}

export interface AmPmNames {
  am: string;
  pm: string;
}

interface TimeSelectionRange {
  name: TimeSelectionNames[number];
  start: number;
  end: number;
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
  | [HourTimeRange, MinuteTimeRange, SecondTimeRange, AmPmTimeRange]
  | [HourTimeRange, MinuteTimeRange, SecondTimeRange];
