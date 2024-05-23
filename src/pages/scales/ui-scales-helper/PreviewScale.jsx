export default function PreviewScale({formData,setStep,scale,setConfirmScale}){
    console.log(formData.scaleBackGroundColor)
    return(
        <div className="flex flex-col gap-5 mt-10 flex-wrap">
         
        <p className="font-bold p-2">Your {scale} is ready</p>
        <div className="flex flex-col gap-5  justify-center items-center">
        <style scoped>
              {
                `
                .border-changes{
                    width: 200px;
                }

                @media(min-width:528px){
                .border-changes{
                    width: 400px;
                }
            }
                @media(min-width:866px){
                    .border-changes{
                        width: max-content;
                    } 
                }
                `
              }
            </style>
        <div className="flex flex-col justify-center items-center gap-5 w-max border border-slate-600 p-5 flex-wrap border-changes overflow-auto">
      
        <p className="font-medium p-2 w-max">How was your experience using our product? Please rate your experience below.</p>
        <div className={`${formData.orientation=="Vertical" ? "flex flex-col gap-5" : "flex gap-10"}  p-1 md:p-4 lg:px-8 border-2 border-[#bfbfbf] w-max`}
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
                             <button  className=" text-[12px] md:text-[14px] py-[8px] px-[2px] sm:p-1  sm:px-2 rounded md:p-2 md:px-4  " 
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
        <div className="flex justify-center items-center gap-10 mt-5">
                    <button className="bg-gray-500 p-2 px-8 text-white font-medium" onClick={()=>setStep((prev)=>prev-1)}>Previous</button>
                    <button className="bg-green-600 p-2 px-8 text-white font-medium" onClick={()=>setConfirmScale(true)}>Confirm</button>
        </div>
        </div>
    )
}