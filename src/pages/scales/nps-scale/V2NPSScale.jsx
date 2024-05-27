// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router';
// import { useNavigate } from 'react-router';
// import { MdManageHistory } from 'react-icons/md';
// import { MdOutlineArrowBackIosNew } from "react-icons/md"
// import { toast } from 'react-toastify';
// import useGetScale from '../../../hooks/useGetScale';
// import useGetSingleScale from '../../../hooks/useGetSingleScale';
// import Fallback from '../../../components/Fallback';
// import { Button } from '../../../components/button';


// const V2NPSScale = () => {
//     const { slug } = useParams();
//     const { isLoading, scaleData, fetchScaleData } = useGetScale();
//     const [selectedScore, setSelectedScore] = useState(-1);
//     const navigateTo = useNavigate();

//     const scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    

//     // if (isLoading) {
//     //     return <Fallback />;
//     // }
//   return (
//     <div className='font-medium font-Montserrat'>
//         <div className='ml-10 flex justify-start'>
//           <MdOutlineArrowBackIosNew style={{width:"25px", height:'30px', marginRight: '5px'}} />
//           <div>
//             <p style={{fontFamily:"Changa, sans-serif", fontWeight:'600', fontSize: 'large'}}>NPS SCALE</p>
//             <p style={{fontWeight:'400', fontSize: 'small'}}>Net promoter score (NPS) is a widely used market research metric that is based on a single survey question</p>
//           </div>
//         </div>
//         <div>
//             <div className='mt-10 m-auto w-5/6'>
//             <div className= 'bg-[#E8E8E8] w-full rounded-lg h-80'>
//                 <div className='pt-10 pl-5'>
//                     <p>NPS SCALE eg.</p>
//                     <p>This is how nps scale would look</p>
//                 </div>
//             <div>
//                 <p>How was your experience using our product? Please rate your experience below</p>
//              {scores.map((score, index)=>(
//                 <button
//                   key={index}
//                     onClick={() => handleSelectScore(score)}
//                     className={`rounded-lg ${
//                     index == selectedScore
//                     ? 'bg-white' : 'bg-primary text-white'
//                      }  h-[2rem] w-[2rem] md:h-[3rem] md:w-[3rem]`}
//                     >
//                     {score}
//                     </button>
//                         ))}
//         </div>
//         </div>
//         </div>
//         </div>
//     </div>
//   )
// }

// export default V2NPSScale



import ScaleMainScreen from "../ui-scales-helper/ScaleMainScreen";


export default function NpsScale(){
   


const textContent = {
    scale: "NPS SCALE",
    scaleEg: "NPS SCALE eg.",
    scaleDescription: "This is how a nps  scale would look.",
    experiencePrompt: "How was your experience using our product? Please rate your experience below.",
    experience:[0,1,2,3,4,5,6,7,8,9,10],
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