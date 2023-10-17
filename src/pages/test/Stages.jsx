import React, { useState } from 'react';

function stages() {
  const [count, setCount] = useState(1);
  const [inputs, setInputs] = useState([]);
  const [values, setValues] = useState([]);

  const handleAddInput = () => {
    setInputs([...inputs, count]);
    setValues([...values, '']);
    setCount(count + 1);
  };

  const handleInputChange = (index, value) => {
    const updatedValues = [...values];
    updatedValues[index] = value;
    setValues(updatedValues);
  };

  const handleLogContent = () => {
    console.log(values);
  };
  console.log(values);

  return (
    <div>
      <div className='flex flex-col gap-5 my-10'>
        <button onClick={handleAddInput} className='px-5 py-1 bg-primary text-white'>Add Input</button>
        <button onClick={handleLogContent} className='px-5 py-1 bg-primary text-white'>Log Contents</button>
      </div>
      <br />
      {inputs.map((input, index) => (
        <div key={input}>
          <input
            type="text"
            value={values[index]}
            onChange={(e) => handleInputChange(index, e.target.value)}
            className='border border-2'
          />
        </div>
      ))}
    </div>
  );
}

export default stages;
