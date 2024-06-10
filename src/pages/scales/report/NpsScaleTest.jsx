import React from 'react'
import { useState, useEffect} from 'react';
import { useSearchParams } from "react-router-dom";
import axios from "axios"
const NpsScaleTest = () => {
   const[submitted,setSubmitted]=useState(-1)
  const [searchParams, setSearchParams] = useSearchParams();
  const workspaceId=searchParams.get("workspace_id")
  const scaleId=searchParams.get("scale_id")
  const channelName=searchParams.get("channel_name")
  const instanceName=searchParams.get("instance_name")

  async function submit(index){
setSubmitted(index)
    const headers = {
        "Content-Type": "application/json"
    };


    const body = {
        "scale_id":scaleId,
        "workspace_id": workspaceId,
        "username": "CustomerSupport",
        "scale_type": "nps_lite",
        "user_type": true,
        "score": index,
        "channel": channelName,
        "instance": instanceName
    };

    try {
        const response = await axios.post("https://100035.pythonanywhere.com/nps-lite/api/v5/nps-lite-create-response/", body, { headers });
    
        if(response.data.success=="true"){
          console.log("redirecting.....")
        window.location.href=response.data.redirect_url
       }
    } catch (error) {
        console.error("Error submitting response:", error.response ? error.response.data : error.message);
    }
}

  return (
    <div className='flex flex-col justify-center items-center font-sans font-medium p-3 mt-5 text-base m-auto w-full'>
      <p className="flex justify-center items-center font-sans font-medium p-3 mt-5 text-[12px] sm:text-[18px] text-orange-600">
        Would you like to use our product/ service?
      </p>
      
      <div className="flex border md:p-5 p-2 justify-center items-center mt-5">
      <div className="flex justify-center items-center gap-6 md:gap-12 text-[12px] sm:text-[14px] md:text-[18px]">
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
        <button
          className="bg-[#ff4a4a] rounded-lg   p-[9px] sm:p-2 sm:px-6 md:p-4 md:px-12  sm:font-medium cursor-pointer"
          onClick={() => submit(0)}
        >
           {submitted==0 ? <div className="loader"></div> : "Bad 😞"}
          
        </button>
        <button
          className="bg-[#f3dd1f] rounded-lg p-[9px] sm:p-2 sm:px-6 md:p-4 md:px-12   sm:font-medium cursor-pointer"
          onClick={() => submit(1)}
        >
           {submitted==1 ? <div className="loader"></div> : " Average 😐"}
        
        </button>
        <button
          className="bg-[#129561] rounded-lg p-[9px] sm:p-2 sm:px-6 md:p-4 md:px-12  sm:font-medium cursor-pointer"
          onClick={() => submit(2)}
        >
           {submitted==2 ? <div className="loader"></div> : "Excellent 😄"}
          
        </button>
      </div>
      </div>
    </div>
  )
}

export default NpsScaleTest
