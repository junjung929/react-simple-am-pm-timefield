const rangeNames = ['hour', 'minute', 'second'];

export const validTimeText = (timeText: string) => {
  const pattern =
    /^([01][0-9]|2[0-3])(\.|:)[0-5][0-9](\.|:)[0-5][0-9]( .{2,})?$/;
  return pattern.test(timeText);
};

export const getRanges = (
  timeText: string
): Record<
  string,
  {
    start: number;
    end: number;
    value: number | string;
  }
> | null => {
  // valid time text
  const isValid = validTimeText(timeText);

  if (!isValid) return null;
  const [time, amPm] = timeText.split(' ');

  const pattern = /\d\d/g;
  const matches = time.match(pattern) || [];

  if (matches.length !== 3) return null;

  const ranges: Record<
    string,
    {
      start: number;
      end: number;
      value: number | string;
    }
  > = matches.reduce((prev, current, index) => {
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
    const amPm = h < 12 ? amPmNames.am : amPmNames.pm;
    return timeToString(h % 12, m, s, colon) + ' ' + amPm;
  }

  return timeToString(h, m, s, colon);
};

const timeToString = (
  hours: number,
  minutes: number,
  seconds: number,
  separator: ':'
) => {
  const h = normalizeTimeNum(hours);
  const m = normalizeTimeNum(minutes);
  const s = normalizeTimeNum(seconds);
  return [h, m, s].join(separator);
};

const normalizeTimeNum = (num: number) => {
  return num < 10 ? '0' + num : num;
};
