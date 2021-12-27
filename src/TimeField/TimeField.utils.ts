import {
  AmPmNames,
  TimeSelectionRanges,
  TimeSeparator,
} from './TimeField.types';

const rangeNames = ['hour', 'minute', 'second'];

const MID_HOUR = 12;

interface TimeSelectionRange {
  start: number;
  end: number;
}

interface NumberTimeRange extends TimeSelectionRange {
  value: number;
}
interface AmPmTimeRange extends TimeSelectionRange {
  value: string;
}

type TimeRanges = Record<string, NumberTimeRange | AmPmTimeRange>;

export const validateTimeText = (timeText: string) => {
  const pattern =
    /^([01][0-9]|2[0-3])(\.|:)[0-5][0-9](\.|:)[0-5][0-9]( .{2,})?$/;
  return pattern.test(timeText);
};

export const getTimeNumbers = (
  timeText: string,
  amPmNames: AmPmNames
): [number, number, number] | null => {
  // valid time text
  const isValid = validateTimeText(timeText);

  if (!isValid) return null;

  const [time, amPm] = timeText.split(' ');

  // Split hour, minute and second
  const pattern = /\d\d/g;
  const matches = time.match(pattern);

  if (matches === null || matches.length !== 3) return null;

  // Convert to number
  const numbers = matches.map((m) => Number(m)) as [number, number, number];

  // Normalize hour if it's afternoon
  if (amPm === amPmNames.pm) {
    const [hour, ...rest] = numbers;
    return [hour + MID_HOUR, ...rest];
  }
  return numbers;
};

export const getRanges = (timeText: string): TimeRanges | null => {
  // valid time text
  const isValid = validateTimeText(timeText);

  if (!isValid) return null;
  const [time, amPm] = timeText.split(' ');

  const pattern = /\d\d/g;
  const matches = time.match(pattern) || [];

  if (matches.length !== 3) return null;

  const ranges: TimeRanges = matches.reduce((prev, current, index) => {
    const start = time.indexOf(current);
    const end = start + current.length;
    return {
      ...prev,
      [rangeNames[index]]: {
        start,
        end,
        value: Number(current),
      },
    };
  }, {});

  if (amPm) {
    const start = timeText.indexOf(amPm);
    const end = start + amPm.length;
    ranges.amPm = {
      start,
      end,
      value: amPm,
    };
  }
  return ranges;
};

export const initialTime = (
  isHour12: boolean,
  amPmNames: { am: string; pm: string },
  colon: ':'
) => {
  const date = new Date();
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();

  if (isHour12) {
    const amPm = h < MID_HOUR ? amPmNames.am : amPmNames.pm;
    return timeToString(h % MID_HOUR, m, s, colon) + ' ' + amPm;
  }

  return timeToString(h, m, s, colon);
};

export const timeToString = (
  hours: number,
  minutes: number,
  seconds: number,
  separator: TimeSeparator
) => {
  const h = normalizeTimeNum(hours);
  const m = normalizeTimeNum(minutes);
  const s = normalizeTimeNum(seconds);
  return [h, m, s].join(separator);
};

const normalizeTimeNum = (num: number) => {
  return num < 10 ? '0' + num : num;
};

export const getSelectionRanges = (
  timeText: string
): TimeSelectionRanges | null => {
  // valid time text
  const isValid = validateTimeText(timeText);

  if (!isValid) return null;
  const [time, amPm] = timeText.split(' ');

  const pattern = /\d\d/g;
  const matches = time.match(pattern);

  if (matches === null || matches.length !== 3) return null;

  const ranges = matches.map((current, index) => {
    const name = rangeNames[index];
    const start = time.indexOf(current);
    const end = start + current.length;

    return {
      name,
      start,
      end,
      value: Number(current),
    };
  });

  if (amPm) {
    const start = timeText.indexOf(amPm);
    const end = start + amPm.length;
    return [
      ...ranges,
      {
        name: 'amPm',
        start,
        end,
        value: amPm,
      },
    ] as TimeSelectionRanges;
  }
  return ranges as TimeSelectionRanges;
};
