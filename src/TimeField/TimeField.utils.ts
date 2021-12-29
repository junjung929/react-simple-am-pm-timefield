import {
  AmPmNames,
  TimeSelectionRanges,
  TimeSeparator,
} from './TimeField.types';

const rangeNames = ['hour', 'minute', 'second'];

/**
 * Check if the given text is valid for time format.
 *
 * @param timeText Formatted time text, e.g. 12:23:15 AM or 15:12:10.
 * @returns Returns true if the given text is valid for time format. Otherwise returns false.
 */
export const validateTimeText = (timeText: string) => {
  const pattern =
    // Hour between 0 - 23
    // Separator "." or ":"
    // Minute between 0 - 59
    // Second between 0 - 59
    // Am/Pm letters (optional)
    /^([01][0-9]|2[0-3])(\.|:)[0-5][0-9](\.|:)[0-5][0-9]( .{2,})?$/;
  return pattern.test(timeText);
};

/**
 * Extract numbers of hour, minute and second
 *
 * @param timeText Formatted time text, e.g. 12:23:15 AM or 15:12:10.
 * @param amPmNames Object of names of AM / PM
 * @returns Array of numbers: hour, minute, second
 */
export const getTimeNumbers = (
  timeText: string,
  amPmNames: AmPmNames
): [number, number, number] | null => {
  // Valid time text.
  const isValid = validateTimeText(timeText);

  if (!isValid) return null;

  // Split time and am/pm text.
  const [time, amPm] = timeText.split(' ');

  // Split hour, minute and second
  const pattern = /\d\d/g; // Match every two digit number
  const matches = time.match(pattern);

  // The length must be 3.
  if (matches === null || matches.length !== 3) return null;

  // Convert to number
  const numbers = matches.map((m) => Number(m)) as [number, number, number];

  // Normalize if it's 12 hour format
  if (amPm) {
    // Check the time is am or pm
    if (amPm.toLowerCase() === amPmNames.pm.toLowerCase()) {
      const [hour, ...rest] = numbers;
      // Pm hours 12 - 23
      return [(hour % 12) + 12, ...rest];
    } else if (amPm.toLowerCase() === amPmNames.am.toLowerCase()) {
      const [hour, ...rest] = numbers;
      // Am hours 0 - 11
      return [hour % 12, ...rest];
    }
  }

  // 24 hour format.
  return numbers;
};

export const generateDateFromTimeText = (
  text: string,
  amPmNames: AmPmNames
) => {
  // When value not set.
  if (text === '') return;

  // Get time numbers from text.
  const numbers = getTimeNumbers(text, amPmNames);

  if (numbers === null) return;

  // Save to time value as date type
  const [h, m, s] = numbers;
  return new Date(0, 0, 0, h, m, s);
};

export const generateTimeTextFromDate = (
  date: Date | undefined,
  amPmNames: AmPmNames,
  isHour12: boolean = false,
  colon: TimeSeparator
) => {
  if (date === undefined) return '';

  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();

  // If it's 12 hour format.
  if (isHour12) {
    // Set am when hour between 0 - 11.
    // Set pm when hour between 12 - 23.
    const amPm = h >= 0 && h < 12 ? amPmNames.am : amPmNames.pm;

    // Normalize hour number to 12 hour format.
    const hour = h % 12 === 0 ? 12 : h % 12;
    const tText = timeToString(hour, m, s, colon) + ' ' + amPm;
    return tText;
  }

  // If it's 24 hour format.
  const tText = timeToString(h, m, s, colon);
  return tText;
};

export const formatTimeText = (
  text: string,
  amPmNames: AmPmNames,
  isHour12: boolean = false,
  colon: TimeSeparator
) => {
  const date = generateDateFromTimeText(text, amPmNames);
  const timeText = generateTimeTextFromDate(date, amPmNames, isHour12, colon);
  return timeText;
};

/**
 * Convert time numbers to time string.
 *
 * @param hour
 * @param minute
 * @param second
 * @param separator
 * @returns Returns time string.
 */
const timeToString = (
  hour: number,
  minute: number,
  second: number,
  separator: TimeSeparator
) => {
  // Normalize time numbers to two digit strings.
  const h = normalizeTimeNum(hour);
  const m = normalizeTimeNum(minute);
  const s = normalizeTimeNum(second);

  // Join number string to one time string.
  return [h, m, s].join(separator);
};

/**
 * Normalize the given number to two digit string.
 * @param num
 * @returns Returns two digit string.
 */
const normalizeTimeNum = (num: number) => {
  return num < 10 ? '0' + num : num;
};

/**
 * Map the given time text to get ranges of hour, minute, and second.
 * Also get the entire range of the given time text and that of amPm.
 *
 * @param timeText Formatted time text, e.g. 12:23:15 AM or 15:12:10.
 * @returns Returns array of object containing start position and end position.
 */
export const getSelectionRanges = (
  timeText: string
): TimeSelectionRanges | null => {
  // Valid time text
  const isValid = validateTimeText(timeText);

  if (!isValid) return null;
  const [time, amPm] = timeText.split(' ');

  // Split hour, minute and second
  const pattern = /\d\d/g; // Match every two digit number
  const matches = time.match(pattern);

  // The length must be 3.
  if (matches === null || matches.length !== 3) return null;

  // Entire range of time text.
  const all = {
    name: 'all',
    start: 0,
    end: timeText.length,
  };

  // Map ranges of hour, minute and second text.
  const ranges = matches.map((current, index) => {
    const name = rangeNames[index];

    const start = time.indexOf(
      current,
      // Avoid overlapped value.
      index * current.length
    );
    const end = start + current.length;

    return {
      name,
      start,
      end,
      value: Number(current),
    };
  });

  // If am/pm exists
  if (amPm) {
    const start = timeText.indexOf(amPm);
    const end = start + amPm.length;

    return [
      all,
      ...ranges,
      {
        name: 'amPm',
        start,
        end,
        value: amPm,
      },
    ] as TimeSelectionRanges;
  }
  return [all, ...ranges] as TimeSelectionRanges;
};
