import React, { ChangeEvent, useEffect, useMemo, useRef } from 'react';
import './App.css';
import TimeField, { generateTimeTextFromDate } from './TimeField';
import useField from './useField';

function App() {
  const [customValue, setCustomValue] = useField('');
  const [radioValue, setRadioValue] = useField('');
  const initialValue = useMemo(() => {
    if (radioValue === 'empty') return '';
    else if (radioValue === 'current')
      return generateTimeTextFromDate(
        new Date(),
        { am: 'AM', pm: 'PM' },
        false,
        ':'
      );
    return customValue;
  }, [radioValue, customValue]);
  const [value, setValue] = useField(initialValue || '');

  const myRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    myRef.current?.focus();
  }, []);

  return (
    <div className="App">
      <header className="header">
        <h1>React Simple AM/PM Time Field</h1>
      </header>
      <div className="demo-box">
        <h3 style={{ textAlign: 'left' }}>Initial text</h3>
        <div
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setRadioValue(e.target.value);
          }}
        >
          <input
            type="radio"
            name="initial"
            value="empty"
            id="empty"
            defaultChecked
          />
          <label htmlFor="empty">Empty</label>
          <input type="radio" name="initial" value="current" id="current" />
          <label htmlFor="current">Current time</label>
          <input type="radio" name="initial" value="custom" id="custom" />
          <label htmlFor="custom">Custom: </label>
          <input
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder="hh:mm:ss tt"
          />
        </div>
        <div className="demo-grid">
          <div className="demo-instruction">
            <h4>Feature list</h4>
            <ol>
              <li>Initialize value with arrow keys or number keys</li>
              <li>Increase or decrease value with up and down keys</li>
              <li>Change value with number keys</li>
              <li>Move selection with left and right keys</li>
              <li>Move selection with tab key</li>
              <li>Select all text and paste new time text</li>
              <li>Reset with ESC or Backspace</li>
              <li>Finish with Enter</li>
            </ol>
          </div>
          <div className="demo-time time-hour12">
            <label htmlFor="hour12">12h: </label>
            <TimeField
              ref={myRef}
              value={value}
              onChange={setValue}
              isHour12={true}
              id="hour12"
              className="time"
            />
          </div>
          <div className="demo-time time-hour24">
            <label htmlFor="hour24">24h: </label>
            <TimeField
              value={value}
              onChange={setValue}
              isHour12={false}
              id="hour24"
              className="time"
            />
          </div>
          <div className="demo-time time-colon">
            <label htmlFor="colon">colon: </label>
            <TimeField
              value={value}
              onChange={setValue}
              isHour12={false}
              colon="."
              id="colon"
              className="time"
            />
          </div>
          <div className="time-value">
            <label>Time Text: </label>
            <span className="time-text">{value}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
