import React from 'react';
import { useField } from 'formik';

export default function TextInput ({ label, ...props }) {
    const [field, meta] = useField(props);
    return (
        <div className="grid grid-cols-1">
            <label htmlFor={props.id || props.name} className="text-sm font-normal mb-1 ml-1">{label}</label>
            <input className="w-full  text-[#989093] text-sm font-light py-2 px-2 outline-0 rounded-[8px] border border-[#DDDADB] pl-4 " {...field} {...props} />
            {meta.touched && meta.error ? (
                <p className="text-red-500">{meta.error}</p>
            ) : null}
        </div>
    );
};
