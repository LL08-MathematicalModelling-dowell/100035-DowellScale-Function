import React from 'react'
import { useState, useEffect} from 'react';
import { useSearchParams } from "react-router-dom";

const NpsScaleTest = () => {

  const [searchParams, setSearchParams] = useSearchParams({});
  let currentUrlParams = new URLSearchParams(window.location.search);

  useEffect(()=>{
    setSearchParams({ scale_id: "665a8277d5d158ec8391aaf7", channel:"channel_1", instance: "instance_1" });
  }, [])
  return (
    <div className='flex flex-col justify-center items-center font-sans font-medium p-3 mt-5 text-base m-auto w-full'>
      <p className="flex justify-center items-center font-sans font-medium p-3 mt-5 text-base">
        How was your experience using our product? Please rate your experience below.
      </p>
      
      <div className="flex border p-5 justify-center items-center mt-5">
      <div className="flex justify-center items-center gap-6 md:gap-12 mt-5">
        <button
          className="bg-[#ff4a4a] rounded-lg  p-1 px-3 sm:p-2 sm:px-6 md:p-4 md:px-12  text-base sm:font-medium cursor-pointer"
          onClick={() => window.location.href ="https://100035.pythonanywhere.com/addons/create-response/v3/?user=True&scale_type=nps_lite&channel=channel_1&instance=instances_1&workspace_id=6385c0e68eca0fb652c9449a&username=CustomerSupport&scale_id=665ee1738c9b16f4f9967dd1&item=0"}
        >
          Bad 😞
        </button>
        <button
          className="bg-[#f3dd1f] rounded-lg  p-1 px-3 sm:p-2 sm:px-6 md:p-4 md:px-12  text-base sm:font-medium cursor-pointer"
          onClick={() => window.location.href ="https://100035.pythonanywhere.com/addons/create-response/v3/?user=True&scale_type=nps_lite&channel=channel_1&instance=instances_1&workspace_id=6385c0e68eca0fb652c9449a&username=CustomerSupport&scale_id=665ee1738c9b16f4f9967dd1&item=1"}
        >
          Average 😐
        </button>
        <button
          className="bg-[#129561] rounded-lg p-1 px-3 sm:p-2 sm:px-6 md:p-4 md:px-12 text-base sm:font-medium cursor-pointer"
          onClick={() => window.location.href = "https://100035.pythonanywhere.com/addons/create-response/v3/?user=True&scale_type=nps_lite&channel=channel_1&instance=instances_1&workspace_id=6385c0e68eca0fb652c9449a&username=CustomerSupport&scale_id=665ee1738c9b16f4f9967dd1&item=2"}
        >
          Excellent 😄
        </button>
      </div>
      </div>
    </div>
  )
}

export default NpsScaleTest
