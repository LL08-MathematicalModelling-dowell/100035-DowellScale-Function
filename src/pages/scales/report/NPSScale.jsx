
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
    <p className="mt-[150px] text-[20px]">Give your feedback</p>
    <p className="mt-3 text-[14px]">Stand/Shop Number</p>
    <p className="w-[190px] border-2 h-[50px] rounded-3xl flex items-center justify-center">1</p>
    <div className="flex flex-col justify-center items-center font-sans font-medium p-3 mt-5 text-[20px] text-[#E45E4C]">
    <p className="font-sans font-bold font-medium text-[20px] text-[#E45E4C] text-center">
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
                        <button
                          key="0"
                          onClick={()=>submit(0)}
                          className="md:text-[20px] sm:text-[14px] py-[2px] px-[6px] sm:p-2 sm:px-3 rounded-full md:px-4 cursor-pointer bg-[#FCEAD4] text-[#F7B75F] font-bold hover:bg-green-200 "
                          >
                         {submitted==0 ? <div className="loader"></div> : 0}
                        </button>
                      
                        <button
                          key="1"
                          onClick={()=>submit(1)}
                          className="md:text-[20px] sm:text-[14px] py-[2px] px-[6px] sm:p-2 sm:px-3 rounded-full md:px-4 cursor-pointer bg-[#FCEAD4] text-[#F7B75F] font-bold hover:bg-green-200"
                          >
                          {submitted==1 ? <div className="loader"></div> : 1}
                        </button>
                      
                        <button
                          key="2"
                          onClick={()=>submit(2)}
                          className="md:text-[20px] sm:text-[14px] py-[2px] px-[6px] sm:p-2 sm:px-3 rounded-full md:px-4 cursor-pointer bg-[#FCEAD4] text-[#F7B75F] font-bold hover:bg-green-200"
                          >
                           {submitted==2 ? <div className="loader"></div> : 2}
                        </button>
                        <button
                          key="3"
                          onClick={()=>submit(3)}
                          className="md:text-[20px] sm:text-[14px] py-[2px] px-[6px] sm:p-2 sm:px-3 rounded-full md:px-4 cursor-pointer bg-[#FCEAD4] text-[#F7B75F] font-bold hover:bg-green-200"
                          >
                          {submitted==3 ? <div className="loader"></div> : 3}
                        </button>
                      
                        <button
                          key="4"
                          onClick={()=>submit(4)}
                          className="md:text-[20px] sm:text-[14px] py-[2px] px-[6px] sm:p-2 sm:px-3 rounded-full md:px-4 cursor-pointer bg-[#FCEAD4] text-[#F7B75F] font-bold hover:bg-green-200"
                          >
                          {submitted==4 ? <div className="loader"></div> : 4}
                        </button>
                      
                        <button
                          key="5"
                          onClick={()=>submit(5)}
                          className="md:text-[20px] sm:text-[14px] py-[2px] px-[6px] sm:p-2 sm:px-3 rounded-full md:px-4 cursor-pointer bg-[#FCEAD4] text-[#F7B75F] font-bold hover:bg-green-200"
                          >
                         {submitted==5 ? <div className="loader"></div> : 5}
                        </button>
                      
                        <button
                          key="6"
                          onClick={()=>submit(6)}
                          className="md:text-[20px] sm:text-[14px] py-[2px] px-[6px] sm:p-2 sm:px-3 rounded-full md:px-4 cursor-pointer bg-[#FCEAD4] text-[#F7B75F] font-bold hover:bg-green-200"
                          >
                         {submitted==6 ? <div className="loader"></div> : 6}
                        </button>
                      
                        <button
                          key="7"
                          onClick={()=>submit(7)}
                          className="md:text-[20px] sm:text-[14px] py-[2px] px-[6px] sm:p-2 sm:px-3 rounded-full md:px-4 cursor-pointer bg-[#FCEAD4] text-[#F7B75F] font-bold hover:bg-green-200"
                          >
                         {submitted==7 ? <div className="loader"></div> : 7}
                        </button>
                      
                        <button
                          key="8"
                          onClick={()=>submit(8)}
                          className="md:text-[20px] sm:text-[14px] py-[2px] px-[6px] sm:p-2 sm:px-3 rounded-full md:px-4 cursor-pointer bg-[#FCEAD4] text-[#F7B75F] font-bold hover:bg-green-200"
                          >
                         {submitted==8 ? <div className="loader"></div> : 8}
                        </button>
                      
                        <button
                          key="9"
                          onClick={()=>submit(9)}
                          className="md:text-[20px] sm:text-[14px] py-[2px] px-[6px] sm:p-2 sm:px-3 rounded-full md:px-4 cursor-pointer bg-[#FCEAD4] text-[#F7B75F] font-bold hover:bg-green-200"
                          >
                          {submitted==9 ? <div className="loader"></div> : 9}
                        </button>
                      
                        <button
                          key="10"
                          onClick={()=>submit(10)}
                          className="md:text-[20px] sm:text-[14px] py-[2px] px-[6px] sm:p-2 sm:px-3 rounded-full md:px-4 cursor-pointer bg-[#FCEAD4] text-[#F7B75F] font-bold hover:bg-green-200"
                          >
                        {submitted==10 ? <div className="loader"></div> : 10}
                        </button>
                      
                    </div>
                    <div className="w-full flex p-2 justify-between items-center text-[12px] sm:text-[14px] ">
                            <p>low</p>
                            <p>Average</p>
                            <p>High</p>
                    </div>
                </div>
            </div>
  );
}
