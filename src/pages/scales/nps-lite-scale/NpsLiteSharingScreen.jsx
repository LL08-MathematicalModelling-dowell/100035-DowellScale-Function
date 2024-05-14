
import copyData from "../../../utils/npxLiteCopyToClipboard";

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
        <div className="flex flex-col justify-center items-center bg-[#E8E8E8] rounded-lg  h-max w-[80%] p-5  relative" 
                style={{ fontFamily: 'Roboto, sans-serif' }}>
                    <p className="font-medium">Share your NPS LITE SCALE across different platforms and add to your customer touch points</p>
                    <div className="flex justify-center items-center gap-5 mt-10 text-white font-medium">
                        <button className={`${showData=="website"? "bg-[#129561]" :"bg-[#00a3ff]" }  p-1 px-8 rounded `}
                        onClick={()=>{setShowData("website")}}>Website</button>
                        <button  className={`${showData=="email"? "bg-[#129561]" :"bg-[#00a3ff]" }  p-1 px-8 rounded `}
                        onClick={()=>{setShowData("email")}}>Email</button>
                        <button  className={`${showData=="product"? "bg-[#129561]" :"bg-[#00a3ff]" }  p-1 px-8 rounded `}
                        onClick={()=>{setShowData("product")}}>Product</button>
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