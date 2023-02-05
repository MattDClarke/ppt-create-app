import { useState } from 'react';

// when called, an initial value will be passed in
const useInputState = (initialVal) => {
  const [value, setValue] = useState(initialVal);
  const handleChange = (e) => {
    setValue(e.target.value);
  };
  const reset = () => {
    setValue('');
  };
  return [value, handleChange, reset];
};

export default useInputState;
