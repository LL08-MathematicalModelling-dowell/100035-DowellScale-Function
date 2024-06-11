
import {useState} from "react"
import axios from "axios"
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export default function App() {
  const[loading,setLoading]=useState(-1)
  const[submitted, setSubmitted]=useState(-1)
  const [searchParams, setSearchParams] = useSearchParams();
  const workspaceId=searchParams.get("workspace_id")
  const scaleId=searchParams.get("scale_id")
  const channelName=searchParams.get("channel_name")
  const instanceName=searchParams.get("instance_name")
  const buttons = Array.from({ length: 11 }, (_, i) => i);

  useEffect(()=>{
    setLoading(false)
  },[])

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
            "scale_type": "nps",
            "user_type": true,
            "score": index,
            "channel_name": channelName,
            "instance_name": instanceName
        };
    
        try {
            const response = await axios.post("https://100035.pythonanywhere.com/nps/api/v5/nps-create-response/", body, { headers });
     
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
    <div className="min-h-screen flex flex-col  items-center bg-gray-100 p-4 w-screen">
     
      <p className="mt-8 text-[14px] font-medium">Stand/Shop Number</p>
      <p className="w-[80px] sm:w-[150px] border-2 h-[30px] sm:h-[50px] mt-2 rounded-3xl flex items-center justify-center font-medium">{instanceId}</p>
      <div className="flex flex-col justify-center items-center font-sans font-medium sm:p-3 sm:mt-14 mt-24 text-[20px] text-[#E45E4C]">
        <p className="font-sans sm:font-bold font-medium text-[14px] sm:text-[20px] text-[#E45E4C] text-center">
          Would you like to use our products/services
        </p>
      </div>
      <div className="w-full flex flex-col items-center sm:mt-8">
      <p className=" text-[14px] sm:text-[20px] mt-10  font-medium">Give your feedback</p>
      <p className="p-2 text-[12px] sm:text-[16px] font-medium">(Low) 0-10 (High)</p>
        <div className="flex justify-center items-center gap-1 sm:gap-3 bg-white p-2 md:p-4 lg:px-8 w-max mt-5">
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
                margin-top:4px
              }
            `}
          </style>
          {buttons.map((value) => (
            <button
              key={value}
              onClick={() => submit(value)}
              className="md:text-[20px] sm:text-[14px] py-[1px] px-[6px] sm:p-2 sm:px-3 rounded-full md:px-4 cursor-pointer bg-orange-400 text-white font-bold hover:bg-indigo-600"
            >
              {submitted === value ? <div className="loader flex justify-center items-center "></div> : value}
            </button>
          ))}
        </div>
       
        {submitted==-2 && <p className="text-red-600 p-2 mt-2 self-center text-[12px] sm:text-[16px]">Unable to submit your feedback at the moment</p>}
      </div>
    </div>
  );
}
