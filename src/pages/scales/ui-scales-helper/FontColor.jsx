export default function FontColor({name,text,formData,handleChange}){
    const value = formData && formData[name] ? formData[name] : "#000000";
   
    return(
        <div className="flex flex-col gap-5 mb-3">
                    <label htmlFor={name} className="font-medium">{text}</label>
                    <input 
                    label={text}
                    name={name}
                    autoComplete="given-name"
                    type="color"
                    placeholder={text}
                    value={value}
                onChange={(e)=>handleChange(e.target.name,e.target.value)}
                className={` w-[280px] rounded-none `}
                style={{ boxShadow: '0 0 0 6px white' }}
                    />
         </div>
    )
}