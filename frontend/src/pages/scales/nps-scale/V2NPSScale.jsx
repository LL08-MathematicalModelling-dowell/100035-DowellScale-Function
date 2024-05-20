import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import { MdManageHistory } from 'react-icons/md';
import { MdOutlineArrowBackIosNew } from "react-icons/md"
import { toast } from 'react-toastify';
import useGetScale from '../../../hooks/useGetScale';
import useGetSingleScale from '../../../hooks/useGetSingleScale';
import Fallback from '../../../components/Fallback';
import { Button } from '../../../components/button';


const V2NPSScale = () => {
    const { slug } = useParams();
    const { isLoading, scaleData, fetchScaleData } = useGetScale();
    const [selectedScore, setSelectedScore] = useState(-1);
    const navigateTo = useNavigate();

    const scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    

    // if (isLoading) {
    //     return <Fallback />;
    // }
  return (
    <div className='font-medium font-Montserrat'>
        <div className='ml-10 flex justify-start'>
          <MdOutlineArrowBackIosNew style={{width:"25px", height:'30px', marginRight: '5px'}} />
          <div>
            <p style={{fontFamily:"Changa, sans-serif", fontWeight:'600', fontSize: 'large'}}>NPS SCALE</p>
            <p style={{fontWeight:'400', fontSize: 'small'}}>Net promoter score (NPS) is a widely used market research metric that is based on a single survey question</p>
          </div>
        </div>
        <div>
            <div className='mt-10 m-auto w-5/6'>
            <div className= 'bg-[#E8E8E8] w-full rounded-lg h-80'>
                <div className='pt-10 pl-5'>
                    <p>NPS SCALE eg.</p>
                    <p>This is how nps scale would look</p>
                </div>
            <div>
                <p>How was your experience using our product? Please rate your experience below</p>
             {scores.map((score, index)=>(
                <button
                  key={index}
                    onClick={() => handleSelectScore(score)}
                    className={`rounded-lg ${
                    index == selectedScore
                    ? 'bg-white' : 'bg-primary text-white'
                     }  h-[2rem] w-[2rem] md:h-[3rem] md:w-[3rem]`}
                    >
                    {score}
                    </button>
                        ))}
        </div>
        </div>
        </div>
        </div>
    </div>
  )
}

export default V2NPSScale