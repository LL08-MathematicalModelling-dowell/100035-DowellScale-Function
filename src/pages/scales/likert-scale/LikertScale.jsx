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

import ScaleMainScreen from "../ui-scales-helper/ScaleMainScreen";

// const LikertScale = () => {

//   const { slug } = useParams();
//     const { isLoading, scaleData, fetchScaleData } = useGetScale();
//     const [selectedScore, setSelectedScore] = useState(-1);
//     const [buttonBgColor, setButtonBgColor] = useState(false);
//     const [btnText, setBtnText] = useState("");
//     const navigateTo = useNavigate();

//     const scores = ['Strongly Disagree', 'Disagree',  'Moderately disagree','Middly disagree','Neutral','Middly Agree','Moderately agree','Agree', 'Strongly Agree'];
    

//     useEffect(()=>{
//         fetchScaleData('likert-scale');
//     },[]);
//     const handleSelectScore = (score)=>{
//         setSelectedScore(score)
//     }
    

//     if (isLoading) {
//         return <Fallback />;
//     }

//     const handleButtonBgColor = (score) => {
//         setButtonBgColor(true)
//         setBtnText(score)
//     }

//     const handleButtonMouseOut = () => {
//         setButtonBgColor(false)
//     }

//   return (
//     <div className=' h-screen font-medium font-Montserrat'>
//     <div style={{width:"100%",}} className='w-full px-5 py-4 m-auto border border-primary lg:w-10/12'>
//         <div  style={{height:"50em"}} className={` md:h-80 w-full  m-auto flex flex-col lg:flex-row items-center shadow-lg p-2`} 
//         // style={{backgroundColor:`${sigleScaleData && sigleScaleData[0].settings.scalecolor}`}}
//         >
//             <div className={`h-full w-full lg:w-3/12 border overflow-y-auto`}>
//                 <h2 className='flex items-center gap-2 p-2 font-medium'>
//                     <span className=''>
//                     <MdManageHistory className='text-primary'/>
//                     </span> Scale History
//                 </h2>
//                 {/* {scaleData && scaleData?.data?.data.map((scale, index)=>(
//                     <>
//                         <Button width={'full'} onClick={()=>navigateTo(`/nps-scale-settings/${scale._id}`)} key={index}>{scale?.settings?.name}</Button>
//                     </>
//                 ))} */}

//                 {scaleData && scaleData?.data?.data
//                 .slice()
//                 .sort((a, b) => {
//                     const nameA = a?.settings?.name.toLowerCase();
//                     const nameB = b?.settings?.name.toLowerCase();
//                     if (nameA < nameB) return -1;
//                     if (nameA > nameB) return 1;
//                     return 0;
//                 })
//                 .map((scale, index) => (
//                     <Button
//                     width={'full'}
//                     onClick={() => navigateTo(`/100035-DowellScale-Function/likert-scale-settings/${scale._id}`)}
//                     key={index}
//                     >
//                     {scale?.settings?.name}
//                     </Button>
//                 ))
//                 }

//             </div>
//             <div  className='flex-1 w-full h-full p-2 border stage lg:w-5/12'>
//             <h3  className='py-5 text-sm font-medium text-center' style={{marginTop:"10em"}}>SCALE</h3>
//                 <div  className= 'grid gap-3 md:gap-3 md:px-2 py-6 grid-cols-11 md:px-1  justify-center  bg-gray-300'
//                 style={{display:'flex', alignItems:'center',fontSize: 'small', overflow: 'auto'}}>
//                     {scores.map((score, index)=>(
//                         // <button 
//                         //     key={index}
//                         //     onClick={()=>handleSelectScore(score)}
//                         //     className={`rounded-full ${index  > selectedScore ? 'bg-white' : 'bg-primary text-white'} text-primary h-[3.8rem] w-[3.8rem]`}
//                         // >{score}</button>
//                         <button
//                         key={index}
//                         onClick={() => handleSelectScore(score)}
//                         className={`rounded-lg ${
//                         index == selectedScore
//                         ? 'bg-white' : 'bg-primary text-white'
//                         }  h-[3rem] w-[5rem] md:h-[3rem] md:w-[5rem]`}
                        
//                         onMouseEnter={() => handleButtonBgColor(score)}
//                         style={{backgroundColor: buttonBgColor === true && scores[index] === btnText ? 'green':'white', color: buttonBgColor === true && scores[index] === btnText ? 'white':'black'}}
//                 >
//                   {score}
//                 </button>
//                     ))}
//                 </div>
        
//                 <div className='flex items-center justify-end w-full my-4'>
//                     <Button primary width={'3/4'} onClick={()=>navigateTo(`/100035-DowellScale-Function/create-likert-scale`)}>create new scale</Button>
//                 </div>
//             </div>
//         </div>
        
//     </div>
// </div>
//   )
// }

// export default LikertScale

export default function LikertScale(){
    const textContent = {
        scale: "LIKERT SCALE",
        scaleEg: "LIKERT SCALE eg.",
        scaleDescription: "This is how a likert scale would look.",
        experiencePrompt: "How was your experience using our product? Please rate your experience below.",
        experience:["😞 Strongly Disagree", "😔 Disagree", "😔 Neutral", "😄 Agree", "😁 Strongly Agree"],
        configureYourScale: "Configure your scale",
        confirmationScalePrompt: "You won't be able to edit the scale once you confirm it. Are you sure you want to confirm the scale?",
        goBackPrompt: {
            header: "Are you sure?",
            text1: "Changes made so far will not be saved. Do you really",
            text2: "want to cancel the process and go back?"
        },
        confirmScalePrompt: {
            header: "Confirm scale",
            text1: "You won't be able to edit the scale once you confirm",
            text2: "it. Are you sure you want to confirm the scale?"
        },
        finishSharingPrompt: {
            header: "Are you sure?",
            text1: "You want to finish up sharing the scale and go back",
            text2: "to my scales page?"
        }
    };
    
    
    return(
        <ScaleMainScreen textContent={textContent}/>
    )
}