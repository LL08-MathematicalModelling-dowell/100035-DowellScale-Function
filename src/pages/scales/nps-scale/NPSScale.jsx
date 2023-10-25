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
    const navigateTo = useNavigate();

    useEffect(()=>{
        fetchScaleData(slug);
    },[]);
    // console.log(scaleData.data.data)

    if (isLoading) {
        return <Fallback />;
    }
  return (
    <div className='h-screen  flex flex-col items-center justify-center font-Montserrat'>
        <div className='border border-primary w-full lg:w-8/12 m-auto py-4 px-10'>
            <h2 className='text-center py-3'>Ranking Scale Name:  
            {/* <span className='font-medium text-sm'>{sigleScaleData ?
                        sigleScaleData?.map((scale)=>(
                            <span>{scale?.settings?.scalename || scale?.settings?.scale_name}</span>
                        )) : (scaleData[0]?.settings?.scalename || scaleData[0]?.settings?.scale_name)
                }</span> */}
            </h2>
            <div className={`h-96 w-full  m-auto flex flex-col lg:flex-row items-center shadow-lg p-2`} 
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
            
                    
                </div>
            </div>
            <div className='w-full flex items-center justify-end my-4'>
                <Button primary width={'3/4'} onClick={()=>navigateTo(`/create-scale?slug=${slug}`)}>create new scale</Button>
            </div>
        </div>
    </div>
  )
}

export default NPSScale