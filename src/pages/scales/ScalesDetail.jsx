import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import { MdManageHistory } from 'react-icons/md';
import { BsArrowLeft} from 'react-icons/bs';
import useGetScale from '../../hooks/useGetScale';
import Fallback from '../../components/Fallback';
import { Button } from '../../components/button';

const ScalesDetail = () => {
    const { slug } = useParams();
    const { isLoading, scaleData, fetchScaleData} = useGetScale();
    const navigateTo = useNavigate();
    console.log(scaleData, 'scaleData')


    useEffect(()=>{
        fetchScaleData(slug);
    },[]);


    if (isLoading) {
        return <Fallback />;
    }
  return (
    <div className='h-screen  flex flex-col items-center justify-center'>
        
        <div className='h-96 w-full lg:w-8/12 flex flex-col lg:flex-row items-center shadow-lg p-2'>
            <div className='h-full w-full lg:w-3/12 border overflow-y-auto  p-'>
                <h2 className='p-2 flex gap-2 items-center'>
                    <span>
                    <MdManageHistory className='text-primary'/>
                    </span> Scale History
                </h2>
                {scaleData && scaleData.map((scale, index)=>(
                    <>
                        <Button width={'full'} onClick={()=>navigateTo(`/scales-settings/${scale?.settings.scale_name || scale?.settings?.scalename}`)} key={index}>{scale?.settings?.scalename || scale?.settings?.scale_name}</Button>
                    </>
                ))}
            </div>
            <div className='h-full w-full lg:w-5/12 border flex-1  p-2'>
                <div className='w-full lg:w-8/12 flex items-center gap-5'>
                    <button 
                        onClick={()=>navigateTo(-1)}
                        className='w-3/12 bg-primary text-white flex items-center justify-center gap-2 hover:bg-gray-700/50 py- px-2 py-2 my-1 capitalize'> 
                    <BsArrowLeft className='text-white' />
                    back</button>
                    <div>
                        <h2 className='text-xl capitalize'>{slug.split('-').join(' ')}</h2>
                    </div>
                </div>
            </div>
        </div>
        <div className='w-full lg:w-8/12 flex items-center justify-end my-4'>
            <Button primary width={3/12} onClick={()=>navigateTo('/create-scales')}>create new scale</Button>
        </div>
    </div>
  )
}

export default ScalesDetail