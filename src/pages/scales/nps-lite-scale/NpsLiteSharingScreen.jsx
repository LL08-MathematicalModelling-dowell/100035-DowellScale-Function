
import copyData from "../../../utils/npxLiteCopyToClipboard";
import { PiGlobeHemisphereWestFill } from "react-icons/pi";
import { MdEmail } from "react-icons/md";
import { HiMiniCube } from "react-icons/hi2";
import {useState} from "react"
import WebsiteScreen from "./WebisteScreen";
import EmailScreen from "./EmailScreen";
import emailCopy from "../../../utils/emailNpxLite";
import ProductScreen from "./ProductScreen";

export default function NpsLiteSharingScreen({setFinished,buttonLinks}){
    const[showData,setShowData]=useState("")
    const websiteCodeToCopy=copyData(buttonLinks)
    const emailCodeToCopy=emailCopy(buttonLinks)
    return(
        <>
        <div className="flex flex-col justify-center items-center bg-[#E8E8E8] rounded-lg  w-[70%] flex-wrap  p-5  relative" 
                style={{ fontFamily: 'Roboto, sans-serif' }}>
                    <p className="font-normal md:font-medium text-[12px] md:text-[16px]">Share your NPS LITE SCALE across different platforms and add to your customer touch points</p>
                    <div className="flex justify-center items-center gap-5 mt-10 text-white font-medium text-[12px] md:text-[16px]">
                        <button className={`${showData=="website"? "bg-[#129561]" :"bg-[#00a3ff]" } flex justify-center items-center gap-2 px-2 p-1 lg:px-8 rounded `}
                        onClick={()=>{setShowData("website")}}><PiGlobeHemisphereWestFill/> Website</button>
                        <button  className={`${showData=="email"? "bg-[#129561]" :"bg-[#00a3ff]" } flex justify-center items-center gap-2 px-2 p-1 lg:px-8 rounded `}
                        onClick={()=>{setShowData("email")}}><MdEmail/> Email</button>
                        <button  className={`${showData=="product"? "bg-[#129561]" :"bg-[#00a3ff]" } flex justify-center items-center gap-2  px-2 p-1 lg:px-8 rounded `}
                        onClick={()=>{setShowData("product")}}><HiMiniCube/> Product</button>
                    </div>
                    {showData=="website" && (
                       <WebsiteScreen codeToCopy={websiteCodeToCopy} buttonLinks={buttonLinks}/>
                    )}
                    {showData=="email" && (
                       <EmailScreen codeToCopy={emailCodeToCopy} buttonLinks={buttonLinks}/>
                    )}
                  
                  {showData=="product" && (
                       <ProductScreen codeToCopy={websiteCodeToCopy} buttonLinks={buttonLinks}/>
                    )}
                            
             
                    <button className=" bg-[#129561] p-2 px-8 rounded mt-10 text-white font-bold"
                    onClick={()=>setFinished(true)}>Finish Up</button>
                </div>
        </>
    )
}