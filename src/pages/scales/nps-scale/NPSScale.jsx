import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import { MdManageHistory } from 'react-icons/md';
import { BsArrowLeft} from 'react-icons/bs';
import { toast } from 'react-toastify';
import useGetScale from '../../../hooks/useGetScale';
import useGetSingleScale from '../../../hooks/useGetSingleScale';
import Fallback from '../../../components/Fallback';
import { Button } from '../../../components/button';


const NPSScale = () => {
    const { slug } = useParams();
    const { isLoading, scaleData, fetchScaleData } = useGetScale();
    const [selectedScore, setSelectedScore] = useState(null);
    const navigateTo = useNavigate();

    const scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    

    useEffect(()=>{
        fetchScaleData(slug);
    },[]);

    const handleSelectScore = (score)=>{
        setSelectedScore(score)
    }
    console.log(selectedScore, 'score **')

    if (isLoading) {
        return <Fallback />;
    }
  return (
    <div className='h-screen  flex flex-col items-center justify-center font-Montserrat'>
        <div className='border border-primary w-full lg:w-10/12 m-auto py-4 px-10'>
            <div className={`h-64 w-full  m-auto flex flex-col lg:flex-row items-center shadow-lg p-2`} 
            // style={{backgroundColor:`${sigleScaleData && sigleScaleData[0].settings.scalecolor}`}}
            >
                <div className={`h-full w-full lg:w-3/12 border overflow-y-auto`}>
                    <h2 className='p-2 flex gap-2 items-center font-medium'>
                        <span className=''>
                        <MdManageHistory className='text-primary'/>
                        </span> Scale History
                    </h2>
                    {scaleData && scaleData?.data?.data.map((scale, index)=>(
                        <>
                            <Button width={'full'} onClick={()=>navigateTo(`/ranking-scale-settings/${scale._id}`)} key={index}>{scale?.settings?.name}</Button>
                        </>
                    ))}
                </div>
                <div className='stage h-full w-full lg:w-5/12 border flex-1  p-2'>
                    <h3 className='text-center py-5'>SCALE</h3>
                    <div className='flex items-center justify-center gap-5 bg-gray-300 py-6'>
                        {scores.map((score, index)=>(
                            <button 
                                key={index}
                                onClick={()=>handleSelectScore(score)}
                                className={`rounded-full ${index  > selectedScore ? 'bg-white' : 'bg-primary text-white'} text-primary h-12 w-12`}
                            >{score}</button>
                        ))}
                    </div>
            
                    <div className='w-full flex items-center justify-end my-4'>
                        <Button primary width={'3/4'} onClick={()=>navigateTo(`/create-scale?slug=${slug}`)}>create new scale</Button>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
  )
}

export default NPSScale