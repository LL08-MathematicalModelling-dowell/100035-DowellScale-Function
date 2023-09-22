import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { MdManageHistory } from 'react-icons/md'
import useGetScale from '../../hooks/useGetScale';
import Fallback from '../../components/Fallback';

const ScalesDetail = () => {
    const { slug } = useParams();
    const { isLoading, scaleData, fetchScaleData} = useGetScale();
    console.log(scaleData, 'scaleData')


    useEffect(()=>{
        fetchScaleData(slug);
    },[]);


    if (isLoading) {
        return <Fallback />;
    }
  return (
    <div className='h-screen grid grid-cols place-items-center'>
        <div className='h-96 w-full lg:w-8/12 flex flex-col lg:flex-row items-center shadow-lg p-2'>
            <div className='h-full w-full lg:w-3/12 border overflow-y-auto  p-'>
                <h2 className='p-2 flex gap-2 items-center'>
                    <span>
                    <MdManageHistory className='text-primary'/>
                    </span> Scale History
                </h2>
                {scaleData && scaleData.map((scale)=>(
                    <>
                        <button className='w-full bg-gray-700/20 hover:bg-gray-700/50 py-1 px-2 my-1'>
                            {scale?.settings?.scalename || scale?.settings?.scale_name}
                            {console.log(scale?.settings?.scale_name, '8888888*****')}
                        </button>
                    </>
                ))}
            </div>
            <div className='h-full w-full lg:w-5/12 border flex-1  p-2'>
                two
            </div>
        </div>
    </div>
  )
}

export default ScalesDetail