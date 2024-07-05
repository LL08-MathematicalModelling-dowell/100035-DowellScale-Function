import scaleconfirmedimage from "../../../../src/assets/scaleconfirmed.png"
import handleSharing from "../../../utils/handleSharing";
import { useState } from "react";
export default function ConfirmationScale({formData,setButtonLinks,setButtonLinksGenerated,text}){

    const[submitted,setSubmitted]=useState(false)
    const[err,setErr]=useState("")
    let scaleType;
console.log(text)
if (text.includes("LITE")) {
    scaleType = "nps_lite";
} else if (text.includes("STAPEL")) {
    scaleType = "stapel";
} else if (text.includes("LIKERT")) {
    scaleType = "likert";
} else {
    scaleType = "nps";
}

  
    return(
        <>
        <div>
        <style>
                        {`
                       @keyframes spin {
                        to {
                          transform: rotate(360deg);
                        }
                      }
                      
                      .loader {
                        display: inline-block;
                        width: 20px;
                        height: 20px;
                        border: 3px solid rgba(255, 255, 255, 0.3);
                        border-radius: 50%;
                        border-top-color: #fff;
                        animation: spin 1s linear infinite;
                      }
                      
                      
                          
                        `}
                    </style>
                 <p className="w-full  font-medium text-[12px] md:text-[16px] text-center">{text}</p>
                 <div className="flex flex-col justify-center items-center gap-3 mt-10">
                    <img src={scaleconfirmedimage}  alt='image'></img>
                    <p className="font-medium text-[12px] md:text-[14px] text-center">You can start sharing your scale on different platforms</p>
                    <button className=" font-medium p-2 px-12 bg-[#129561] rounded mt-12 text-white"
                    onClick={()=>{handleSharing(formData,setButtonLinks,setButtonLinksGenerated,scaleType,setSubmitted,setErr)}}>
                         {submitted==true ? <div className="loader"></div> : "Start Sharing"}</button>
                         {err.length>0 && <p>{err}</p>}
                 </div>
                </div>
        </>
    )
}