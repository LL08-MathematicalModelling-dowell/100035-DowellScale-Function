import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useFetchUserContext } from '../../contexts/fetchUserContext';

const Scales = () => {
    const { fetchSessionId } = useFetchUserContext();

   
    const scaleTypes = [
        {
            name:'linkert scale',
            slug:'linkert-scale'
        },
        {
            name:'nps scale',
            slug:'nps-scale'
        },
        {
            name:'staple scale',
            slug:'staple-scale'
        },
        {
            name:'ranking scale',
            slug:'ranking-scale'
        },
    ]

    const navigateTo = useNavigate();

    useEffect(()=>{
        fetchSessionId();
    },[])
  return (
    <div className='h-screen flex flex-cols justify-center items-center'>
        <div className='w-6/12 grid grid-cols-2 gap-4'>
            {scaleTypes.map((scale)=>(
                <button onClick={()=>navigateTo(`/all-scales/${scale.slug}`)} key={scale.slug} 
                    className='w-full bg-primary text-white hover:bg-gray-700/50 py-1 px-2 py-2 my-1 capitalize'>
                    {scale.name}
                </button>
            ))}
        </div>
    </div>
  )
}

export default Scales