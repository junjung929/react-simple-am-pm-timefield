import React, { useEffect, useState } from 'react';
import './App.css';
import TimeField, { TimeFieldWithHook } from './TimeField';

function App() {
  const [value, setValue] = useState('');
  useEffect(() => {
    console.log({ value });
  }, [value]);

  const handleChange = (text: string) => {
    setValue(text);
  };
  return (
    <div className="App">
      {/* <TimeField value={value} onChange={handleChange} isHour12={true} /> */}
      <br />
      <TimeFieldWithHook
        value={value}
        onChange={handleChange}
        isHour12={false}
      />
      <br />
      <input
        type="time"
        step="1"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
}

export default App;
