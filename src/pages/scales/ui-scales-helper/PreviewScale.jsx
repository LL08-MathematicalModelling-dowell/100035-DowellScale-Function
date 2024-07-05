export default function PreviewScale({formData,setStep,scale,setConfirmScale}){

    if(formData.likertPointers[0]=="9")
       formData.pointersText=["😞", "😔"," 😌"," 😕", "😐 ", "🙂", "😄 ", "😃 ", "😁 "]
    else if(formData.likertPointers[0]=="9" && window.innerWidth<1000)
        formData.pointersText=["😞  ", "😌  ", "😔 ", "😐 ", "🙂  ", "😄 ", "😁  "]
    else if(formData.likertPointers[0]=="5" && window.innerWidth<800)
        formData.pointersText=["😞", "😔 ", "😐 ", "😄 ", "😁 "]
    console.log(formData.likertPointers[0])
    return(
        <div className="flex flex-col gap-5 mt-10 flex-wrap w-[100%] overflow-auto">
         
        <p className="font-bold p-2">Your {scale} is ready</p>
        <div className="flex flex-col gap-5  justify-start items-center">
       
        <div className="flex flex-col justify-center items-center gap-5 border border-slate-600 p-2 sm:p-5 flex-wrap">
      
        <p className="font-medium  text-[12px] sm:text-[16px] flex flex-wrap text-center">How was your experience using our product? Please rate your experience below.</p>
        <div className={`${formData.orientation=="Vertical" ? "flex flex-col gap-5" : "flex gap-1 sm:gap-4 xl:gap-10"}  flex justify-center items-center gap-1 sm:gap-3  p-1 md:p-4 lg:px-8 border-2 border-[#bfbfbf] w-max`}
        style={{backgroundColor:formData.scaleBackGroundColor}}>
            {/* <button className={`p-2 px-12 font-medium rounded-lg`}
            style={{
                backgroundColor:formData.leftColor,
                fontFamily: formData.fontStyle,
                color: formData.fontColor,
                fontSize:Number(formData.fontSize)
            }}> {formData.leftText}</button>
            <button className={`p-2 px-12 font-medium rounded-lg `}
             style={{
                backgroundColor:formData.centerColor,
                fontFamily: formData.fontStyle,
                color: formData.fontColor,
                fontSize:Number(formData.fontSize)
            }}
            >{formData.centerText}</button>
            <button className={`p-2 px-12 font-medium rounded-lg `}
              style={{
                backgroundColor:formData.rightColor,
                fontFamily: formData.fontStyle,
                color: formData.fontColor,
                fontSize:Number(formData.fontSize)
            }}>{formData.rightText}</button> */}
            {Array.from({ length: formData.likertPointers[0] }).map((_, index) => (
                             <button  className={`py-[8px] px-[2px] sm:p-1  rounded xl:p-2 md:px-2 ${formData.orientation=="Horizontal" ?"w-max" : "w-full"} `}
                             style={{
                               backgroundColor:formData.scaleColor,
                               fontFamily: formData.fontStyle,
                               color: formData.fontColor,
                               fontSize:Number(formData.fontSize)
                           }}>{formData.pointersText[index]}</button> 
                        ))}
        </div>
        </div>
        </div>
        <div className="flex justify-center items-center gap-4 sm:gap-10 mt-5">
                    <button className="bg-gray-500 p-2 sm:px-8 text-white font-medium" onClick={()=>setStep((prev)=>prev-1)}>Previous</button>
                    <button className="bg-green-600 p-2 sm:px-8 text-white font-medium" onClick={()=>setConfirmScale(true)}>Confirm</button>
        </div>
        </div>
    )
}