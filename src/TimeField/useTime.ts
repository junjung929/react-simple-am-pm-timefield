import { useEffect, useMemo, useState } from 'react';
import { getRanges, validateTimeText } from './TimeField.utils';

const useTime = (
  value: string,
  isHour12: boolean,
  amPmNames: { am: string; pm: string },
  colon: ':' = ':'
) => {
  const ranges = useMemo(() => getRanges(value), [value]);
  const [timeText, setTimeText] = useState('');
  const [hour, setHour] = useState<number>();
  const [minute, setMinute] = useState<number>();
  const [second, setSecond] = useState<number>();

  useEffect(() => {
    if (ranges === null) return;

    const h = ranges['hour'].value as number;
    const m = ranges['minute'].value as number;
    const s = ranges['second'].value as number;
    updateTime(h, m, s);
  }, [ranges]);

  useEffect(() => {
    if (hour === undefined || minute === undefined || second === undefined)
      return;
    const text = timeToText(hour, minute, second);
    setTimeText(text);
  }, [hour, minute, second]);

  const updateTime = (h: number, m: number, s: number) => {
    setHour(h);
    setMinute(m);
    setSecond(s);
  };
  const increamentHour = (num: number) => {
    setHour((prev) => ((prev || 0) + num) % 24);
  };

  const initialTime = () => {
    const date = new Date();

    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();

    updateTime(h, m, s);
  };

  const timeToText = (h: number, m: number, s: number) => {
    if (isHour12) {
      const amPm = h % 24 < 12 ? amPmNames.am : amPmNames.pm;
      return timeToString(h % 12, m, s) + ' ' + amPm;
    }

    return timeToString(h % 24, m, s);
  };

  const timeToString = (hours: number, minutes: number, seconds: number) => {
    const h = normalizeTimeNum(hours);
    const m = normalizeTimeNum(minutes);
    const s = normalizeTimeNum(seconds);
    return [h, m, s].join(colon);
  };

  const normalizeTimeNum = (num: number) => {
    return num < 10 ? '0' + num : num;
  };

  return { value: timeText, initialTime };
};

export default useTime;
