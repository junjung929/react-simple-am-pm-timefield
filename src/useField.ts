import { useEffect, useState } from 'react';

type ChangeHandler = (value: string) => void;

const useField = (defaultValue: string) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleChange: ChangeHandler = (value) => {
    setValue(value);
  };
  return [value, handleChange] as [string, ChangeHandler];
};

export default useField;
