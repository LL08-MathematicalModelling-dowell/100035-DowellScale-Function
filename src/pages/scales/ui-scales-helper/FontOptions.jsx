import { IoMdArrowDropdownCircle } from "react-icons/io";


export default function FontOptions({ name, text, options, txt, formData, handleChange }) {

  const value = formData && formData[name] ? formData[name] : "";
console.log(value)
  return (
    <div className="flex flex-col gap-3 relative w-max">
      <label htmlFor={name} className="font-medium text-[13px] sm:text-[16px]">{text}</label>
      <div className="relative">
        <select
          id={name}
          name={name}
          className={`appearance-none block text-md ${name === "fontSize" ? "w-[80px]" :`${window.innerWidth<500 ? "w-[200px]" :"w-[280px]"}`} text-[#989093] font-light border border-[#DDDADB] p-2 pr-10`}
          value={value}
          onChange={(e) => {
            handleChange(e.target.name, e.target.value);
        
          }}
        >
          {name !== "fontSize" && <option value="">-- Select {txt} --</option>}
          {options.map((opt, i) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </select>
       
          <span className={`absolute top-1/2  pointer-events-none right-2 ${name !== "fontSize" ? "transform -translate-y-1/2" :" top-1/3" }`}>
            <IoMdArrowDropdownCircle />
          </span>
      
      </div>
    </div>
  );
}
