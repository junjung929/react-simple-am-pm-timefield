import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import TimeField, { formatTimeText, generateTimeTextFromDate } from '.';
import { KeyEnum } from './TimeField.types';

const DEFAULT_AM_PM_NAMES = {
  am: 'AM',
  pm: 'PM',
};
const DEFAULT_COLON = ':';

const TestComponent = ({ defaultValue = '' }: { defaultValue?: string }) => {
  const handleChange = (text: string) => {
    setValue(text);
  };

  const label24h = '24h';
  const label12h = '12h';
  const [value, setValue] = useState(defaultValue);
  return (
    <div>
      <label htmlFor="test24">{label24h}</label>
      <TimeField
        onChange={handleChange}
        value={value}
        id="test24"
        isHour12={false}
        amPmNames={DEFAULT_AM_PM_NAMES}
        colon={DEFAULT_COLON}
      />
      <label htmlFor="test12">{label12h}</label>
      <TimeField
        onChange={handleChange}
        value={value}
        id="test12"
        isHour12={true}
        amPmNames={DEFAULT_AM_PM_NAMES}
        colon={DEFAULT_COLON}
      />
    </div>
  );
};

const gen24hTime = (date: Date) =>
  generateTimeTextFromDate(date, DEFAULT_AM_PM_NAMES, false, DEFAULT_COLON);

const gen12hTime = (date: Date) =>
  generateTimeTextFromDate(date, DEFAULT_AM_PM_NAMES, true, DEFAULT_COLON);

const format24hTime = (text: string) =>
  formatTimeText(text, DEFAULT_AM_PM_NAMES, false, DEFAULT_COLON);

const format12hTime = (text: string) =>
  formatTimeText(text, DEFAULT_AM_PM_NAMES, true, DEFAULT_COLON);

describe('Test TimeField component', () => {
  describe('Starting from empty', () => {
    it('creates an empty time text', () => {
      render(<TestComponent />);
      const timeField24h = screen.getByLabelText('24h');
      const timeField12h = screen.getByLabelText('12h');
      expect(timeField24h).toHaveValue('');
      expect(timeField12h).toHaveValue('');
    });

    describe('Initializing time text on', () => {
      describe('Arrow key down - current time', () => {
        [
          KeyEnum.ArrowDown,
          KeyEnum.ArrowLeft,
          KeyEnum.ArrowRight,
          KeyEnum.ArrowUp,
        ].forEach((key) => {
          test(`'${key}'`, () => {
            render(<TestComponent />);

            const timeField24h = screen.getByLabelText('24h');
            const timeField12h = screen.getByLabelText('12h');

            const date = new Date();
            fireEvent.keyDown(timeField24h, { key });

            const timeText24h = gen24hTime(date);
            const timeText12h = gen12hTime(date);

            expect(timeField24h).toHaveValue(timeText24h);
            expect(timeField12h).toHaveValue(timeText12h);
          });
        });
      });

      describe('Character key down - current time', () => {
        [
          'a',
          'b',
          'c',
          'd',
          'e',
          'f',
          'g',
          'h',
          'i',
          'j',
          'k',
          'l',
          'm',
          'n',
          'o',
          'p',
          'q',
          'r',
          's',
          't',
          'u',
          'v',
          'w',
          'x',
          'y',
          'z',
        ].forEach((key) => {
          test(`'${key}'`, () => {
            render(<TestComponent />);

            const timeField24h = screen.getByLabelText('24h');
            const timeField12h = screen.getByLabelText('12h');

            fireEvent.keyDown(timeField24h, { key });

            expect(timeField24h).toHaveValue('');
            expect(timeField12h).toHaveValue('');
          });
        });
      });

      describe('Number key down - current time with corresponding hour', () => {
        describe('24 hour format', () => {
          [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((n) => {
            const digit = n < 3 ? n * 10 : '0' + n;
            test(`'${n}' set to '${digit}'`, () => {
              render(<TestComponent />);

              const timeField24h = screen.getByLabelText('24h');

              const date = new Date();
              fireEvent.keyDown(timeField24h, { key: n });

              if (n < 3) {
                date.setHours(n * 10);
              } else {
                date.setHours(n);
              }
              const timeText24h = gen24hTime(date);

              expect(timeField24h).toHaveValue(timeText24h);
            });
          });
        });

        describe('12 hour format', () => {
          [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((n) => {
            const digit = n < 2 ? n * 10 : '0' + n;
            test(`'${n}' set to '${digit}'`, () => {
              render(<TestComponent />);

              const timeField12h = screen.getByLabelText('12h');

              const date = new Date();
              fireEvent.keyDown(timeField12h, { key: n });

              if (n < 2) {
                date.setHours(n * 10);
              } else {
                date.setHours(n);
              }
              const timeText12h = gen12hTime(date);

              expect(timeField12h).toHaveValue(timeText12h);
            });
          });
        });
      });

      describe('Set value', () => {
        describe('Valid input - set to given value', () => {
          ['12:25:30', '11:25:30', '11.25.30']
            .reduce((prev, current) => {
              const am = [current, DEFAULT_AM_PM_NAMES.am].join(' ');
              const pm = [current, DEFAULT_AM_PM_NAMES.pm].join(' ');
              return [...prev, current, am, pm];
            }, [] as string[])
            .forEach((text) => {
              const timeText24h = format24hTime(text);
              const timeText12h = format12hTime(text);
              test(`'${text}' set to '${timeText24h}' (24 hour format) / '${timeText12h}' (12 hour format)`, () => {
                render(<TestComponent />);

                const timeField24h = screen.getByLabelText('24h');
                const timeField12h = screen.getByLabelText('12h');

                fireEvent.change(timeField24h, { target: { value: text } });

                expect(timeField24h).toHaveValue(timeText24h);
                expect(timeField12h).toHaveValue(timeText12h);
              });
            });
        });

        describe('Invalid input - set to empty', () => {
          ['as 11:25:30', 'asdas', 'a 10lrie 20 30', '10:4323 or'].forEach(
            (text) => {
              test(`'${text}' set to empty string`, () => {
                render(<TestComponent />);

                const timeField24h = screen.getByLabelText('24h');
                const timeField12h = screen.getByLabelText('12h');

                fireEvent.change(timeField24h, { target: { value: text } });

                expect(timeField24h).toHaveValue('');
                expect(timeField12h).toHaveValue('');
              });
            }
          );
        });
      });
    });
  });

  describe('When value exists', () => {
    describe('Arrow key down', () => {
      test('up, right, up - update hour and minute by 1 for each', () => {
        const date = new Date();

        const defaultValue = gen12hTime(date) || '';

        render(<TestComponent defaultValue={defaultValue} />);

        const timeField12h = screen.getByLabelText('12h');

        expect(timeField12h).toHaveValue(defaultValue);

        fireEvent.select(timeField12h, {
          target: { selectionStart: 0, selectionEnd: 0 },
        });
        fireEvent.keyDown(timeField12h, { key: KeyEnum.ArrowUp });
        fireEvent.keyDown(timeField12h, { key: KeyEnum.ArrowRight });
        fireEvent.keyDown(timeField12h, { key: KeyEnum.ArrowUp });

        date.setHours(date.getHours() + 1);
        date.setMinutes(date.getMinutes() + 1);

        const updateValue = gen12hTime(date);
        expect(timeField12h).toHaveValue(updateValue);
      });

      test('up, right, up, right, up - update hour, minute and second by 1 for each', () => {
        const date = new Date();

        const defaultValue = gen12hTime(date) || '';

        render(<TestComponent defaultValue={defaultValue} />);

        const timeField12h = screen.getByLabelText('12h');

        expect(timeField12h).toHaveValue(defaultValue);

        fireEvent.select(timeField12h, {
          target: { selectionStart: 0, selectionEnd: 0 },
        });
        fireEvent.keyDown(timeField12h, { key: KeyEnum.ArrowUp });
        fireEvent.keyDown(timeField12h, { key: KeyEnum.ArrowRight });
        fireEvent.keyDown(timeField12h, { key: KeyEnum.ArrowUp });
        fireEvent.keyDown(timeField12h, { key: KeyEnum.ArrowRight });
        fireEvent.keyDown(timeField12h, { key: KeyEnum.ArrowUp });

        date.setHours(date.getHours() + 1);
        date.setMinutes(date.getMinutes() + 1);
        date.setSeconds(date.getSeconds() + 1);

        const updateValue = gen12hTime(date);
        expect(timeField12h).toHaveValue(updateValue);
      });
    });

    describe('Set value', () => {
      describe('Valid input - set to new value', () => {
        ['12:25:30', '11:25:30', '11.25.30']
          .reduce((prev, current) => {
            const am = [current, DEFAULT_AM_PM_NAMES.am].join(' ');
            const pm = [current, DEFAULT_AM_PM_NAMES.pm].join(' ');
            return [...prev, current, am, pm];
          }, [] as string[])
          .forEach((text) => {
            const date = new Date();
            const defaultValue = gen12hTime(date) || '';

            const timeText24h = format24hTime(text);
            const timeText12h = format12hTime(text);
            test(`'${text}' - '${defaultValue}' set to '${timeText24h}' (24 hour format) / '${timeText12h}' (12 hour format)`, () => {
              render(<TestComponent defaultValue={defaultValue} />);

              const timeField24h = screen.getByLabelText('24h');
              const timeField12h = screen.getByLabelText('12h');

              fireEvent.change(timeField24h, { target: { value: text } });

              expect(timeField24h).toHaveValue(timeText24h);
              expect(timeField12h).toHaveValue(timeText12h);
            });
          });
      });

      describe('Invalid input - set to default value', () => {
        ['as 11:25:30'].forEach((text) => {
          const date = new Date();

          const defaultValue = gen12hTime(date) || '';
          test(`'${text}' - '${defaultValue}' set to '${defaultValue}' (12 hour format)`, () => {
            render(<TestComponent defaultValue={defaultValue} />);

            const timeField12h = screen.getByLabelText('12h');

            fireEvent.change(timeField12h, { target: { value: text } });

            expect(timeField12h).toHaveValue(defaultValue);
          });
        });
      });
    });
  });
});
