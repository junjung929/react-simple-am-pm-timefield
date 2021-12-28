export type TimeSeparator = ':' | '.';

export type TimeSelectionNames = ['hour', 'minute', 'second', 'amPm', 'all'];

export interface AmPmNames {
  am: string;
  pm: string;
}

interface TimeSelectionRange {
  name: TimeSelectionNames[number];

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
