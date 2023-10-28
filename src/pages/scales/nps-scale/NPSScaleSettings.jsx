import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { useParams, useNavigate } from "react-router-dom";
import useGetSingleScale from "../../../hooks/useGetSingleScale";
import Fallback from "../../../components/Fallback";
import { Button } from "../../../components/button";

const NPSScaleSettings = () => {
    const { slug } = useParams();
    const { loading, sigleScaleData, fetchSingleScaleData } = useGetSingleScale();

    const [selectedScore, setSelectedScore] = useState(null);

    const scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    console.log(sigleScaleData, '*** sigleScaleData');
    console.log(slug, '*** slug');

    const handleSelectScore = (score)=>{
      setSelectedScore(score)
  }

    const handleFetchSingleScale = async(scaleId)=>{
      await fetchSingleScaleData(scaleId);
  }

  useEffect(() => {
      const fetchData = async () => {
          await handleFetchSingleScale(slug);
      }
      fetchData();
  }, [slug]);


  if (loading) {
    return <Fallback />;
  }
  return (
    <div className='h-screen  flex flex-col items-center justify-center font-Montserrat font-medium font-Montserrat'>
        <div className='border border-primary w-full lg:w-9/12 m-auto py-4 px-5'>
            <div className={`h-80 md:h-80 w-full  m-auto flex flex-col lg:flex-row items-center shadow-lg p-2`} 
            >
                <div className='stage h-full w-full lg:w-5/12 border flex-1  p-2'>
                    <h3 className='text-center py-5 text-sm font-medium'>SCALE</h3>
                    <div className='grid grid-cols-4 md:grid-cols-11 gap-3 bg-gray-300 py-6 px-2 md:px-1'>
                        {scores.map((score, index)=>(
                            <button 
                                key={index}
                                onClick={()=>handleSelectScore(score)}
                                className={`rounded-full ${index  > selectedScore ? 'bg-white' : 'bg-primary text-white'} text-primary h-[3.8rem] w-[3.8rem]`}
                            >{score}</button>
                        ))}
                    </div>
                    <div className='flex items-center justify-between my-3'>
                        <h4>Very unlikely</h4>
                        <h4>Select score</h4>
                        <h4>Very likely</h4>
                    </div>
            
                    {/* <div className='w-full flex items-center justify-end my-4'>
                        <Button primary width={'3/4'} onClick={()=>navigateTo(`/create-nps-scale`)}>create new scale</Button>
                    </div> */}
                </div>
            </div>
            
        </div>
    </div>
  )
}

export default NPSScaleSettings