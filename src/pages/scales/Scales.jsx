
import React from 'react';
import { useNavigate } from 'react-router';

const Scales = () => {
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
  return (
    <div className='h-screen flex flex-cols justify-center items-center'>
        <div className='grid grid-cols-2 gap-4'>
            {scaleTypes.map((scale)=>(
                <button onClick={()=>navigateTo(`/all-scales/${scale.slug}`)} key={scale.slug} 
                    className='bg-gray-500'>
                    {scale.name}
                </button>
            ))}
        </div>
    </div>
  )
}

export default Scales