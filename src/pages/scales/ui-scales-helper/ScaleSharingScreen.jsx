
import reactCode from "../../../utils/reactCode";
import { PiGlobeHemisphereWestFill } from "react-icons/pi";
import { MdEmail } from "react-icons/md";
import { HiMiniCube } from "react-icons/hi2";
import {useState} from "react"
import emailCode from "../../../utils/emailCode";
import ProductScreen from "./ProductScreen";
import ScaleOutputScreen from "./ScaleOutputScreen";

export default function ScaleSharingScreen({setFinished,buttonLinks,text,formData}){
    let ratings;
    if (text.includes("LITE")) {
        ratings=["Bad","Average", "Excellent"]
    } else if (text.includes("STAPEL")) {
        ratings=[-5,-4,-3,-2,-1,1,2,3,4,5]
    } else if (text.includes("LIKERT")) {
        ratings=["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
    } else {
        ratings=[0,1,2,3,4,5,6,7,8,9,10]
    }
   
    console.log(buttonLinks)
    const[showData,setShowData]=useState("")
    let websiteCodeToCopy
    if(text.includes("LIKERT"))
     websiteCodeToCopy=reactCode(buttonLinks,formData.pointersText,formData)
    else
    websiteCodeToCopy=reactCode(buttonLinks,ratings,formData)
    const emailCodeToCopy=emailCode(buttonLinks,ratings)
    return(
        <>
        <div className="flex flex-col justify-center items-center bg-[#E8E8E8] rounded-lg  w-[70%] flex-wrap  p-5  relative" 
                style={{ fontFamily: 'Roboto, sans-serif' }}>
                    <p className="font-normal lg:font-medium text-[12px] md:text-[16px]">{text}</p>
                    <div className="flex justify-center items-center gap-5 mt-10 text-white font-medium text-[12px] md:text-[16px]">
                        <button className={`${showData=="website"? "bg-[#129561]" :"bg-[#00a3ff]" } flex justify-center items-center gap-2 px-2 p-1 lg:px-8 rounded `}
                        onClick={()=>{setShowData("website")}}><span className="hidden md:block"><PiGlobeHemisphereWestFill/></span> Website</button>
                        <button  className={`${showData=="email"? "bg-[#129561]" :"bg-[#00a3ff]" } flex justify-center items-center gap-2 px-2 p-1 lg:px-8 rounded `}
                        onClick={()=>{setShowData("email")}}><span className="hidden md:block"><MdEmail/></span> Email</button>
                        <button  className={`${showData=="product"? "bg-[#129561]" :"bg-[#00a3ff]" } flex justify-center items-center gap-2  px-2 p-1 lg:px-8 rounded `}
                        onClick={()=>{setShowData("product")}}><span className="hidden md:block"><HiMiniCube/></span> Product</button>
                    </div>
                    {text.includes("LIKERT") ? (
                       <>
                       {showData=="website" && (
                       <ScaleOutputScreen codeToCopy={websiteCodeToCopy} buttonLinks={buttonLinks} ratings={formData.pointersText}/>
                    )}
                       </>
                    ):(
                        <>
                        {showData=="website" && (
                       <ScaleOutputScreen codeToCopy={websiteCodeToCopy} buttonLinks={buttonLinks} ratings={ratings}/>
                    )}
                        </>
                    )}
                    
                    {showData=="email" && (
                       <ScaleOutputScreen codeToCopy={emailCodeToCopy} buttonLinks={buttonLinks} ratings={ratings}/>
                    )}
                  
                  {showData=="product" && (
                     <ScaleOutputScreen codeToCopy={websiteCodeToCopy} buttonLinks={buttonLinks} ratings={ratings}/>
                    //    <ProductScreen codeToCopy={websiteCodeToCopy} buttonLinks={buttonLinks}/>
                    )}
                            
             
                    <button className=" bg-[#129561] p-2 px-8 rounded mt-10 text-white font-bold"
                    onClick={()=>setFinished(true)}>Finish Up</button>
                </div>
        </>
    )
}