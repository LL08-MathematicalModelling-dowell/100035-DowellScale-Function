import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import useGetScale from '../../hooks/useGetScale';
import Fallback from '../../components/Fallback';

const ScalesDetail = () => {
    const { slug } = useParams();
    const { isLoading, scaleData, fetchScaleData} = useGetScale();
    console.log(scaleData, 'scaleData')


    useEffect(()=>{
        fetchScaleData(slug);
    },[slug]);


    if (isLoading) {
        return <Fallback />;
    }
  return (
    <div className='h-screen flex flex-cols justify-center items-center'>
        <div className='grid grid-cols-2 gap-4'>
        slug jjjjjjjjjjjjjjjjjjjjjj {slug}
        </div>
    </div>
  )
}

export default ScalesDetail