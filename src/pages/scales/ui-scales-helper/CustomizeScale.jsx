import { Fragment,useState } from "react";
import FontColor from "./FontColor";
import FontOptions from "./FontOptions";
import { fontStyles } from "../../../utils/fontStyles"


export default function CustomizeScale({formData,setFormData,setStep}){
    const[empty,setEmpty]=useState({
        orientation: false,
        fontStyle: false,
        fontFormat:false,
       pointersText:[],
       textError:false
    })

    const orientations = ['Vertical', 'Horizontal']
    const format = ['Text', 'Emotions']
    const pointers=["2 Point Scale","3 Point Scale","4 Point Scale","5 Point Scale","7 Point Scale","9 Point Scale"]
    const fontSizes=[10,12,14,16,18,20,22,24,28,30,32]

    function handleChange(name,value){
       
        if (name.includes("pointersText")) {
            let index = parseInt(name[name.length - 1], 10); // Convert the index to an integer
            setFormData((prev) => {
                let updatedPointersText = [...prev.pointersText];
                updatedPointersText[index] = value;
                return {
                    ...prev,
                    pointersText: updatedPointersText
                };
            });
            setEmpty((prev)=>{
                let arr = [...prev.pointersText];
                if(value.length>0)
                arr[index] = false;
            else
            arr[index]=true
                return {
                    ...prev,
                    pointersText: arr
                };
               })   
        return;
        }

               setFormData((prev)=>({
                    ...prev,[name]:value
                })) 
                if(String(value).length>0)
                setEmpty((prev)=>({
                 ...prev,[name]:false
                }))    
         }

         function handleNext() {
            let error = false;
        
      
            if (!formData.orientation) {
                setEmpty(prev => ({ ...prev, orientation: true }));
                error = true;
            }
        
            if (!formData.fontStyle) {
                setEmpty(prev => ({ ...prev, fontStyle: true }));
                error = true;
            }
        
            if (!formData.fontFormat) {
                setEmpty(prev => ({ ...prev, fontFormat: true }));
                error = true;
            }
        
      
            if(formData.pointersText.includes(true) || formData.pointersText.length==0){
                error = true;
                setEmpty(prev => ({ ...prev, textError: true }));
            }else{
                setEmpty(prev => ({ ...prev, textError: false }));
            }
                   
             
        
            if (error) return;
                setStep(prev => prev + 1);
        }



    return(
        <div className="flex flex-col gap-5 mt-10 ml-5">
            <div>
                <style>

                </style>
               <FontOptions name="orientation" text="Scale Orientation" txt="orientation" formData={formData} options={orientations} handleChange={handleChange}/>
               {empty.orientation && <p className="text-xs text-red-600 p-1">**required</p>}
               </div>
               <div className="flex justify-between items-center gap-10 w-max">
                <div>
                <FontOptions name="fontStyle" text="Font Style" txt="font style" options={fontStyles} formData={formData} handleChange={handleChange}/>
                {empty.fontStyle && <p className="text-xs text-red-600 p-1">**required</p>}
                </div>
                <FontColor name="fontColor" text="Font Color" formData={formData} handleChange={handleChange}/>
                <FontOptions name="fontSize" text="Font Size" txt="font size"  options={fontSizes} formData={formData} handleChange={handleChange}/>
                </div>
                <div>
                <FontOptions name="fontFormat" text="Format" txt="format" options={format} formData={formData} handleChange={handleChange}/>
                {empty.fontFormat && <p className="text-xs text-red-600 p-1">**required</p>}
                </div>
                {/* <div className="flex justify-between items-center gap-16 w-[80%]">
                {[{value:"Left Value",name:"leftText"},{value:"Center Value",name:"centerText"},{value:"Right Value",name:"rightText"}].map((obj,index)=>(
                    <div key={index} className="flex flex-col gap-2 justify-center">
                   <label htmlFor={obj.name}
                    className="font-medium w-[280px] "
                   >{obj.value}</label>
                   <input type="text" name={obj.name} placeholder="Enter value"
                   onChange={(e)=>{handleChange(e.target.name,e.target.value)}}
                    className="p-2 font-light " value={formData[obj.name]}/>
                     {empty[obj.name] && <p className="text-xs text-red-600 p-1">**required</p>}
                   </div>
                ))}
                 </div> */}
                <div className="flex justify-between items-center gap-16 w-max">
                {/* {["Left Scale Color","Center Scale Color","Right Scale Color"].map((scale,index)=>(
                      <Fragment key={index}>
                    <FontColor  name={scale === "Left Scale Color" ? "leftColor" : scale === "Right Scale Color" ? "rightColor" :"centerColor"} formData={formData} text={scale} handleChange={handleChange}/>
                    </Fragment>
                ))} */}
                 {["Scale Color","Scale Background Color",].map((scale,index)=>(
                      <Fragment key={index}>
                    <FontColor  name={scale === "Scale Color" ? "scaleColor" : "scaleBackGroundColor"} formData={formData} text={scale} handleChange={handleChange}/>
                    </Fragment>
                ))}
                </div>
                <div>
                <FontOptions name="likertPointers" text="Scale Pointer" txt="pointers" options={pointers} formData={formData} handleChange={handleChange}/>
               
                </div>
                {/* <div  className="flex flex-col gap-2 justify-center">
                   <label htmlFor="timer"
                    className="font-medium "
                   >Toggle set timer</label>
                   <input type="text" name="timer" placeholder="Enter value" className="p-2 font-light  w-[280px]"
                   onChange={(e)=>handleChange(e.target.name,e.target.value)}/>
                    {empty.timer && <p className="text-xs text-red-600 p-1">**required</p>}
                 </div> */}
                {formData.likertPointers && (
                    < div className="flex flex-col gap-4">
                    <div className="grid grid-cols-3  gap-6 justify-center">
                        {Array.from({ length: formData.likertPointers[0] }).map((_, index) => (
                            <div className="flex flex-col gap-2 justify-center">
                            <label htmlFor={`pointersText${index}`}
                                className="font-medium "
                            >Scale Pointer {index+1}</label>
                          <input type="text" name={`pointersText${index}`} placeholder="Enter text value" value={formData.pointersText[index]} className="p-2 font-light  w-[280px]"
                          onChange={(e)=>handleChange(e.target.name,e.target.value)}/>
                          </div>
                        ))}
                        
                    </div>
                    {empty.textError && (
                        <p className="text-xs text-red-600 p-1">Please fill all the fields of scale text</p>
                    )}
                    </div>
                )}
                  <div className="w-full flex justify-center items-center gap-5 mt-5" >        
                        <button className="bg-gray-400 p-2 px-20 rounded " onClick={()=>setStep((prev)=>prev-1)}>Previous</button>
                        <button className="bg-green-600 p-2 px-20 rounded " onClick={()=>handleNext()}>Next</button>    
                    </div>
               
        </div>
    )
}