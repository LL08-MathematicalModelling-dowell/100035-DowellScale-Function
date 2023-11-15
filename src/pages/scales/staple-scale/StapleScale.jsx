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


const StapleScale = () => {
    const { slug } = useParams();
    const { isLoading, scaleData, fetchScaleData } = useGetScale();
    const [selectedScore, setSelectedScore] = useState(-6);
    const navigateTo = useNavigate();

    // const scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const scores = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];

    console.log(scaleData?.data, 'staple scale')
    

    useEffect(()=>{
        fetchScaleData('staple-scale');
    },[]);

    const handleSelectScore = (score)=>{
        setSelectedScore(score)
    }
    

    if (isLoading) {
        return <Fallback />;
    }
  return (
    <div className='h-screen  flex flex-col items-center justify-center font-Montserrat font-medium font-Montserrat'>
        <div className='border border-primary w-full lg:w-10/12 m-auto py-4 px-5'>
            <div className={`h-80 md:h-80 w-full  m-auto flex flex-col lg:flex-row items-center shadow-lg p-2`} 
            // style={{backgroundColor:`${sigleScaleData && sigleScaleData[0].settings.scalecolor}`}}
            >
                <div className={`h-full w-full lg:w-3/12 border overflow-y-auto`}>
                    <h2 className='p-2 flex gap-2 items-center font-medium'>
                        <span className=''>
                        <MdManageHistory className='text-primary'/>
                        </span> Scale History
                    </h2>
                    {scaleData && scaleData?.data?.map((scale, index) => (
                        <Button
                        width={'full'}
                        onClick={() => navigateTo(`/staple-scale-settings/${scale._id}`)}
                        key={index}
                        >
                        {scale?.settings?.name}
                        </Button>
                    ))
                    }

                </div>
                <div className='stage h-full w-full lg:w-5/12 border flex-1  p-2'>
                    <h3 className='text-center py-5 text-sm font-medium'>SCALE</h3>
                    <div className='grid grid-cols-4 md:grid-cols-11 gap-3 bg-gray-300 py-6 px-2 md:px-1'>
                        {scores.map((score, index)=>(
                            <button 
                                key={index}
                                onClick={()=>handleSelectScore(score)}
                                className={`rounded-full ${index - 5  > selectedScore ? 'bg-white' : 'bg-primary text-white'} text-primary h-[3.8rem] w-[3.8rem]`}
                            >{score}</button>
                        ))}
                    </div>
                    <div className='flex items-center justify-between my-3'>
                        <h4>Very unlikely</h4>
                        <h4></h4>
                        <h4>Very likely</h4>
                    </div>
            
                    <div className='w-full flex items-center justify-end my-4'>
                        <Button primary width={'3/4'} onClick={()=>navigateTo(`/create-staple-scale`)}>create new scale</Button>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
  )
}

export default StapleScale