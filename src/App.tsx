import React, { useState } from 'react';
import './App.css';
import TimeField, { TimeFieldWithHook } from './TimeField';

function App() {
  const [value, setValue] = useState('');
  console.log(value);

  const handleChange = (text: string) => {
    setValue(text);
  };
  return (
    <div className="App">
      <TimeField value={value} onChange={handleChange} isHour12={true} />
      <br />
      <TimeFieldWithHook
        value={value}
        onChange={handleChange}
        isHour12={true}
      />
      <br />
      <input type="time" step="1" />
    </div>
  );
}

export default App;
