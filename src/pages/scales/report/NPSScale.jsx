
import {useState} from "react"
import axios from "axios"
import { useSearchParams } from "react-router-dom";

export default function App() {
  const[loading,setLoading]=useState(-1)
  const[submitted, setSubmitted]=useState(-1)
  const [searchParams, setSearchParams] = useSearchParams();
  const workspaceId=searchParams.get("workspace_id")
  const scaleId=searchParams.get("scale_id")
  const channelName=searchParams.get("channel")
  const instanceName=searchParams.get("instance")
  const buttons = Array.from({ length: 11 }, (_, i) => i);



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
            "channel": channelName,
            "instance": instanceName
        };
    
        try {
            const response = await axios.post("https://100035.pythonanywhere.com/nps/api/v5/nps-create-response/", body, { headers });
        console.log(response.data)
            if(response.data.success=="true"){
              console.log("redirecting.....")
            window.location.href=response.data.redirect_url
           }
        } catch (error) {
            console.error("Error submitting response:", error.response ? error.response.data : error.message);
        }
  }


  return (
   <div className="w-full flex flex-col justify-center items-center ">
    <p className="mt-5 text-[16px] sm:text-[20px] font-bold">Give your feedback</p>
    <p className="mt-3 text-[14px]">Stand/Shop Number</p>
    <p className=" w-[80px] sm:w-[150px] border-2 h-[30px] sm:h-[50px] mt-2 rounded-3xl flex items-center justify-center">1</p>
    <div className="flex flex-col justify-center items-center font-sans font-medium p-3 mt-5 text-[20px] text-[#E45E4C]">
    <p className="font-sans sm:font-bold font-medium text-[14px] sm:text-[20px] text-[#E45E4C] text-center">
    Would you like to use our products/services
    
    </p>
    </div>
                {/* <p className="text-[14px]">(Low)0-10(High)</p> */}
               <div className="w-max flex flex-col">
            

  <div className="flex justify-center items-center gap-1 sm:gap-3 bg-white p-2 md:p-4 lg:px-8 w-max">
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
    {buttons.map((value) => (
      <button
        key={value}
        onClick={() => submit(value)}
        className="md:text-[20px] sm:text-[14px] py-[2px] px-[6px] sm:p-2 sm:px-3 rounded-full md:px-4 cursor-pointer bg-[#FCEAD4] text-[#F7B75F] font-bold hover:bg-green-200"
      >
        {submitted === value ? <div className="loader"></div> : value}
      </button>
    ))}
  </div>
                    <div className="w-full flex  justify-center items-center gap-24 sm:gap-48 text-[12px] sm:text-[14px] ">
                            <p>low</p>
                            <p>Average</p>
                            <p>High</p>
                    </div>
                </div>
            </div>
  );
}
