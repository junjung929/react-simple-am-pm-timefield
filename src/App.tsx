import React, { useEffect, useState } from 'react';
import './App.css';
import TimeField from './TimeField';

function App() {
  const [value, setValue] = useState('');
  useEffect(() => {
    console.log('App value change', { value });
  }, [value]);

  const handleChange = (text: string) => {
    setValue(text);
  };

  return (
    <div className="App">
      <TimeField value={value} onChange={handleChange} isHour12={true} />
      <br />
      <TimeField value={value} onChange={handleChange} isHour12={false} />
      <br />
      <input
        type="time"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
      />
      <p>{value}</p>
    </div>
  );
}

export default App;
