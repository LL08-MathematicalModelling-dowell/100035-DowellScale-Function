import React from 'react'
import { useState, useEffect} from 'react';
import { useSearchParams } from "react-router-dom";
import axios from "axios"
const NpsScaleTest = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const workspaceId=searchParams.get("workspace_id")
  const scaleId=searchParams.get("scale_id")
  const channelName=searchParams.get("channel_name")
  const instanceName=searchParams.get("instance")

  async function submit(index){
    console.log(index)
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
        console.log(response.data);
    } catch (error) {
        console.error("Error submitting response:", error.response ? error.response.data : error.message);
    }
}

  return (
    <div className='flex flex-col justify-center items-center font-sans font-medium p-3 mt-5 text-base m-auto w-full'>
      <p className="flex justify-center items-center font-sans font-medium p-3 mt-5 text-base">
        How was your experience using our product? Please rate your experience below.
      </p>
      
      <div className="flex border md:p-5 p-2 justify-center items-center mt-5">
      <div className="flex justify-center items-center gap-6 md:gap-12 md:mt-5 text-[12px] sm:text-[14px] md:text-[18px]">
        <button
          className="bg-[#ff4a4a] rounded-lg  py-[6px] px-[3px] sm:p-2 sm:px-6 md:p-4 md:px-12  sm:font-medium cursor-pointer"
          onClick={() => submit(0)}
        >
          Bad 😞
        </button>
        <button
          className="bg-[#f3dd1f] rounded-lg  py-[6px] px-[3px] sm:p-2 sm:px-6 md:p-4 md:px-12   sm:font-medium cursor-pointer"
          onClick={() => submit(1)}
        >
          Average 😐
        </button>
        <button
          className="bg-[#129561] rounded-lg py-[6px] px-[3px] sm:p-2 sm:px-6 md:p-4 md:px-12  sm:font-medium cursor-pointer"
          onClick={() => submit(2)}
        >
          Excellent 😄
        </button>
      </div>
      </div>
    </div>
  )
}

export default NpsScaleTest
