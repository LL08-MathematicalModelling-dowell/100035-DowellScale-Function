import React from 'react'

const CustomTextInput = ({ label, name, value, type, placeholder, handleChange, ...props }) => {
  return (
    <div className='flex flex-col gap-2'>
        <label htmlFor={name}>{label}</label>
        <input 
            {...props}
            name={name}
            type={type}
            placeholder={placeholder}
            className='w-full outline-0 border py-1 px-1 rounded-sm text-gray-700'
            value={value}
            onChange={handleChange}
        />
    </div>
  )
}

export default CustomTextInput