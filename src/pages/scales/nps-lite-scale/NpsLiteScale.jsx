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
import scaleconfirmedimage from "../../../../public/scaleconfirmed.png?"
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
       <div className="fixed top-1/3 left-1/2 w-max h-max p-5 bg-white rounded-lg ">
         <p className="font-bold">{header}</p>
         <p className="mt-3 font-medium">{text1}</p>
         <p className="font-medium">{text2}</p>
         <div className="flex gap-4 justify-center items-center mt-3">
         <button className="p-2 px-4 bg-green-600 rounded-lg" onClick={onCancel}>No</button>
         <button className="p-2 px-4 bg-red-600 rounded-lg" onClick={()=>onConfirm()}>Yes</button>
         </div>
       </div>
    )
}


 
      const copyToClipboard = () => {
        navigator.clipboard.writeText(copyData)
            .then(() => setIsCopied(true))
            .catch((error) => console.error('Error copying to clipboard: ', error));
    };
    return(
          <div className="flex relative">
            
          <SideBar/>
          <div className="h-full relative overflow-hidden flex flex-col justify-center items-center w-[80%]">
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

                        .button-changes {
                            padding: 5px 10px;
                            font-size:0.8rem;
                        }
                        .tracker-changes {
                            padding: 0px 8px;
                            font-size:0.8rem;
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
                            .tracker-changes {
                                padding: 8px 16px;
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
                        @media (min-width: 514px) {
                        .button-changes {
                            padding: 10px 10px;
                            font-size:1rem;
                        }
                    }
                        @media (min-width: 818px) {
                            .button-changes {
                                padding: 10px 40px;
                                font-size:1rem;
                            }
                    }
                        @media (min-width: 969px) {
                            .button-changes {
                                padding: 10px 60px;
                                font-size:1rem;
                            }
                    }
                        @media (min-width: 1121px) {
                        .button-changes {
                            padding: 10px 80px;
                            font-size:1rem;
                        }
                    }
                        
                        `
                    }
                </style>
       
               

                <div className="mt-5  bg-gray-300 rounded-lg  h-max  w-[80%] div-changes">
                    <div className="flex flex-col justify-start items-start">
                    <p className="font-bold">NPS LITE SCALE eg.</p>
                    <p className="font-sans font-medium text-sm">This is how a nps lite scale would look.</p>
                    </div>
                    <p className="flex justify-center items-center font-sans font-medium p-3  mt-5 text-changes">How was your experience using our product? Please rate your experience below.</p>
                  
             
                    <div className="flex justify-center items-center gap-12 mt-5">
                        <button className="bg-red-500  rounded-lg button-changes">Bad 😞</button>
                        <button  className="bg-yellow-400  rounded-lg button-changes">Average 😐</button>
                        <button  className="bg-green-500  rounded-lg button-changes" >Excellent 😄</button>
                    </div>
                </div>
             
         
             
            <div className="mt-14 pt-10 bg-gray-300 rounded-lg  h-max w-[80%] div-changes">
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
                <>
                 <p className="w-full  font-bold flex justify-center items-center">Your NPS LITE SCALE has been confirmed!</p>
                 <div className="flex flex-col justify-center items-center gap-3 mt-10">
                    <img src={scaleconfirmedimage}  alt='image'></img>
                    <p className="font-medium">You can start sharing your scale on different platforms</p>
                    <button className=" font-medium p-2 px-12 bg-green-600 rounded mt-12 text-white"
                    onClick={()=>{handleSharing(formData,setButtonLinks,setButtonLinksGenerated)}}>Start Sharing</button>
                 </div>
                </>
                }
               
            </div>
            </>
            ):(
                <>
                <div className="flex flex-col justify-center items-center bg-gray-300 rounded-lg  h-max w-[80%] p-5 font-bold relative" >
                    <p>Share your NPS LITE SCALE across different platforms and add to your customer touch points</p>
                    <div className="flex justify-center items-center gap-5 mt-10">
                        <button className={`${showData=="website"? "bg-green-600" :"bg-blue-500" }  p-2 px-8 rounded text-white font-bold`}
                        onClick={()=>{setShowData("website")}}>Website</button>
                        <button  className={`${showData=="email"? "bg-green-600" :"bg-blue-500" }  p-2 px-8 rounded text-white font-bold`}
                        onClick={()=>{setShowData("email")}}>Email</button>
                        <button  className={`${showData=="product"? "bg-green-600" :"bg-blue-500" }  p-2 px-8 rounded text-white font-bold`}
                        onClick={()=>{setShowData("product")}}>Product</button>
                    </div>
                    {showData.length!=0 && (
                       <>
                         <div className="absolute top-[63%] right-[22%]  p-2">
                    <BsThreeDotsVertical className="cursor-pointer" onClick={()=>setShowOptions((prev)=>!prev)}/>
                </div>
                {showOptions && (
                    <div className="text-xs flex flex-col absolute top-[68%] right-[10%] bg-white p-2 gap-2 divide divide-x divide-gray-200 font-normal justify-center items-start">
                    <button className="flex justify-center text-[12px] items-center gap-2"><MdContentCopy/> Copy all links</button>
                    <div className=" h-[1px] w-full  bg-gray-600 "></div> {/* Line */}
                    <button className="flex justify-center items-center gap-2 text-[12px]"><PiFileCsvDuotone/> Generate a .csv file</button>
                    </div>
                )}
                       </>
                    )}
                  
                    {showData=="website" && (
                             <div className="flex flex-col justify-center items-center font-normal ">
                                <p className=" p-2 mt-3">Copy the source code of your scale and integrate it on your website</p>
                                <div className="h-[300px] w-[700px] bg-white overflow-auto p-2 text-[12px]">
                                    <pre>
                                   {copyData}
                                   </pre>
                                  <button className="flex justify-center text-[12px] bg-gray-200 p-2 items-center gap-2 absolute top-[21%] right-[7%]"
                                  onClick={()=>{copyToClipboard()}}> <MdContentCopy /> Copy code</button>
                              {isCopied && <p className="absolute top-[26%] right-[10%]">Copied!</p>}
                                </div>
                                 <p className=" p-2 ">Use the button links to add them to your scale</p>
                        <table className="w-full md:w-1/2 divide-y divide-gray-200 overflow-hidden mt-5 " >
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-2 py-3 text-left text-[12px] font-bold text-black uppercase ">Scale Values</th>
                                <th className="px-6 py-3 text-left text-[12px] font-bold text-black uppercase ">Button Links</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {buttonLinks.map((link, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="px-6 py-4 text-[12px]">{ratings[index]}</td>
                                    <td className="px-6 py-4">
                                        <div className="overflow-hidden  max-w-[300px]">
                                            <div className="text-blue-500 text-[10px] truncate">{link}</div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                             </div>
                    )}
             
                    <button className=" bg-green-700 p-2 px-8 rounded mt-10 text-white font-bold"
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