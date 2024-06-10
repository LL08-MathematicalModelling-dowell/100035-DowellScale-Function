
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router';
import { useFetchUserContext } from "../../../contexts/fetchUserContext";
import { FaArrowCircleLeft } from "react-icons/fa";


import ConfirmationScale from "./ScaleConfirmation";
import { useSearchParams } from 'react-router-dom';
import ConfigureScale from "./ConfigureScale";
import ScaleSharingScreen from "./ScaleSharingScreen";
import CustomizeScale from "./CustomizeScale";
import PreviewScale from "./PreviewScale";


export default function ScaleMainScreen({textContent}){
   
const {  
        popuOption, 
        setPopupOption,
        sName,
        setSName,
        BtnLink,
        setBtnLink,
        scaleIndex,
        setScaleIndex,
        rSize, 
        setRSize,
        setMyScalesBtn,
        setNewScaleBtn } = useFetchUserContext()

const[goBack,setGoBack]=useState(false)
const[step,setStep]=useState(1)

const[confirmScale,setConfirmScale]=useState(false)
const[confirmed,setConfirmed]=useState(false)
const[buttonLinks,setButtonLinks]=useState([])
const[buttonLinksGenerated,setButtonLinksGenerated]=useState(false)
const[finished,setFinished]=useState(false)
const [sessionId, setSessionId] = useState('');
const [searchParams] = useSearchParams();

const[formData,setFormData]=useState({
    scaleName:"",
    numResponses:"",
    channels:[
       { 
        channelName:"",
        instances:[""]
    }
    ],
    orientation: "",
    // user: "yes",  //should be boolean
    // question: "",
    // username: "Ndoneambrose",
   // scalecolor: "#E5E7E8",
    // numberrating: 10,
    // no_of_scales: 3,
    fontColor: "#E5E7E8",
    fontStyle: "",
    fontFormat:"",
    fontSize:16,
     timer: 0,
    // template_name: "testing5350",
    // name: "",
    // text: "good+neutral+best",
    leftText: "",
    rightText: "",
    centerText: "",
    leftColor: "#E5E7E8",
    rightColor: "#E5E7E8",
    centerColor: "#E5E7E8",
    scaleColor:"#E5E7E8",
    scaleBackGroundColor:"#E5E7E8",
    scaleText:[],
    likertPointers:"5 Point Scale",
    pointersText:[]
})

useEffect(() => {
    const session_id =
      searchParams.get('session_id') || sessionStorage.getItem('session_id');
    setSessionId(session_id);
  }, [searchParams]);

const navigateTo = useNavigate();
    function handleBack(){
        setGoBack(true)
    }

    function handleCancel(){
        setGoBack(false)
        setFinished(false)
        setConfirmScale(false)
    }

    function handleConfirm(text){//nmeed to know the details
        console.log(text)
        if(text=="confirm"){
           setConfirmed(true);
           setConfirmScale(false)
           
        }else if(text=="finish"){
           setFinished(false)
           setConfirmed(false)
           setButtonLinksGenerated(false)
        }else{
            setGoBack(false)
            navigateTo(`/100035-DowellScale-Function/?session_id=${sessionId}`)
            
        }
       
    }
console.log(confirmed)



const PopUp=({onCancel,onConfirm,header,text1,text2})=>{
    return(
       <div className="fixed top-[55%] md:left-[40%] sm:left-[30%] left-[20%] sm:w-[55%] w-[65%] md:w-max h-max p-5 bg-white rounded-lg " style={{ fontFamily: 'Roboto, sans-serif' }}>
         <p className="font-bold">{header}</p>
         <p className="mt-3 ">{text1}</p>
         <p className="hidden md:block">{text2}</p>
         <div className="flex gap-8 justify-center items-center mt-3">
         <button className="p-2 md:px-8 bg-[#129561] rounded" onClick={onCancel}>No</button>
         <button className="p-2 md:px-8 bg-[#ff4a4a] rounded" onClick={()=>onConfirm()}>Yes</button>
         </div>
       </div>
    )
}

const confirmText=`Your ${textContent.scale} has been confirmed`
console.log(confirmText)
const sharingText=`Share your ${textContent.scale}  across different platforms and add to your customer touch points `

return (
    <div className="flex w-[100%]  lg:w-[80%] xl:w-[83%] ml-[10%] mr-[10%] lg:ml-[18%]">
        <div className="h-full overflow-hidden flex flex-col justify-center items-center w-[100%]" style={{ fontFamily: 'Roboto, sans-serif' }}>
            <div className="flex justify-center items-center xl:justify-start xl:items-start gap-3 w-full p-5 xl:pl-10">
                <FaArrowCircleLeft onClick={handleBack} className="cursor-pointer text-[24px]" />
                <span className="font-bold text-black">{textContent.scale}</span>
            </div>

            {!buttonLinksGenerated ? (
                <>
                    

                    <div className="mt-5 bg-[#E8E8E8] rounded-lg h-max w-[90%] sm:w-[80%] p-5">
                        <div className="flex flex-col justify-start items-start">
                            <p className="font-medium">{textContent.scaleEg}</p>
                            <p className="text-[14px]">{textContent.scaleDescription}</p>
                        </div>
                        <p className="flex justify-center items-center font-sans p-3 mt-5 text-changes">{textContent.experiencePrompt}</p>
                       {typeof textContent.experience[0]=="string" && textContent.experience[0].includes("Bad") ? (
                        <div className="flex justify-center items-center gap-3 sm:gap-12 mt-5">
                            <button className="bg-[#ff4a4a] rounded sm:px-5 lg:px-10 p-2 text-[12px] sm:text-[16px]">{textContent.experience[0]}</button>
                            <button className="bg-[#f3dd1f] rounded sm:px-5 lg:px-10 p-2 text-[12px] sm:text-[16px]">{textContent.experience[1]}</button>
                            <button className="bg-[#129561] rounded  sm:px-5 lg:px-10 p-2 text-[12px] sm:text-[16px]">{textContent.experience[2]}</button>
                        </div>  
                       ):(
                        
                        <div className="w-full flex flex-col justify-center items-center">
                            {typeof textContent.experience[0]=="number" ?(
                                  <div className="w-max flex flex-col">
                                  <div className="flex justify-center items-center gap-1 sm:gap-3 bg-white p-2 md:p-4 lg:px-8 border-2 border-[#bfbfbf] w-max">
                                      {textContent.experience.map((score, index)=>(
                                      <button
                                      key={index}
                                          className=" text-[12px] sm:text-[14px] py-[2px] px-[6px] sm:p-2  sm:px-3 rounded  md:px-4 bg-[#00a3ff] text-white "   
                                          >
                                          {score}
                                          </button>
                                      ))}
                              </div>
                              <div className="w-full flex p-2 justify-between items-center text-[12px] sm:text-[14px] ">
                                      <p>Bad</p>
                                      <p>Average</p>
                                      <p>Excellent</p>
                              </div>
                          </div>
                            ):(
                                  <div className="flex justify-center items-center gap-3 bg-white p-1 md:p-4 lg:px-8 border-2 border-[#bfbfbf] w-max">
                                      {textContent.experience.map((score, index)=>(
                                      <button
                                      key={index}
                                          className=" text-[12px] md:text-[14px]  p-1  px-2 rounded md:p-2 md:px-4 bg-[#00a3ff] text-white "   
                                          >
                                          {score}
                                          </button>
                                      ))}
                              </div>
                             
                            )}
                      
                </div>
                       )}
                        
                    </div>

                    <div className="mt-14 pt-10 bg-[#E8E8E8] rounded-lg h-max w-[90%] sm:w-[80%] ">
                        {!confirmed ? (
                            <>
                            {textContent.scale!=="LIKERT SCALE" ? (
                                <>
                                 <div className="flex justify-center items-center">
                                 <div className="flex flex-col justify-center items-center">
                                     <p className="w-max text-[24px] font-bold text-orange-600">{textContent.configureYourScale}</p>
                                 </div>
                             </div>
                             {step == 1 && (
                                 <ConfigureScale formData={formData} setFormData={setFormData} setConfirmScale={setConfirmScale} />
                             )}
                            
                             </>
                            ):(
                            <>     
                             <div className="flex justify-center items-center">
                                <div className="flex flex-col justify-center items-center gap-2">
                            
                                    <p className={` bg-green-500  rounded-full text-[14px] xl:text-[18px] w-max p-1 px-3 xl:p-2 xl:px-4`}>1</p>
                                    <p className="w-max text-[14px] md:text-[18px] md:font-medium mt-2 xl:font-bold flex gap-2">Configure <span className="hidden xl:block">your scale</span> </p>
                                </div>
                                <div className={`h-[6px] w-[200px] ${step>1 ?"bg-green-500" :"bg-gray-400"} rounded-lg mt-5 m-3`}></div>
                                <div className="flex flex-col justify-center items-center gap-2">
                                    <p className={` ${step>1 ?"bg-green-500" :"bg-gray-400 "} rounded-full text-[14px] xl:text-[18px] w-max p-1 px-3 xl:p-2 xl:px-4`}>2</p>
                                    <p className="w-max  text-[14px] md:text-[18px] md:font-medium mt-2 xl:font-bold flex gap-2">Customize <span className="hidden xl:block">your scale</span></p>
                                </div>
                                <div className={`h-[6px] w-[200px] ${step>2 ?"bg-green-500" :"bg-gray-400"} rounded-lg mt-5 m-3`}></div>
                                <div className="flex flex-col justify-center items-center gap-2">
                                    <p className={` ${step>2 ?"bg-green-500" :"bg-gray-400 "}  rounded-full text-[14px] xl:text-[18px] w-max p-1 px-3 xl:p-2 xl:px-4`}>3</p>
                                    <p className="w-max  text-[14px] md:text-[18px] md:font-medium mt-2 xl:font-bold flex gap-2">Preview <span className="hidden xl:block">your scale</span></p>
                                </div>
                     
                            </div>
                            {step == 1 && (
                            <ConfigureScale formData={formData} setFormData={setFormData} setConfirmScale={setConfirmScale} scale={textContent.scale} setStep={setStep}/>
                            )} 
                            {step==2 && (
                                <CustomizeScale formData={formData} setFormData={setFormData} setStep={setStep} />
                            )}
                            {step==3 && (
                                <PreviewScale formData={formData} setStep={setStep} scale={textContent.scale} setConfirmScale={setConfirmScale}/>
                            )}
                           
                     </>
                     )}
                            
                    </>
                        ) : (
                            <ConfirmationScale formData={formData} setButtonLinks={setButtonLinks} setButtonLinksGenerated={setButtonLinksGenerated} text={confirmText}/>
                        )}
                    </div>
                </>
            ) : (
                <ScaleSharingScreen setFinished={setFinished} buttonLinks={buttonLinks} text={sharingText} formData={formData}/>
            )}

            {goBack && (
                <PopUp
                    onCancel={handleCancel}
                    onConfirm={() => { handleConfirm("back") }}
                    header={textContent.goBackPrompt.header}
                    text1={textContent.goBackPrompt.text1}
                    text2={textContent.goBackPrompt.text2}
                />
            )}
            {confirmScale && (
                <PopUp
                    onCancel={handleCancel}
                    onConfirm={() => { handleConfirm("confirm") }}
                    header={textContent.confirmScalePrompt.header}
                    text1={textContent.confirmScalePrompt.text1}
                    text2={textContent.confirmScalePrompt.text2}
                />
            )}
            {finished && (
                <PopUp
                    onCancel={handleCancel}
                    onConfirm={() => { handleConfirm("finish") }}
                    header={textContent.finishSharingPrompt.header}
                    text1={textContent.finishSharingPrompt.text1}
                    text2={textContent.finishSharingPrompt.text2}
                />
            )}
        </div>
    </div>
);

}