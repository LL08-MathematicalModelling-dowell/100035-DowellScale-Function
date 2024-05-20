import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import { MdManageHistory } from 'react-icons/md';
import { BsArrowLeft} from 'react-icons/bs';
import { toast } from 'react-toastify';
import useGetScale from '../../../../hooks/useGetScale';
import useGetSingleScale from '../../../../hooks/useGetSingleScale';
import Fallback from '../../../../components/Fallback';
import { Button } from '../../../../components/button';


const NpsLiteScale = () => {
    const { slug } = useParams();
    const { isLoading, scaleData, fetchScaleData } = useGetScale();
    const [selectedScore, setSelectedScore] = useState(-1);
    const navigateTo = useNavigate();

    const scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const level=[[0,"Left"],[1,"Center"],[2,"Right"]]

    console.log(scaleData, 'scaleData ***');

    

    useEffect(()=>{
        fetchScaleData('nps-lite-scale');
    },[]);

    const handleSelectScore = (score)=>{
        setSelectedScore(score)
    }
    

    if (isLoading) {
        return <Fallback />;
    }
  return (
    <div className='h-screen  flex flex-col items-center justify-center font-Montserrat font-medium'>
        <div className='w-full h-full flex items-center'>
            <div className={`h-full md:h-full w-full  m-auto flex flex-col lg:flex-row items-center shadow-lg p-2`} 
            >
                <div className={`h-full w-full lg:w-3/12 border overflow-y-auto`}>
                    <h2 className='flex items-center gap-2 p-2 font-medium'>
                        <span className=''>
                        <MdManageHistory className='text-primary'/>
                        </span> Scale History
                    </h2>
                    {scaleData && scaleData?.map((scale, index)=>(
                        <>
                            <Button width={'full'} onClick={()=>navigateTo(`/100035-DowellScale-Function/nps-lite-scale-settings/${scale._id}`)} key={index}>{scale?.settings?.name}</Button>
                        </>
                    ))}

                </div>
                <div className='flex-1 flex flex-col items-center justify-center w-full h-full p-2 border stage lg:w-5/12'>
                    <h3 className='text-center py-5 text-sm font-medium'>SCALE</h3>
                    <div className='w-full flex justify-center md:grid-cols-11 gap-3 bg-gray-300 py-6 px-2 md:px-1'
                    
                    >
                       
                        {
                            level.map((score, index)=>(
                            <button 
                                key={index}
                                onClick={()=>handleSelectScore(score[0])}
                                className={`rounded-lg ${index  === selectedScore
                                  ? 'bg-white' : 'bg-primary text-white'} text-primary h-[3.8rem] w-[14.8rem]`}
                            >{score[1]}</button>
                        ))}
                    </div>
                    
            
                    <div className='flex items-center justify-end w-full my-4'>
                        <Button primary width={'3/4'} onClick={()=>navigateTo(`/100035-DowellScale-Function/create-nps-lite-scale-links`)}>create new scale</Button>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
  )
}

export default NpsLiteScale