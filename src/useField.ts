import { useState } from 'react';

const useField = (defaultValue: string) => {
  const [value, setValue] = useState(defaultValue);
  const handleChange = (text: string) => {
    setValue(text);
  };
  return [value, handleChange] as [string, (t: string) => void];
};

export default useField;
