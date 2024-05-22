
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router';

import { FaArrowCircleLeft } from "react-icons/fa";


import ConfirmationScale from "./ScaleConfirmation";
import { useSearchParams } from 'react-router-dom';
import ConfigureScale from "./ConfigureScale";
import ScaleSharingScreen from "./ScaleSharingScreen";


export default function ScaleMainScreen({textContent}){
   
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
    <div className="flex relative w-[100%] sm:w-[65%] sm:left-[35%] md:w-[75%] lg:w-[80%] xl:w-[83%] md:left-[25%] lg:left-[20%] xl:left-[17%]">
        <div className="h-full relative overflow-hidden flex flex-col justify-center items-center w-[100%]" style={{ fontFamily: 'Roboto, sans-serif' }}>
            <div className="flex justify-center items-center xl:justify-start xl:items-start gap-3 w-full p-5 xl:pl-10">
                <FaArrowCircleLeft onClick={handleBack} className="cursor-pointer text-[24px]" />
                <span className="font-bold text-black">{textContent.scale}</span>
            </div>

            {!buttonLinksGenerated ? (
                <>
                    <style scoped>
                        {`
                        .div-changes {
                            padding: 40px 10px;
                            margin-left: 20px;
                        }  
                        .content-changes {
                            width: 100px;
                            font-size: 0.8rem;
                        }
                        @media (min-width: 768px) {
                            .div-changes {
                                padding: 40px;
                                margin-left: 56px;
                            }
                            .content-changes {
                                width: 150px;
                                font-size:1rem
                            }
                        }
                        .text-changes {
                            font-size: 0.8rem;
                        }
                        @media (min-width:523px) {
                            .text-changes {
                                font-size: 1rem;
                            }
                        }
                        .button-changes {
                            padding: 0.3rem;
                            font-size: 10px;
                        }
                        @media(min-width:640px) {
                            .button-changes {
                                padding: 0.5rem;
                                font-size: 10px;
                            }
                        }
                        @media(min-width:670px) {
                            .button-changes {
                                padding: 0.5rem;
                                font-size: 12px;
                            }
                        }
                        @media(min-width:905px) {
                            .button-changes {
                                padding: 0.5rem;
                                padding-left: 1rem;
                                padding-right: 1rem;
                                font-size: 18px;
                            }
                        }
                        @media(min-width:1152px) {
                            .button-changes {
                                padding: 0.5rem;
                                padding-left: 3rem;
                                padding-right: 3rem;
                                font-size: 18px;
                            }
                        }
                        @media(min-width:1400px) {
                            .button-changes {
                                padding: 0.5rem;
                                padding-left: 5rem;
                                padding-right: 5rem;
                                font-size: 18px;
                            }
                        }
                        `}
                    </style>

                    <div className="mt-5 bg-[#E8E8E8] rounded-lg h-max w-[80%] div-changes">
                        <div className="flex flex-col justify-start items-start">
                            <p className="font-medium">{textContent.scaleEg}</p>
                            <p className="text-[14px]">{textContent.scaleDescription}</p>
                        </div>
                        <p className="flex justify-center items-center font-sans p-3 mt-5 text-changes">{textContent.experiencePrompt}</p>
                       {textContent.experience.length==3 && (
                        <div className="flex justify-center items-center gap-12 mt-5">
                            <button className="bg-[#ff4a4a] rounded button-changes">{textContent.experience[0]}</button>
                            <button className="bg-[#f3dd1f] rounded button-changes">{textContent.experience[1]}</button>
                            <button className="bg-[#129561] rounded button-changes">{textContent.experience[2]}</button>
                        </div>  
                       )}
                        {textContent.experience.length==11 && (
                       <div className="w-full flex justify-center items-center gap-5">
                        {textContent.experience.map((score, index)=>(
                        <button
                        key={index}
                            onClick={() => handleSelectScore(score)}
                            className={`rounded-lg ${
                
                          'bg-primary text-white'
                            }  h-[2rem] w-[2rem] md:h-[3rem] md:w-[3rem]`}
                            >
                            {score}
                            </button>
                         ))}
                        </div>
                    )}
                     {textContent.experience.length==10 && (
                       <div className="w-full flex justify-center items-center gap-5">
                        {textContent.experience.map((score, index)=>(
                        <button
                        key={index}
                            onClick={() => handleSelectScore(score)}
                            className={`rounded-lg ${
                
                          'bg-primary text-white'
                            }  h-[2rem] w-[2rem] md:h-[3rem] md:w-[3rem]`}
                            >
                            {score}
                            </button>
                         ))}
                        </div>
                    )}
                     {textContent.experience.length==5 && (
                       <div className="w-full flex justify-center items-center gap-5">
                         <style scoped>
                            {`

                            .button-changes {
                                padding: 10px 10px;
                                font-size: 1.5rem;
                                }

                            @media (min-width: 670px) { 
                                .button-changes {
                                padding: 5px 5px;
                                font-size: 1rem;
                                }
                                }
                    
                                @media (min-width: 1400px) { 
                                .button-changes {
                                    padding: 10px 20px;
                                }
                                }
                            `}
                        </style>
            {textContent.experience.map((score, index)=>(
                     <button key={index} style={{
                        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
                        backgroundColor:  "hsl(120, 70%, 60%)",
                        fontWeight: 500,
                        border: "none",
                        borderRadius: '30px',
                        cursor: 'pointer',
                        margin: '5px',
                    }} className="button-changes">{score}</button>
                    ))}
                    </div>
                )}
                    </div>

                    <div className="mt-14 pt-10 bg-[#E8E8E8] rounded-lg h-max w-[80%] div-changes">
                        {!confirmed ? (
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
                        ) : (
                            <ConfirmationScale formData={formData} setButtonLinks={setButtonLinks} setButtonLinksGenerated={setButtonLinksGenerated} text={confirmText}/>
                        )}
                    </div>
                </>
            ) : (
                <ScaleSharingScreen setFinished={setFinished} buttonLinks={buttonLinks} text={sharingText}/>
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