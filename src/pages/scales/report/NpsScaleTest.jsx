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
  let instanceId
  if(instanceName){
 
    const match = instanceName.match(/(\d+)$/);
    instanceId = match ? parseInt(match[0], 10) : -1;
  }
else
  {
    return(
      <>
      <p className="w-screen h-screen font-bold flex justify-center items-center">Invalid Shop/Stand Number..</p>
      </>
    )
  }
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
        "channel_name": channelName,
        "instance_name": instanceName
    };

    try {
        const response = await axios.post("https://100035.pythonanywhere.com/nps-lite/api/v5/nps-lite-create-response/", body, { headers });
    
        if(response.data.success=="true"){
          console.log("redirecting.....")
        window.location.href=response.data.redirect_url
       }
    } catch (error) {
        console.error("Error submitting response:", error.response ? error.response.data : error.message);
        setSubmitted(-2)
       
    }
}

  return (
    <div className="min-h-screen flex flex-col  items-center bg-gray-100 sm:p-4 w-screen">
    <p className=" text-[16px] sm:text-[20px] font-bold mt-20">Give your feedback</p>
    <p className="mt-8 text-[14px] font-medium">Stand/Shop Number</p>
    <p className="w-[80px] sm:w-[150px] border-2 h-[30px] sm:h-[50px] mt-2 rounded-3xl flex items-center justify-center font-medium">{instanceId}</p>
    <div className="flex flex-col justify-center items-center font-sans font-medium sm:p-3 mt-28 text-[20px] text-[#E45E4C]">
      <p className="font-sans sm:font-bold font-medium text-[14px] sm:text-[20px] text-[#E45E4C] text-center">
        Would you like to use our products/services
      </p>
    </div>
     
      
      <div className="flex border md:p-5 p-2 justify-center items-center mt-10">
      <div className="flex justify-center items-center gap-6 md:gap-12 text-[14px] md:text-[18px]">
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
          className="bg-[#ff4a4a] rounded-lg  p-2 px-6 md:p-4 md:px-12 font-medium cursor-pointer"
          onClick={() => submit(0)}
        >
           {submitted==0 ? <div className="loader"></div> : "No"}
          
        </button>
        <button
          className="bg-[#f3dd1f] rounded-lg  p-2 px-6 md:p-4 md:px-12 font-medium cursor-pointer"
          onClick={() => submit(1)}
        >
           {submitted==1 ? <div className="loader"></div> : "Maybe"}
        
        </button>
        <button
          className="bg-[#129561] rounded-lg p-2 px-6 md:p-4 md:px-12 font-medium cursor-pointer"
          onClick={() => submit(2)}
        >
           {submitted==2 ? <div className="loader"></div> : "Yes"}
          
        </button>
      </div>
      </div>
      {submitted==-2 && <p className="text-red-600 p-2 mt-2 self-center text-[12px] sm:text-[16px]">Unable to submit your feedback at the moment</p>}
    </div>
  )
}

export default NpsScaleTest
