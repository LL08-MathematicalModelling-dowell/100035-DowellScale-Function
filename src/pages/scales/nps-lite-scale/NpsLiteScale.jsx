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
import { Fragment, useState } from "react";
import { useNavigate } from 'react-router';
import scaleconfirmedimage from "../../../../src/assets/scaleconfirmed.png"
// import CustomizeNpxLite from "./CustomizeNpxLite";
import ConfigureNpxLite from "./ConfigureNpxLite";
// import PreviewNpxLite from "./PreviewNpxLite";
import copyData from "../../../utils/npxLiteCopyToClipboard";
import handleSharing from "../../../utils/handleSharing";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdContentCopy } from "react-icons/md";

import { PiFileCsvDuotone } from "react-icons/pi";
import SideBar from "../../SideBar";


export default function NpsLiteScale(){
    const ratings=["Bad","Average", "Excellent"]
const[goBack,setGoBack]=useState(false)
const[step,setStep]=useState(1)
const[numErr,setNumErr]=useState(false)
const[nameErr,setNameErr]=useState(false)
const[channelErr,setChannelErr]=useState(-1)
const[instanceErr,setInstanceErr]=useState({index:-1,idx:-1})
const[requiredChannel,setRequiredChannel]=useState(-1)
const[requiredInstance,setRequiredInstance]=useState({index:-1,idx:-1})
const[confirmScale,setConfirmScale]=useState(false)
const[confirmed,setConfirmed]=useState(false)
const[buttonLinks,setButtonLinks]=useState([])
const[buttonLinksGenerated,setButtonLinksGenerated]=useState(false)
const[finished,setFinished]=useState(false)
const[showData,setShowData]=useState("")
const[showOptions,setShowOptions]=useState(false)
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
const[isCopied,setIsCopied]=useState(false)
const[showCopyIcon,setShowCopyIcon]=useState(-1)
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
            navigateTo(`/100035-DowellScale-Function/`)
            
        }
       
    }
console.log(confirmed)
function handleFormData(value, name, index = 0, idx = 0) {
    switch (name) {
        case "scaleName":
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
            if (value.length < 3) setNameErr(true);
            else setNameErr(false);
            break;

        case "numResponses":
            let num = Number(value);
            setFormData(prev => ({
                ...prev,
                [name]: num
            }));
            if (num < 30 || num > 10000) {
                setNumErr(true);
            } else {
                setNumErr(false);
            }
            break;

        case "channelName":
            setRequiredChannel(-1)
            const nameExists = formData.channels.some((channel, idx) => idx !== index && channel.channelName === value);
            if (nameExists) {
                setChannelErr(index)
            }else{
                setChannelErr(-1);
            }
            setFormData(prev => ({
                ...prev,
                channels: prev.channels.map((channel, idx) => idx === index ? { ...channel, channelName: value } : channel)
            }));
          
            break;

        case "InstanceName":
            setRequiredInstance({index:-1,idx:-1})
            const instanceExists = formData.channels[index].instances.includes(value)
              
            
            if (instanceExists) {
                setInstanceErr({index,idx});
            } else {
                setInstanceErr({index:-1,idx:-1});
            }
  
            setFormData(prev => ({
                ...prev,
                channels: prev.channels.map((channel, i) => i === index ? {
                    ...channel,
                    instances: channel.instances.map((inst, iidx) => iidx === idx ? value : inst)
                } : channel)
            }));
        
            break;

        default:
            return formData;
    }
}

function increaseInstance(index){
    setFormData((prev)=>({
        ...prev,
        channels:prev.channels.map((channel,idx)=>idx==index?{
            ...channel,
            instances:[...channel.instances,""]
        }:channel)
    }))
}

function decreaseInstance(index){
  
    setFormData(prev => ({
        ...prev,
        channels: prev.channels.map((channel, idx) => {
            if (idx === index && channel.instances.length>1) {
                return {
                    ...channel,
                    instances: channel.instances.slice(0, -1)
                };
            }
            return channel;
        })
    }));
    if(instanceErr.index==index){
        setInstanceErr({index:-1,idx:-1})
    }

    
}

function addChannel(){
    let newChannel={
        channelName:"",
        instances:[""]
    }
    setFormData(prev => ({
        ...prev,
        channels:[...prev.channels,newChannel]
        
    }));
    
}

function deleteChannel(index){
    setFormData(prev => ({
        ...prev,
        channels: prev.channels.filter((channel, idx) => idx !== index)
        
    })); 
    if(channelErr==index){
        setChannelErr(-1)
    }
}

function handleNext(){
            let error=false
        if(formData.scaleName.length<3){
            setNameErr(true)
            error=true
        }

        if(formData.numResponses<25 || formData.numResponses>10000){
            setNumErr(true)
            error=true
            
        }

        formData.channels.map((channel, index) => {
        
            if (channel.channelName.length === 0) {
                setRequiredChannel(index);
                error=true
            }
        });


        formData.channels.map((channel, index) => {
            channel.instances.map((instance, idx) => {
                if (instance.length === 0) {
                    setRequiredInstance({index, idx});
                    error=true
                }
            });
        });



        if(error)
            return
        else
        setConfirmScale(true)
// setStep((prev)=>prev+1)

}


const PopUp=({onCancel,onConfirm,header,text1,text2})=>{
    return(
       <div className="fixed top-1/3 left-1/2 w-max h-max p-5 bg-white rounded-lg " style={{ fontFamily: 'Roboto, sans-serif' }}>
         <p className="font-bold">{header}</p>
         <p className="mt-3 ">{text1}</p>
         <p className="">{text2}</p>
         <div className="flex gap-8 justify-center items-center mt-3">
         <button className="p-2 px-8 bg-[#129561] rounded" onClick={onCancel}>No</button>
         <button className="p-2 px-8 bg-[#ff4a4a] rounded" onClick={()=>onConfirm()}>Yes</button>
         </div>
       </div>
    )
}

const codeToCopy=copyData(buttonLinks)
 
      const copyToClipboard = (data) => {
       
        navigator.clipboard.writeText(data)
            .then(() => {
                if(data[0]!="h" && data.length!=3){
                setIsCopied(true)
                setTimeout(()=>{
                     setIsCopied(false)                  
                },1000)
            }
            })
            .catch((error) => console.error('Error copying to clipboard: ', error));
    };
    return(
          <div className="flex relative">
            
          <SideBar/>
          <div className="h-full relative overflow-hidden flex flex-col justify-center items-center w-[100%]" style={{ fontFamily: 'Roboto, sans-serif' }}>
            <span className="  p-5 flex justify-start items-center gap-3 w-full">
         <FaLessThan onClick={handleBack} className=" cursor-pointer"/>
            <span  className=" font-bold  text-black">NPS LITE SCALE</span>
            </span>
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
                            padding:0.5rem;
                           font-size:12px;
                        }
                        @media(min-width:850px){
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
                   
                      
                        @media(min-width:1300px){
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
                        <button className="bg-[#ff4a4a]  rounded button-changes">Bad 😞</button>
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
                     formData={formData} 
                     handleFormData={handleFormData} nameErr={nameErr} numErr={numErr} channelErr={channelErr}
                     requiredChannel={requiredChannel} requiredInstance={requiredInstance} instanceErr={instanceErr}
                    decreaseInstance={decreaseInstance} increaseInstance={increaseInstance} addChannel={addChannel}
                    deleteChannel={deleteChannel} handleNext={handleNext}
                     />
                 )}
                {/* {step==2 && (
                    <CustomizeNpxLite formData={formData} setFormData={setFormData} setStep={setStep}/>
                )}
                 {step==3 && (
                    <PreviewNpxLite formData={formData} setStep={setStep}/>
                )} */}
                    </>
                ):
                <div>
                 <p className="w-full  font-medium">Your NPS LITE SCALE has been confirmed!</p>
                 <div className="flex flex-col justify-center items-center gap-3 mt-10">
                    <img src={scaleconfirmedimage}  alt='image'></img>
                    <p className="font-medium">You can start sharing your scale on different platforms</p>
                    <button className=" font-medium p-2 px-12 bg-[#129561] rounded mt-12 text-white"
                    onClick={()=>{handleSharing(formData,setButtonLinks,setButtonLinksGenerated)}}>Start Sharing</button>
                 </div>
                </div>
                }
               
            </div>
            </>
            ):(
                <>
                <div className="flex flex-col justify-center items-center bg-[#E8E8E8] rounded-lg  h-max w-[80%] p-5  relative" 
                style={{ fontFamily: 'Roboto, sans-serif' }}>
                    <p className="font-medium">Share your NPS LITE SCALE across different platforms and add to your customer touch points</p>
                    <div className="flex justify-center items-center gap-5 mt-10 text-white font-medium">
                        <button className={`${showData=="website"? "bg-[#129561]" :"bg-[#00a3ff]" }  p-1 px-8 rounded `}
                        onClick={()=>{setShowData("website")}}>Website</button>
                        <button  className={`${showData=="email"? "bg-[#129561]" :"bg-[#00a3ff]" }  p-1 px-8 rounded `}
                        onClick={()=>{setShowData("email")}}>Email</button>
                        <button  className={`${showData=="product"? "bg-[#129561]" :"bg-[#00a3ff]" }  p-1 px-8 rounded `}
                        onClick={()=>{setShowData("product")}}>Product</button>
                    </div>
                    {showData=="website" && (
                       <>
                         <div className="absolute top-[71%] right-[16%]  p-2">
                    <BsThreeDotsVertical className="cursor-pointer" onClick={()=>setShowOptions((prev)=>!prev)}/>
                </div>
                {showOptions && (
                    <div className="text-xs flex flex-col absolute top-[75%] right-[4%] bg-white p-2 gap-2 divide divide-x divide-gray-200 font-normal justify-center items-start">
                    <button className="flex justify-center text-[12px] items-center gap-2"
                    onClick={()=>{copyToClipboard(buttonLinks)
                        setShowOptions(false)
                    }}><MdContentCopy/> Copy all links</button>
                    <div className=" h-[1px] w-full  bg-gray-600 "></div> {/* Line */}
                    <button className="flex justify-center items-center gap-2 text-[12px]"><PiFileCsvDuotone/> Generate a .csv file</button>
                    </div>
                )}
                       </>
                    )}
                  
                    {showData=="website" && (
                             <div className="flex flex-col justify-center items-start font-normal mt-5">
                                <p className=" p-2 mb-5">Copy the source code of your scale and integrate it on your website</p>
                                <div className="h-[300px] w-[700px] bg-white overflow-auto p-2 text-[12px]">
                                    <pre  style={{ fontFamily: 'Roboto, sans-serif' }} className="text-[14px]">
                                   {codeToCopy}
                                   </pre>
                                  <button className="flex justify-center text-[12px] text-white bg-[#606060] p-1 items-center gap-2 absolute top-[24%] right-[16%]"
                                  onClick={()=>{copyToClipboard(codeToCopy)
                                  
                                  }}> <MdContentCopy /> Copy code</button>
                              {isCopied && <p className="absolute top-[27%] text-[#00a3ff] right-[18%]">Copied!</p>}
                                </div>
                                 <p className=" p-2 mt-5">Use the button links to add them to your scale</p>
                        <table className="w-full divide-y divide-gray-200 overflow-hidden mt-5 " >
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-2 py-3 text-left text-[10px] font-medium text-black uppercase ">Scale Values</th>
                                <th className="px-6 py-3 text-left text-[10px] font-medium text-black uppercase ">Button Links</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-[#cfdfd8]">
                            {buttonLinks.map((link, index) => (
                                <tr key={index} className="hover:bg-[#d5d5d5] hover:cursor-pointer" onMouseEnter={()=>setShowCopyIcon(index)}
                                onMouseLeave={()=>setShowCopyIcon(-1)}
                                onClick={()=>{copyToClipboard(buttonLinks[index])
                                    setShowCopyIcon(-1)
                                }}
                               >
                                    <td className="px-6 py-2 text-[12px]">{ratings[index]}</td>
                                    <td className="px-6 py-2">
                                        <div className="overflow-hidden  max-w-[500px]">
                                            <div className=" text-[10px] truncate text-[#00a3ff]">{link}</div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {showCopyIcon==0 && (
                        <button className="absolute top-[76%] right-[15%]"><MdContentCopy /></button>
                    )}
                      {showCopyIcon==1 && (
                        <button className="absolute top-[80%] right-[15%]"><MdContentCopy /></button>
                    )}
                      {showCopyIcon==2 && (
                        <button className="absolute top-[84%] right-[15%]"><MdContentCopy /></button>
                    )}

                             </div>
                    )}
             
                    <button className=" bg-[#129561] p-2 px-8 rounded mt-10 text-white font-bold"
                    onClick={()=>setFinished(true)}>Finish Up</button>
                </div>
                </>
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