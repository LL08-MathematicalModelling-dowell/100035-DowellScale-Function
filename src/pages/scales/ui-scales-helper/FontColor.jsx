export default function FontColor({name,text,formData,handleChange}){
    const value = formData && formData[name] ? formData[name] : "#000000";
   
    return(
        <div className="flex flex-col gap-5 mb-[10px]">
                    <label htmlFor={name} className="font-medium text-[13px] sm:text-[16px]">{text}</label>
                    <input 
                    label={text}
                    name={name}
                    autoComplete="given-name"
                    type="color"
                    placeholder={text}
                    value={value}
                onChange={(e)=>handleChange(e.target.name,e.target.value)}
                className={`${window.innerWidth<500 ? "w-[200px]" :"w-[280px]"}  rounded-none `}
                style={{ boxShadow: '0 0 0 6px white' }}
                    />
         </div>
    )
}