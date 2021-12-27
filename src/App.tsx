import React, { useState } from 'react';
import './App.css';
import TimeField from './TimeField';

function App() {
  const [value, setValue] = useState('');

  const handleChange = (text: string) => {
    setValue(text);
  };
  return (
    <div className="App">
      <TimeField value={value} onChange={handleChange} isHour12={true} />
      <input type="time" step="1" />
    </div>
  );
}

export default App;
