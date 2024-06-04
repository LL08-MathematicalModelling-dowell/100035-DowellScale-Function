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
        <button
          className="bg-[#129561] mr-[2%] rounded-lg  w-[30px] h-[30px]  text-base sm:font-medium cursor-pointer"
          onClick={() => window.location.href ="https://100035.pythonanywhere.com/addons/create-response/v3/?user=True&scale_type=nps_lite&channel=channel_1&instance=instances_1&workspace_id=653637a4950d738c6249aa9a&username=CustomerSupport&scale_id=6656f055d57731003026715e&item=0"}
        >
          0
        </button>
        <button
          className="bg-[#129561] mr-[2%] rounded-lg w-[30px] h-[30px]  text-base sm:font-medium cursor-pointer"
          onClick={() => window.location.href ="https://100035.pythonanywhere.com/addons/create-response/v3/?user=True&scale_type=nps_lite&channel=channel_1&instance=instances_1&workspace_id=653637a4950d738c6249aa9a&username=CustomerSupport&scale_id=6656f055d57731003026715e&item=1"}
        >
          1
        </button>
        <button
          className="bg-[#129561] mr-[2%] rounded-lg w-[30px] h-[30px] text-base sm:font-medium cursor-pointer"
          onClick={() => window.location.href = "https://100035.pythonanywhere.com/addons/create-response/v3/?user=True&scale_type=nps_lite&channel=channel_1&instance=instances_1&workspace_id=653637a4950d738c6249aa9a&username=CustomerSupport&scale_id=6656f055d57731003026715e&item=2"}
        >
          2
        </button>
        <button
          className="bg-[#129561] mr-[2%] rounded-lg w-[30px] h-[30px] text-base sm:font-medium cursor-pointer"
          onClick={() => window.location.href = "https://100035.pythonanywhere.com/addons/create-response/v3/?user=True&scale_type=nps_lite&channel=channel_1&instance=instances_1&workspace_id=653637a4950d738c6249aa9a&username=CustomerSupport&scale_id=6656f055d57731003026715e&item=2"}
        >
          3
        </button>
        <button
          className="bg-[#129561] mr-[2%] rounded-lg w-[30px] h-[30px] text-base sm:font-medium cursor-pointer"
          onClick={() => window.location.href = "https://100035.pythonanywhere.com/addons/create-response/v3/?user=True&scale_type=nps_lite&channel=channel_1&instance=instances_1&workspace_id=653637a4950d738c6249aa9a&username=CustomerSupport&scale_id=6656f055d57731003026715e&item=2"}
        >
          4
        </button>
        <button
          className="bg-[#129561] mr-[2%] rounded-lg w-[30px] h-[30px] text-base sm:font-medium cursor-pointer"
          onClick={() => window.location.href = "https://100035.pythonanywhere.com/addons/create-response/v3/?user=True&scale_type=nps_lite&channel=channel_1&instance=instances_1&workspace_id=653637a4950d738c6249aa9a&username=CustomerSupport&scale_id=6656f055d57731003026715e&item=2"}
        >
          5
        </button>
        <button
          className="bg-[#129561] mr-[2%] rounded-lg w-[30px] h-[30px] text-base sm:font-medium cursor-pointer"
          onClick={() => window.location.href = "https://100035.pythonanywhere.com/addons/create-response/v3/?user=True&scale_type=nps_lite&channel=channel_1&instance=instances_1&workspace_id=653637a4950d738c6249aa9a&username=CustomerSupport&scale_id=6656f055d57731003026715e&item=2"}
        >
          6
        </button>
        <button
          className="bg-[#129561] mr-[2%] rounded-lg  w-[30px] h-[30px] text-base sm:font-medium cursor-pointer"
          onClick={() => window.location.href = "https://100035.pythonanywhere.com/addons/create-response/v3/?user=True&scale_type=nps_lite&channel=channel_1&instance=instances_1&workspace_id=653637a4950d738c6249aa9a&username=CustomerSupport&scale_id=6656f055d57731003026715e&item=2"}
        >
          7
        </button>
        <button
          className="bg-[#129561] mr-[2%] rounded-lg w-[30px] h-[30px] text-base sm:font-medium cursor-pointer"
          onClick={() => window.location.href = "https://100035.pythonanywhere.com/addons/create-response/v3/?user=True&scale_type=nps_lite&channel=channel_1&instance=instances_1&workspace_id=653637a4950d738c6249aa9a&username=CustomerSupport&scale_id=6656f055d57731003026715e&item=2"}
        >
          8
        </button>
        <button
          className="bg-[#129561] mr-[2%] rounded-lg w-[30px] h-[30px] text-base sm:font-medium cursor-pointer"
          onClick={() => window.location.href = "https://100035.pythonanywhere.com/addons/create-response/v3/?user=True&scale_type=nps_lite&channel=channel_1&instance=instances_1&workspace_id=653637a4950d738c6249aa9a&username=CustomerSupport&scale_id=6656f055d57731003026715e&item=2"}
        >
          9
        </button>
        <button
          className="bg-[#129561] rounded-lg w-[30px] h-[30px] text-base sm:font-medium cursor-pointer"
          onClick={() => window.location.href = "https://100035.pythonanywhere.com/addons/create-response/v3/?user=True&scale_type=nps_lite&channel=channel_1&instance=instances_1&workspace_id=653637a4950d738c6249aa9a&username=CustomerSupport&scale_id=6656f055d57731003026715e&item=2"}
        >
          10
        </button>
      </div>
    </div>
  )
}

export default NpsScaleTest
