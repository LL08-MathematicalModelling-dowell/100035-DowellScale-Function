// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router';
// import { useNavigate } from 'react-router';
// import { MdManageHistory } from 'react-icons/md';
// import { BsArrowLeft} from 'react-icons/bs';
// import { toast } from 'react-toastify';
// import useGetScale from '../../../hooks/useGetScale';
// import useGetSingleScale from '../../../hooks/useGetSingleScale';
// import Fallback from '../../../components/Fallback';
// import { Button } from '../../../components/button';
// import ChannelNames from '../../../components/data/ChannelNames';


// const NpsLiteScale = () => {
//     const { slug } = useParams();
//     const { isLoading, scaleData, fetchScaleData } = useGetScale();
//     const [selectedScore, setSelectedScore] = useState(-1);
//     const navigateTo = useNavigate();

//     const scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
//     const level=[[0,"Left"],[1,"Center"],[2,"Right"]]

//     console.log(scaleData, 'scaleData ***');

    

//     useEffect(()=>{
//         fetchScaleData('nps-lite-scale');
//     },[]);

//     const handleCreateScale = () =>{
//       ChannelNames.length = 0
//       navigateTo(`/100035-DowellScale-Function/create-nps-lite-scale`)
//     }

//     const handleSelectScore = (score)=>{
//         setSelectedScore(score)
//     }
    

//     if (isLoading) {
//         return <Fallback />;
//     }
//   return (
//     <div className='h-screen  flex flex-col items-center justify-center font-Montserrat font-medium'>
//         <div className='w-full h-full flex items-center'>
//             <div className={`h-full md:h-full w-full  m-auto flex flex-col lg:flex-row items-center shadow-lg p-2`} 
//             >
//                 <div className={`h-full w-full lg:w-3/12 border overflow-y-auto`}>
//                     <h2 className='flex items-center gap-2 p-2 font-medium'>
//                         <span className=''>
//                         <MdManageHistory className='text-primary'/>
//                         </span> Scale History
//                     </h2>
//                     {scaleData && scaleData?.map((scale, index)=>(
//                         <>
//                             <Button width={'full'} onClick={()=>navigateTo(`/100035-DowellScale-Function/nps-lite-scale-settings/${scale._id}`)} key={index}>{scale?.settings?.name}</Button>
//                         </>
//                     ))}

//                 </div>
//                 <div className='flex-1 flex flex-col items-center justify-center w-full h-full p-2 border stage lg:w-5/12'>
//                     <h3 className='text-center py-5 text-sm font-medium'>SCALE</h3>
//                     <div className='w-full flex justify-center md:grid-cols-11 gap-3 bg-gray-300 py-6 px-2 md:px-1'
                    
//                     >
                       
//                         {
//                             level.map((score, index)=>(
//                             <button 
//                                 key={index}
//                                 onClick={()=>handleSelectScore(score[0])}
//                                 className={`rounded-lg ${index  === selectedScore
//                                   ? 'bg-white' : 'bg-primary text-white'} text-primary h-[3.8rem] w-[14.8rem]`}
//                             >{score[1]}</button>
//                         ))}
//                     </div>
                    
            
//                     <div className='flex items-center justify-end w-full my-4'>
//                         <Button primary width={'3/4'} onClick={handleCreateScale}>create new scale</Button>
//                     </div>
//                 </div>
//             </div>
            
//         </div>
//     </div>
//   )
// }

// export default NpsLiteScale





import { FaLessThan } from "react-icons/fa";
import { Fragment, useState, useEffect } from "react";
import { useNavigate } from 'react-router';

// import CustomizeNpxLite from "./CustomizeNpxLite";
import ConfigureNpxLite from "./ConfigureNpxLite";
// import PreviewNpxLite from "./PreviewNpxLite";

import { FaArrowCircleLeft } from "react-icons/fa";


import SideBar from "../../SideBar";
import ConfirmationScale from "./NpsLiteConfirmation";
import NpsLiteSharingScreen from "./NpsLiteSharingScreen";
import { useSearchParams } from 'react-router-dom';


export default function NpsLiteScale(){
   
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


    return(
          <div className="flex relative w-[100%] sm:w-[65%] sm:left-[35%] md:w-[75%] lg:w-[80%] xl:w-[83%] md:left-[25%] lg:left-[20%] xl:left-[17%]">
          <div className="h-full relative overflow-hidden flex flex-col justify-center items-center w-[100%]" style={{ fontFamily: 'Roboto, sans-serif' }}>
          {/* <div className="hidden p-5 lg:pl-10 xl:pl-10 xl:flex justify-center xl:justify-start items-center gap-3 w-full">
            <FaLessThan onClick={handleBack} className="cursor-pointer" />
            <span className="font-bold text-black">NPS LITE SCALE</span>
            </div> */}
            <div className=" flex justify-center items-center xl:justify-start  xl:items-start gap-3 w-full  p-5 xl:pl-10 ">
                <FaArrowCircleLeft onClick={handleBack} className="cursor-pointer text-[24px]" />
                <span className="font-bold text-black">NPS LITE SCALE</span>
            </div>
           

            {!buttonLinksGenerated ? (
            <>
            <style scoped>
                    {
                        `
                       
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
                        .button-changes{
                            padding:0.3rem;
                           font-size:10px;
                        }
                        @media(min-width:630px){
                            .button-changes{
                                padding:0.5rem;
                                font-size:10px;
                            }
                        }
                          
                        @media(min-width:670px){
                        .button-changes{
                            padding:0.5rem;
                           font-size:12px;
                        }
                    }
                  @media(min-width:905px){
                            .button-changes{
                                padding:0.5rem;
                                padding-left: 1rem;
                                padding-right: 1rem;
                                font-size:18px;
                            }
                        }
                        @media(min-width:1152px){
                            .button-changes{
                                padding:0.5rem;
                                padding-left: 3rem;
                                padding-right: 3rem;
                                font-size:18px;
                            }
                        }
                   
                      
                        @media(min-width:1400px){
                            .button-changes{
                                padding:0.5rem;
                                padding-left: 5rem;
                                padding-right: 5rem;
                                font-size:18px;
                            }
                        }
                        
                     
                        `
                    }
                </style>
       
               

                <div className="mt-5  bg-[#E8E8E8] rounded-lg  h-max  w-[80%] div-changes"  >
                    <div className="flex flex-col justify-start items-start">
                    <p className="font-medium" >NPS LITE SCALE eg.</p>
                   <p className=" text-[14px]" >This is how a nps lite scale would look.</p>

                    </div>
                    <p className="flex justify-center items-center font-sans  p-3  mt-5 text-changes">How was your experience using our product? Please rate your experience below.</p>
                  
             
                    <div className="flex justify-center items-center gap-12 mt-5">
                        <button className="flex bg-[#ff4a4a]  rounded button-changes">Bad 😞</button>
                        <button  className="bg-[#f3dd1f]   rounded button-changes">Average 😐</button>
                        <button  className="bg-[#129561]  rounded button-changes">Excellent 😄</button>
                    </div>
                </div>
             
         
             
            <div className="mt-14 pt-10 bg-[#E8E8E8] rounded-lg  h-max w-[80%] div-changes">
                {!confirmed ?(
                    <>
                     <div className="flex justify-center items-center">
                    <div className="flex flex-col justify-center items-center">
                
                    {/* <p className={` bg-green-500 text-xl rounded-full w-max tracker-changes`}>1</p> */}
                    <p className="w-max text-[24px] font-bold text-orange-600">Configure your scale</p>
                    </div>
                    {/* <div className={`h-[6px] w-[200px] ${step>1 ?"bg-green-500" :"bg-gray-400"} rounded-lg mt-5 m-3`}></div>
                    <div className="flex flex-col justify-center items-center">
                    <p className={` ${step>1 ?"bg-green-500" :"bg-gray-400 "} tracker-changes text-xl rounded-full w-max`}>2</p>
                    <p className="w-max content-changes">Customize your scale</p>
                    </div>
                    <div className={`h-[6px] w-[200px] ${step>2 ?"bg-green-500" :"bg-gray-400"} rounded-lg mt-5 m-3`}></div>
                    <div className="flex flex-col justify-center items-center">
                    <p className={` ${step>2 ?"bg-green-500" :"bg-gray-400 "} tracker-changes text-xl rounded-full w-max`}>3</p>
                    <p className="w-max content-changes">Preview your scale</p>
                    </div> */}
                   
                </div>
                {step==1 && (
                     <ConfigureNpxLite
                     formData={formData} setFormData={setFormData} setConfirmScale={setConfirmScale}/>
                 )}
                {/* {step==2 && (
                    <CustomizeNpxLite formData={formData} setFormData={setFormData} setStep={setStep}/>
                )}
                 {step==3 && (
                    <PreviewNpxLite formData={formData} setStep={setStep}/>
                )} */}
                    </>
                ):
                <ConfirmationScale formData={formData} setButtonLinks={setButtonLinks} setButtonLinksGenerated={setButtonLinksGenerated}/>
                }
               
            </div>
            </>
            ):(
                <NpsLiteSharingScreen setFinished={setFinished} buttonLinks={buttonLinks}/>

            ) }
             
        </div>
          {goBack &&( 
            <PopUp onCancel={handleCancel} onConfirm={()=>{handleConfirm("back")}} header="Are you sure?" text1="Changes made so far will not be saved.Do you really "
             text2="want to cancel the process and go back?"/>
          )}
           {confirmScale &&( 
            <PopUp onCancel={handleCancel} onConfirm={()=>{handleConfirm("confirm")}} header="Confirm scale" text1="You won't be able to edit the scale once you confirm "
             text2="it.Are you sure you want to confirm the scale?"/>
          )}
           {finished &&( 
            <PopUp onCancel={handleCancel} onConfirm={()=>{handleConfirm("finish")}} header="Are you sure?" text1="You want to finish up sharing the scale and go back "
             text2="to my scales page?"/>
          )}
        </div>
       
    )
}