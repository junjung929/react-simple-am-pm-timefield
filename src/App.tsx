import React, { useEffect } from 'react';
import './App.css';
import TimeField from './TimeField';
import useField from './useField';

function App() {
  const [emptyValue, handleEmptyChange] = useField('');

  useEffect(() => {
    const input = document.getElementById('hour12');
    input?.focus();
  }, []);

  return (
    <div className="App">
      <header className="header">
        <h1>React Simple AM/PM Time Field</h1>
      </header>
      <div className="demo-box">
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
              value={emptyValue}
              onChange={handleEmptyChange}
              isHour12={true}
              id="hour12"
              className="time"
            />
          </div>
          <div className="demo-time time-hour24">
            <label htmlFor="hour24">24h: </label>
            <TimeField
              value={emptyValue}
              onChange={handleEmptyChange}
              isHour12={false}
              id="hour24"
              className="time"
            />
          </div>
          <div className="time-value">
            <label>Time Text: </label>
            <span className="time-text">{emptyValue}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
