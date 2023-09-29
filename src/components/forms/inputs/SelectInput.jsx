import React from 'react';
import { useField } from 'formik';

export default function SelectInput({ label, ...props }) {
    const [field, meta] = useField(props);
    return (
        <div>
            <label htmlFor={props.id || props.name} className="text-sm font-normal mb-1 ml-1">{label}</label>
            <select className="appearance-none block w-full mt-1 text-[#989093] 
            text-sm font-light py-2 px-2 outline-0 rounded-[8px] border border-[#DDDADB] pl-4" {...field} {...props} />
            {meta.touched && meta.error ? (
                <div className="text-red-500">{meta.error}</div>
            ) : null}
        </div>
    );
}
