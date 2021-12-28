import React, { useEffect, useState } from 'react';
import './App.css';
import TimeField, { TimeFieldWithHook } from './TimeField';

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
      <TimeFieldWithHook
        value={value}
        onChange={handleChange}
        isHour12={true}
      />
      <p>{value}</p>
    </div>
  );
}

export default App;
