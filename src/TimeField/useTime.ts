import { useEffect, useState } from 'react';

const useTime = (
  isHour12: boolean,
  amPmNames: { am: string; pm: string },
  colon: ':' = ':'
) => {
  const [value, setValue] = useState('');
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);

  useEffect(() => {
    const text = timeToText(hour, minute, second);
    setValue(text);
  }, [hour, minute, second]);

  const increamentHour = (num: number) => {
    setHour((prev) => (prev + num) % 24);
  };

  const initialTime = () => {
    const date = new Date();

    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();

    setHour(h);
    setMinute(m);
    setSecond(s);
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

  return { value, initialTime };
};

export default useTime;
